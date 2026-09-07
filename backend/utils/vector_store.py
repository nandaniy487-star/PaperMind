import chromadb
import uuid

client = chromadb.PersistentClient(path="backend/chroma_db")

collection = client.get_or_create_collection(
    name="research_papers_v2"
)


def store_embeddings(chunks, embeddings, paper_id, filename):
    ids = [str(uuid.uuid4()) for _ in chunks]

    metadatas = [
        {
            "paper_id": paper_id,
            "filename": filename
        }
        for _ in chunks
    ]

    collection.add(
        documents=chunks,
        embeddings=embeddings.tolist(),
        ids=ids,
        metadatas=metadatas
    )


def search_similar_chunks(query_embedding, paper_id, top_k=3):
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=top_k,
        where={
            "paper_id": paper_id
        }
    )

    return results["documents"][0]


def get_all_chunks(paper_id):
    results = collection.get(
        where={
            "paper_id": paper_id
        }
    )

    return results["documents"]