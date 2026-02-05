from fastapi import APIRouter
from pathlib import Path
import shutil

router = APIRouter(prefix="/admin", tags=["Admin"])

PENDING_DIR = Path("backend/data/knowledge/pending")
APPROVED_DIR = Path("backend/data/knowledge/texts")

@router.get("/pending")
def list_pending():
    return [f.name for f in PENDING_DIR.glob("*.txt")]

@router.post("/approve/{filename}")
def approve_knowledge(filename: str):
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    src = PENDING_DIR / filename
    dst = APPROVED_DIR / filename.replace("pending_", "learned_")

    shutil.move(src, dst)
    return {"status": "approved"}

@router.delete("/reject/{filename}")
def reject_knowledge(filename: str):
    file = PENDING_DIR / filename
    if file.exists():
        file.unlink()
    return {"status": "rejected"}
