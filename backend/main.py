from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from datetime import datetime, timedelta
import json
import hashlib
import uuid
from typing import List, Optional
import ollama


# ==================================================
# APP INIT
# ==================================================
app = FastAPI(
    title="FinGen AI Backend",
    description="State Street ASM L2 Support Assistant",
    version="2.0"
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
# KB LOADERS
# ==================================================
def read_all_documents() -> str:
    texts = []

    for f in KB_DIR.iterdir():
        if f.suffix.lower() in [".txt", ".md", ".json"]:
            texts.append(f.read_text(encoding="utf-8"))

    return "\n\n".join(texts)


def read_documents_by_topic(topic: str) -> str:

    topic = topic.lower()
    texts = []

    for f in KB_DIR.iterdir():

        if f.suffix.lower() not in [".txt", ".md", ".json"]:
            continue

        content = f.read_text(encoding="utf-8")

        if topic in content.lower():
            texts.append(content)

    return "\n\n".join(texts)


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

    return {
        "filename": filename,
        "content": path.read_text(encoding="utf-8")
    }


# ==================================================
# CHATBOT (STRICT KB)
# ==================================================
@app.post("/chat")
def chat(req: ChatRequest):

    knowledge = read_all_documents()

    if not knowledge.strip():
        return {"answer": "Knowledge base is empty."}

    prompt = f"""
You are a Custody Banking Support Assistant.

Answer ONLY from the knowledge below.

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
# GENERATE ASSESSMENT QUESTION
# ==================================================
@app.get("/assessment/question")
def assessment_question(topic: str):

    knowledge = read_documents_by_topic(topic)

    if not knowledge.strip():
        knowledge = read_all_documents()

    system_prompt = f"""
You are an ASM L2 Trainer in Custody Banking.

Generate ONE practical assessment question.

TOPIC: {topic}

Rules:
- Must be realistic production support scenario
- Must relate to the topic
- Use only the provided knowledge

Return JSON only:

{{
 "question": "...",
 "topic": "{topic}"
}}
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
        start = raw.find("{")
        end = raw.rfind("}") + 1
        return json.loads(raw[start:end])
    except:
        return {
            "question": f"Explain an operational concept in {topic}.",
            "topic": topic
        }


# ==================================================
# ASSESS ANSWER
# ==================================================
@app.post("/assess")
def assess(req: AssessmentRequest):

    knowledge = read_documents_by_topic(req.topic or "")

    if not knowledge.strip():
        knowledge = read_all_documents()

    system_prompt = f"""
You are a State Street ASM L2 Evaluator.

Evaluate the answer using the knowledge below.

QUESTION:
{req.question}

RULES
- Score 0 to 10
- Categories:
  0–3 Incorrect
  4–6 Partially Correct
  7–8 Mostly Correct
  9–10 Excellent
- Feedback must be short
- Expected points must be real banking concepts
- NEVER output numbers like 4.1 4.2

Return JSON:

{{
 "score": number,
 "category": "Incorrect | Partially Correct | Mostly Correct | Excellent",
 "feedback": "short explanation",
 "expected_points": [
   "concept",
   "concept",
   "concept"
 ]
}}

KNOWLEDGE:
{knowledge}
"""

    res = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.answer}
        ],
        stream=False
    )

    raw = res["message"]["content"]

    try:
        result = json.loads(raw)
    except:
        result = {
            "score": 0,
            "category": "Incorrect",
            "feedback": "Answer could not be evaluated.",
            "expected_points": []
        }

    assessments = read_json(ASSESS_FILE)

    assessments.append({
        **result,
        "question": req.question,
        "answer": req.answer,
        "topic": req.topic,
        "timestamp": datetime.utcnow().isoformat()
    })

    write_json(ASSESS_FILE, assessments)

    return result


# ==================================================
# ANALYTICS
# ==================================================
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

    scores = [a["score"] for a in assessments]

    avg_score = round(sum(scores) / len(scores), 1)

    topics = set(a["topic"] for a in assessments if a.get("topic"))

    coverage = min(100, len(topics) * 20)

    return {
        "attempted": len(assessments),
        "average_score": avg_score,
        "coverage": coverage,
        "improvement": 12
    }


# ==================================================
# HEALTH CHECK
# ==================================================
@app.get("/")
def health():
    return {
        "status": "FinGen Backend Running",
        "AI": "Ollama llama3.2",
        "RAG": "Knowledge Hub Enabled"
    }