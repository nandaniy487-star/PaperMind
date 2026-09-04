from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import shutil

from backend.utils.pdf_processor import extract_text_from_pdf
from backend.utils.text_chunker import split_text
from backend.utils.embedding import generate_embeddings
from backend.utils.vector_store import store_embeddings, search_similar_chunks
from backend.rag_service import generate_answer


app = FastAPI()


# -----------------------------
# Request Model
# -----------------------------

class QuestionRequest(BaseModel):
    question: str


# -----------------------------
# Home Route
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "PaperMind backend is running!"
    }


# -----------------------------
# Upload Research Paper
# -----------------------------

@app.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):

    file_path = f"backend/{file.filename}"

    # Save uploaded PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text = extract_text_from_pdf(file_path)

    # Split text into chunks
    chunks = split_text(text)

    # Generate embeddings
    embeddings = generate_embeddings(chunks)

    # Store chunks and embeddings in ChromaDB
    store_embeddings(chunks, embeddings)

    return {
        "filename": file.filename,
        "message": "Research paper uploaded and indexed successfully!",
        "chunks_created": len(chunks)
    }


# -----------------------------
# Ask Question About Paper
# -----------------------------

@app.post("/ask-paper")
async def ask_paper(request: QuestionRequest):

    question = request.question

    # Convert question into embedding
    query_embedding = generate_embeddings([question])[0]

    # Retrieve relevant chunks
    results = search_similar_chunks(query_embedding)

    # Combine retrieved chunks into context
    context = "\n\n".join(results)

    # Generate answer using Gemini
    answer = generate_answer(context, question)

    return {
        "question": question,
        "answer": answer
    }