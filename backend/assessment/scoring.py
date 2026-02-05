from ..ai.llm import ask_llm

def score_answer(question, answer):
    return ask_llm(f"""
Question:
{question}

User Answer:
{answer}

Give a score out of 10 and short feedback.
""")
