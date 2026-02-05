from .llm import ask_llm

def chatbot_response(question: str):
    return ask_llm(question)
