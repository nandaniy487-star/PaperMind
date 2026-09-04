from fastapi import FastAPI, UploadFile, File
import shutil
from backend.utils.pdf_processor import extract_text_from_pdf

app = FastAPI()


@app.get("/")
def home():
    return {"message": "PaperMind backend is running!"}


@app.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    file_path = f"backend/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)

    return {
        "filename": file.filename,
        "message": "Research paper uploaded and processed successfully!",
        "text_preview": text[:1000]
    }