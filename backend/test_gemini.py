from backend.gemini_client import client

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Explain what a research paper is in one sentence."
)

print(response.text)