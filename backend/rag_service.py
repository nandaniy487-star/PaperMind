import time
from backend.gemini_client import client


def generate_answer(context, question):
    prompt = f"""
You are PaperMind, an AI research paper assistant.

Answer the user's question using only the information provided
in the research paper context below.

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


def generate_study_notes(context):
    # Limit the amount of paper content sent to Gemini.
    # This keeps the request fast and avoids an unnecessarily large prompt.
    max_context_length = 12000
    limited_context = context[:max_context_length]

    prompt = f"""
You are PaperMind, an AI research paper assistant.

Create clear and well-structured study notes from the
research paper context provided below.

The notes should help a student understand and revise the paper.

Organize the notes using these sections:

1. Paper Overview
2. Problem Statement
3. Objectives
4. Methodology
5. Key Concepts
6. Results and Findings
7. Important Takeaways

Rules:
- Use only information from the provided research paper context.
- Do not invent information.
- Keep explanations clear and student-friendly.
- Use bullet points where appropriate.
- Preserve important technical terms.
- Focus on the most important information for revision.

Research paper context:
{limited_context}
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


def generate_methodology(context):
    # Limit the context to keep the Gemini request efficient.
    max_context_length = 12000
    limited_context = context[:max_context_length]

    prompt = f"""
You are PaperMind, an AI research paper assistant.

Analyze the methodology of the research paper using only
the research paper context provided below.

Explain the methodology in a clear and student-friendly way.

Organize the analysis using these sections:

1. Methodology Overview
2. Research Approach
3. System or Proposed Method
4. Algorithms and Techniques Used
5. Implementation Details
6. Experimental Setup
7. Evaluation Approach
8. Key Methodology Takeaways

Rules:
- Use only information explicitly available in the research paper context.
- Do not invent algorithms, experiments, tools, datasets, or implementation details.
- If a section is not clearly described in the provided context, say:
  "This information is not clearly described in the provided research paper context."
- Explain technical concepts in simple language where possible.
- Preserve important technical terminology.
- Use bullet points and short paragraphs where appropriate.
- Focus specifically on HOW the research was conducted or how the proposed
  system/method works.
- Do not provide a general summary of the entire paper.

Research paper context:
{limited_context}
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
def generate_results_conclusion(context):
    max_context_length = 12000
    limited_context = context[:max_context_length]

    prompt = f"""
You are PaperMind, an AI research paper assistant.

Analyze the results and conclusion of the research paper using only
the research paper context provided below.

Explain the findings in a clear and student-friendly way.

Organize the analysis using these sections:

1. Results Overview
2. Key Findings
3. Experimental Results
4. Performance Observations
5. Comparison with Existing Approaches
6. Limitations or Observed Constraints
7. Conclusion
8. Key Takeaways

Rules:
- Use only information explicitly available in the provided research paper context.
- Do not invent numerical results, experiments, datasets, comparisons, or conclusions.
- If a section is not clearly described in the provided context, say:
  "This information is not clearly described in the provided research paper context."
- Preserve important technical terminology.
- Explain technical findings in simple language where possible.
- Use bullet points and short paragraphs where appropriate.
- Focus specifically on what the researchers found and concluded.
- Do not provide a general methodology analysis.

Research paper context:
{limited_context}
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