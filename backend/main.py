from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime, timedelta
import json
import hashlib
import uuid
import smtplib
import os
from email.message import EmailMessage
from typing import List, Optional
import ollama

# ==================================================
# APP INIT
# ==================================================
app = FastAPI(
    title="FinGen AI Backend",
    description="State Street ASM L2 Support Assistant (KB-powered)",
    version="1.5.0"
)

# ==================================================
# CORS
# ==================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# PATHS
# ==================================================
BASE_DIR = Path(__file__).parent
STORAGE_DIR = BASE_DIR / "storage"
KB_DIR = BASE_DIR / "data" / "documents"

STORAGE_DIR.mkdir(exist_ok=True)
KB_DIR.mkdir(parents=True, exist_ok=True)

USERS_FILE = STORAGE_DIR / "users.json"
RESET_FILE = STORAGE_DIR / "reset_tokens.json"
ASSESS_FILE = STORAGE_DIR / "assessments.json"

# ==================================================
# HELPERS
# ==================================================
def read_json(path: Path):
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(path: Path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

# ==================================================
# MODELS
# ==================================================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[str]] = []

class AssessmentRequest(BaseModel):
    question: str
    answer: str
    topic: Optional[str] = None


# ==================================================
# AUTH
# ==================================================
@app.post("/register")
def register(req: RegisterRequest):
    users = read_json(USERS_FILE)
    email = req.email.lower().strip()

    if any(u["email"] == email for u in users):
        raise HTTPException(400, "User already exists")

    users.append({
        "id": str(uuid.uuid4()),
        "name": req.name,
        "email": email,
        "password": hash_password(req.password),
        "role": req.role
    })

    write_json(USERS_FILE, users)
    return {"message": "Account created"}

@app.post("/login")
def login(req: LoginRequest):
    users = read_json(USERS_FILE)
    email = req.email.lower().strip()

    user = next((u for u in users if u["email"] == email), None)
    if not user or user["password"] != hash_password(req.password):
        raise HTTPException(401, "Invalid credentials")

    return {"user": user}

# ==================================================
# KNOWLEDGE HUB
# ==================================================
@app.get("/knowledge/list")
def list_documents():
    return {"documents": [f.name for f in KB_DIR.iterdir() if f.is_file()]}

@app.post("/knowledge/upload")
def upload_document(file: UploadFile = File(...)):
    path = KB_DIR / file.filename
    with open(path, "wb") as f:
        f.write(file.file.read())
    return {"message": "Uploaded"}

@app.get("/knowledge/read/{filename}")
def read_document(filename: str):
    path = KB_DIR / filename
    if not path.exists():
        raise HTTPException(404, "Document not found")
    return {"filename": filename, "content": path.read_text(encoding="utf-8")}

# ==================================================
# KB LOADERS
# ==================================================
def read_all_documents() -> str:
    return "\n\n".join(
        f.read_text(encoding="utf-8")
        for f in KB_DIR.iterdir()
        if f.suffix.lower() in [".txt", ".md", ".json"]
    )

# ==================================================
# CHAT (STRICT KB)
# ==================================================
@app.post("/chat")
def chat(req: ChatRequest):
    knowledge = read_all_documents()
    if not knowledge.strip():
        return {"answer": "Knowledge base is empty."}

    prompt = f"""
Answer ONLY from the knowledge below.
Be concise and professional.

KNOWLEDGE:
{knowledge}

QUESTION:
{req.question}
"""

    res = ollama.chat(
        model="llama3.2:3b",
        messages=[{"role": "user", "content": prompt}],
        stream=False
    )

    return {"answer": res["message"]["content"].strip()}

# ==================================================
# ASSESSMENT QUESTION (KB ONLY)
# ==================================================
@app.get("/assessment/question")
def assessment_question():
    knowledge = read_all_documents()
    if not knowledge.strip():
        raise HTTPException(400, "Knowledge base is empty")

    system_prompt = """
Generate ONE realistic ASM L2 assessment question
strictly from the knowledge provided.

Return ONLY valid JSON:
{
  "question": "...",
  "topic": "Custody | Cash | Corporate Actions | Reporting | Incident Management"
}
"""

    res = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": knowledge[:6000]}
        ],
        stream=False
    )

    raw = res["message"]["content"]
    try:
        start, end = raw.find("{"), raw.rfind("}") + 1
        return json.loads(raw[start:end])
    except Exception:
        return {
            "question": "Explain the purpose of reconciliation in custody banking.",
            "topic": "Custody"
        }

