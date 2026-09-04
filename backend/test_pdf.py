from utils.pdf_processor import extract_text_from_pdf
from utils.text_chunker import split_text
from utils.embedding import generate_embeddings
from utils.vector_store import store_embeddings, search_similar_chunks

pdf_path = "backend/Research_Paper.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = split_text(text)

embeddings = generate_embeddings(chunks)

store_embeddings(chunks, embeddings)

query = "What is the purpose of the LAAS system?"

query_embedding = generate_embeddings([query])[0]

results = search_similar_chunks(query_embedding)

print("\nRetrieved chunks:\n")

for i, result in enumerate(results, 1):
    print(f"\n--- Result {i} ---")
    print(result[:500])