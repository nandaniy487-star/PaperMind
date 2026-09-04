from fastapi import FastAPI, UploadFile, File
import shutil
from pydantic import BaseModel

from backend.utils.pdf_processor import extract_text_from_pdf
from backend.utils.embedding import generate_embeddings
from backend.utils.vector_store import search_similar_chunks
from backend.rag_service import generate_answer


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


class QuestionRequest(BaseModel):
    question: str


@app.post("/ask")
def ask_question(request: QuestionRequest):

    # Convert the user's question into an embedding
    query_embedding = generate_embeddings([request.question])[0]

    # Retrieve the most relevant chunks from ChromaDB
    relevant_chunks = search_similar_chunks(
        query_embedding,
        top_k=3
    )

    # Combine retrieved chunks into context
    context = "\n\n".join(relevant_chunks)

    # Generate an answer using Gemini
    answer = generate_answer(
        context,
        request.question
    )

    return {
        "question": request.question,
        "answer": answer,
        "sources": relevant_chunks
    }