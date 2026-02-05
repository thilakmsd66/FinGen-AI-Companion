from ..ai.llm import ask_llm

def generate_question():
    return ask_llm(
        "Generate one medium-difficulty L2 ASM support question related to custody banking."
    )
