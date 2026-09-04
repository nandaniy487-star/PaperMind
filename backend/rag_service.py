import time

from backend.gemini_client import client


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

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:
            if "503" in str(e) and attempt < 2:
                time.sleep(2)
            else:
                raise