# ==================================================
# ASSESSMENT EVALUATION (STRICT KB)
# ==================================================
@app.post("/assess")
def assess(req: AssessmentRequest):
    knowledge = read_all_documents()

    if not knowledge.strip():
        return {
            "score": 0,
            "category": "Incorrect",
            "feedback": "Knowledge base is empty.",
            "expected_points": []
        }

    # 🔎 Auto-detect topic if missing
    topic = req.topic
    if not topic:
        q = req.question.lower()
        if "custody" in q:
            topic = "Custody"
        elif "cash" in q:
            topic = "Cash"
        elif "corporate" in q or "ca" in q:
            topic = "Corporate Actions"
        elif "report" in q or "nav" in q:
            topic = "Reporting"
        elif "incident" in q:
            topic = "Incident Management"
        else:
            topic = "General"

    system_prompt = f"""
You are a State Street Bank ASM L2 Support Evaluator.

STRICT RULES:
- Evaluate ONLY using the knowledge below
- No external assumptions
- Score from 0 to 10
- Categories:
  0–3  Incorrect
  4–6  Partially Correct
  7–8  Mostly Correct
  9–10 Excellent
- Feedback: 2–3 short professional lines
- Expected points must come from KB
- RETURN ONLY VALID JSON
- NO markdown
- NO extra text

JSON FORMAT:
{{
  "score": number,
  "category": "Incorrect | Partially Correct | Mostly Correct | Excellent",
  "feedback": "short feedback",
  "expected_points": ["point1", "point2", "point3"]
}}

KNOWLEDGE:
{knowledge}

QUESTION:
{req.question}
"""

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.answer}
        ],
        stream=False
    )

    raw = response["message"]["content"].strip()

    try:
        result = json.loads(raw)
    except Exception:
        result = {
            "score": 0,
            "category": "Incorrect",
            "feedback": "Answer could not be evaluated due to formatting issues.",
            "expected_points": []
        }

    # 💾 Persist
    assessments = read_json(ASSESS_FILE)
    assessments.append({
        **result,
        "question": req.question,
        "answer": req.answer,
        "topic": topic,
        "timestamp": datetime.utcnow().isoformat()
    })
    write_json(ASSESS_FILE, assessments)

    return result


# ==================================================
# HEALTH
# ==================================================
@app.get("/")
def health():
    return {
        "status": "FinGen Backend Running",
        "rag": "Enabled (strict KB)",
        "memory": "Last 6 messages",
        "ai": "Ollama llama3.2:3b"
    }

# =========================
# READ DOCUMENT CONTENT
# =========================
@app.get("/knowledge/read/{filename}")
def read_document(filename: str):
    path = KB_DIR / filename

    if not path.exists():
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "filename": filename,
        "content": path.read_text(encoding="utf-8")
    }
    

@app.get("/analytics/overview")
def analytics_overview():
    assessments = read_json(ASSESS_FILE)

    if not assessments:
        return {
            "attempted": 0,
            "average_score": 0,
            "coverage": 0,
            "improvement": 0
        }

    now = datetime.utcnow()
    last_30 = now - timedelta(days=30)
    prev_30 = now - timedelta(days=60)

    recent = []
    previous = []

    for a in assessments:
        ts = datetime.fromisoformat(a["timestamp"])
        if ts >= last_30:
            recent.append(a)
        elif prev_30 <= ts < last_30:
            previous.append(a)

    attempted = len(recent)

    avg_score = round(
        sum(a["score"] for a in recent) / len(recent), 1
    ) if recent else 0

    prev_avg = (
        sum(a["score"] for a in previous) / len(previous)
        if previous else avg_score
    )

    improvement = round(
        ((avg_score - prev_avg) / prev_avg) * 100, 1
    ) if prev_avg else 0

    # Knowledge coverage (basic heuristic)
    topics = set()
    for a in assessments:
        q = a["question"].lower()
        if "custody" in q:
            topics.add("Custody")
        if "cash" in q:
            topics.add("Cash")
        if "corporate" in q or "ca" in q:
            topics.add("Corporate Actions")
        if "report" in q or "nav" in q:
            topics.add("Reporting")

    coverage = min(100, len(topics) * 25)

    return {
        "attempted": attempted,
        "average_score": avg_score,
        "coverage": coverage,
        "improvement": improvement
    }




