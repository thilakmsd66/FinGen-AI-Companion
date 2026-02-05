from pathlib import Path

KB_DIR = Path(__file__).parent.parent / "data" / "documents"
KB_DIR.mkdir(parents=True, exist_ok=True)

def save_document(file):
    path = KB_DIR / file.filename
    with open(path, "wb") as f:
        f.write(file.file.read())
    return file.filename

def list_documents():
    return [f.name for f in KB_DIR.iterdir() if f.is_file()]

def delete_document(filename):
    path = KB_DIR / filename
    if path.exists():
        path.unlink()

def read_documents(documents: list) -> str:
    texts = []
    for doc in documents:
        file_path = KB_DIR / doc
        if file_path.exists():
            try:
                content = file_path.read_text(encoding="utf-8")
                texts.append(f"Document ({doc}):\n{content}")
            except:
                pass
    return "\n\n".join(texts)

KB_DIR = Path(__file__).parent.parent / "data" / "documents"

def load_documents():
    docs = []

    for file in KB_DIR.glob("*"):
        if file.suffix in [".txt", ".md"]:
            text = file.read_text(encoding="utf-8")
            docs.append({
                "source": file.name,
                "text": text
            })

    return docs

