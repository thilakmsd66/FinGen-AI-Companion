import ollama

def evaluate_answer(question: str, answer: str) -> dict:
    system_prompt = f"""
You are a State Street Bank ASM L2 Support Evaluator.

Evaluate the user's answer strictly.

Question:
{question}

Evaluation rules:
- Score from 0 to 10
- 0–3: Incorrect or irrelevant
- 4–6: Partially correct, missing key points
- 7–8: Mostly correct, minor gaps
- 9–10: Accurate, clear, and concise

Return ONLY valid JSON in this format:
{{
  "score": number,
  "feedback": "short feedback (2–3 lines)",
  "expected_points": ["point1", "point2", "point3"]
}}
"""

    response = ollama.chat(
        model="mistral",  # or llama3.2
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": answer}
        ],
        stream=False
    )

    return response["message"]["content"]