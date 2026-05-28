from mistralai import Mistral
import os

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")

client = Mistral(api_key=api_key)


def explain_medical_report(report_text: str):

    prompt = f"""
You are an advanced clinical AI assistant.

Your task is to explain a medical report in simple,
clear, patient-friendly language.

RULES:
- Explain abnormalities carefully
- Mention possible medical meaning
- Do NOT hallucinate diagnoses
- Mention if doctor consultation is recommended
- Use bullet points
- Keep it medically accurate
- Add a short summary at the end

MEDICAL REPORT:
{report_text}
"""

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content