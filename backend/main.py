from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import shutil
import uuid

from backend.utils.pdf_processor import extract_text_from_pdf
from backend.utils.text_chunker import split_text
from backend.utils.embedding import generate_embeddings
from backend.utils.vector_store import (
    store_embeddings,
    search_similar_chunks,
    get_all_chunks
)
from backend.rag_service import (
    generate_answer,
    generate_study_notes,
    generate_methodology,
    generate_results_conclusion
)


app = FastAPI()


# -----------------------------
# Request Models
# -----------------------------

class QuestionRequest(BaseModel):
    question: str
    paper_id: str


class PaperRequest(BaseModel):
    paper_id: str


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

    # Generate a unique ID for this research paper
    paper_id = str(uuid.uuid4())

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

    # Store chunks and embeddings with paper ID
    store_embeddings(
        chunks,
        embeddings,
        paper_id,
        file.filename
    )

    return {
        "paper_id": paper_id,
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
    paper_id = request.paper_id

    # Convert question into embedding
    query_embedding = generate_embeddings([question])[0]

    # Retrieve relevant chunks ONLY from this paper
    results = search_similar_chunks(
        query_embedding,
        paper_id
    )

    # Combine retrieved chunks into context
    context = "\n\n".join(results)

    # Generate answer using Gemini
    answer = generate_answer(
        context,
        question
    )

    return {
        "paper_id": paper_id,
        "question": question,
        "answer": answer
    }


# -----------------------------
# Generate Study Notes
# -----------------------------

@app.post("/study-notes")
async def study_notes(request: PaperRequest):

    paper_id = request.paper_id

    # Retrieve chunks ONLY from this paper
    chunks = get_all_chunks(paper_id)

    # Check whether the paper exists
    if not chunks:
        return {
            "message": "Research paper not found."
        }

    # Combine paper chunks into context
    context = "\n\n".join(chunks)

    # Generate structured study notes
    notes = generate_study_notes(context)

    return {
        "paper_id": paper_id,
        "notes": notes
    }


# -----------------------------
# Generate Methodology Analysis
# -----------------------------

@app.post("/methodology")
async def methodology(request: PaperRequest):

    paper_id = request.paper_id

    # Retrieve chunks ONLY from this paper
    chunks = get_all_chunks(paper_id)

    # Check whether the paper exists
    if not chunks:
        return {
            "message": "Research paper not found."
        }

    # Combine paper chunks into context
    context = "\n\n".join(chunks)

    # Generate methodology analysis
    methodology_analysis = generate_methodology(context)

    return {
        "paper_id": paper_id,
        "methodology": methodology_analysis
    }


# -----------------------------
# Generate Results & Conclusion
# -----------------------------

@app.post("/results-conclusion")
async def results_conclusion(request: PaperRequest):

    paper_id = request.paper_id

    # Retrieve chunks ONLY from this paper
    chunks = get_all_chunks(paper_id)

    # Check whether the paper exists
    if not chunks:
        return {
            "message": "Research paper not found."
        }

    # Combine paper chunks into context
    context = "\n\n".join(chunks)

    # Generate results and conclusion analysis
    results = generate_results_conclusion(context)

    return {
        "paper_id": paper_id,
        "results_conclusion": results
    }