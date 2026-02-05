from fastapi import APIRouter, UploadFile, File
from .store import save_document, list_documents, delete_document

router = APIRouter(prefix="/knowledge", tags=["Knowledge Hub"])

@router.post("/upload")
def upload_doc(file: UploadFile = File(...)):
    filename = save_document(file)
    return {"message": "Uploaded", "filename": filename}

@router.get("/documents")
def get_docs():
    return {"documents": list_documents()}

@router.delete("/delete/{filename}")
def remove_doc(filename: str):
    delete_document(filename)
    return {"message": "Deleted"}
