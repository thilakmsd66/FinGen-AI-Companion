from fastapi import APIRouter, UploadFile, File
from .uploader import save_document
from .store import add_document, list_documents

router = APIRouter(prefix="/knowledge", tags=["Knowledge"])

@router.post("/upload")
async def upload_knowledge(file: UploadFile = File(...)):
    doc = save_document(file)
    add_document(doc)
    return {"message": "Uploaded successfully"}

@router.get("/list")
def list_knowledge():
    docs = list_documents()
    return {
        "documents": [
            {"filename": d["filename"], "id": d["id"]}
            for d in docs
        ]
    }
