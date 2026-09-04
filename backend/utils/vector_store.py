import chromadb


client = chromadb.PersistentClient(path="backend/chroma_db")


collection = client.get_or_create_collection(
    name="research_papers"
)


def store_embeddings(chunks, embeddings):
    collection.add(
        documents=chunks,
        embeddings=embeddings.tolist(),
        ids=[str(i) for i in range(len(chunks))]
    )

def search_similar_chunks(query_embedding, top_k=3):
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=top_k
    )

    return results["documents"][0]