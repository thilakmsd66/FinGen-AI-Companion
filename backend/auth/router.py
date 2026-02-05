from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
import json
import hashlib

from .password_reset import generate_reset_token, verify_reset_token

router = APIRouter(prefix="/auth", tags=["Auth"])

BASE_DIR = Path(__file__).resolve().parents[1]
USERS_FILE = BASE_DIR / "storage" / "users.json"

# ---------- HELPERS ----------
def read_users():
    if not USERS_FILE.exists():
        return []
    return json.loads(USERS_FILE.read_text())

def write_users(users):
    USERS_FILE.write_text(json.dumps(users, indent=2))

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- MODELS ----------
class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ---------- ROUTES ----------
@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    users = read_users()
    if not any(u["email"] == req.email for u in users):
        raise HTTPException(status_code=404, detail="Email not registered")

    token = generate_reset_token(req.email)

    # DEV MODE: return token (simulate email)
    return {
        "message": "Password reset token generated",
        "reset_token": token
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    email = verify_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    users = read_users()
    for u in users:
        if u["email"] == email:
            u["password"] = hash_password(req.new_password)

    write_users(users)
    return {"message": "Password reset successful"}
