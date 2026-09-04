from utils.pdf_processor import extract_text_from_pdf
from utils.text_chunker import split_text
from utils.embedding import generate_embeddings
from utils.vector_store import store_embeddings, search_similar_chunks
from rag_service import generate_answer


pdf_path = "backend/Research_Paper.pdf"

# 1. Extract paper text
text = extract_text_from_pdf(pdf_path)

# 2. Split into chunks
chunks = split_text(text)

# 3. Generate embeddings
embeddings = generate_embeddings(chunks)

# 4. Store embeddings in ChromaDB
store_embeddings(chunks, embeddings)

# 5. Ask a question
question = "What is the purpose of the LAAS system?"

# 6. Convert question into an embedding
query_embedding = generate_embeddings([question])[0]

# 7. Retrieve relevant chunks
results = search_similar_chunks(query_embedding)

# 8. Combine retrieved chunks into context
context = "\n\n".join(results)

# 9. Generate answer using Gemini
answer = generate_answer(context, question)

print("\nQuestion:")
print(question)

print("\nAnswer:")
print(answer)