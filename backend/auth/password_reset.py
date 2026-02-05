import secrets
from datetime import datetime, timedelta

RESET_TOKENS = {}  # {token: {email, expires}}

def generate_reset_token(email: str) -> str:
    token = secrets.token_urlsafe(32)
    RESET_TOKENS[token] = {
        "email": email,
        "expires": datetime.utcnow() + timedelta(minutes=15)
    }
    return token

def verify_reset_token(token: str):
    data = RESET_TOKENS.get(token)
    if not data:
        return None

    if datetime.utcnow() > data["expires"]:
        del RESET_TOKENS[token]
        return None

    return data["email"]
