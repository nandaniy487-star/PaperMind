from gemini_client import client


def generate_answer(context, question):
    prompt = f"""
You are PaperMind, an AI research paper assistant.

Answer the user's question using only the information provided in the research paper context below.

If the answer cannot be found in the context, say:
"I could not find this information in the research paper."

Research paper context:
{context}

User question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text