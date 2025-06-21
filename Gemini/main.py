import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load variables from .env
load_dotenv()                                                                                                                                                           

# Set API key from environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded company information
company_info = {
    "Company Name": "EcoTech Solutions",
    "Industry": "Green Energy",
    "Employee Count": 25,
    "Annual Revenue": "$2.1M",
    "Email": "info@ecotech.com",
    "Website": "https://www.ecotech.com",
    "Phone": "+1-800-123-4567",
    "Address": "123 Solar Ave, Green City, Earth",
    "Company Description": (
        "EcoTech Solutions develops affordable solar panel systems and energy optimization software "
        "for small businesses and low-income households."
    ),
    "Supporting Documents": ["pitch_deck.pdf", "financials_2024.xlsx", "impact_report.pdf"]
}

# Example questions a grant application might ask
questions = [
    "What is your company’s mission?",
    "Describe the problem your company is solving.",
    "How will the grant funding be used?",
    "What is the expected impact of your project?",
    "Why is your company well-positioned to succeed?"
]

@app.get("/generate-answers")
def generate_answers():
    model = genai.GenerativeModel("gemini-1.5-pro")
    responses = []

    for question in questions:
        prompt = (
            f"You are filling out a grant application for the following company:\n\n"
            f"Company Name: {company_info['Company Name']}\n"
            f"Industry: {company_info['Industry']}\n"
            f"Employee Count: {company_info['Employee Count']}\n"
            f"Annual Revenue: {company_info['Annual Revenue']}\n"
            f"Contact: {company_info['Email']} | {company_info['Website']} | {company_info['Phone']}\n"
            f"Address: {company_info['Address']}\n"
            f"Company Description: {company_info['Company Description']}\n"
            f"Supporting Documents: {', '.join(company_info['Supporting Documents'])}\n\n"
            f"Answer this grant question:\n{question}"
        )
        response = model.generate_content(prompt)
        responses.append({
            "question": question,
            "answer": response.text.strip()
        })

    return {"company": company_info["Company Name"], "responses": responses}


# Data model for the edit request
class EditRequest(BaseModel):
    original_text: str
    selected_text: str
    edit_instruction: str

@app.post("/edit-answer")
async def edit_answer(request: EditRequest):
    model = genai.GenerativeModel("gemini-1.5-pro")

    prompt = f"""
You are an AI that edits grant application answers.

Here is the original answer text:
\"\"\"
{request.original_text}
\"\"\"

The user selected this part to change:
\"\"\"
{request.selected_text}
\"\"\"

User instruction for the change:
\"\"\"
{request.edit_instruction}
\"\"\"

Please rewrite the entire answer text to reflect this change. Make sure to update all relevant mentions in the text (e.g., if a concept like 'innovation' is changed, replace all related references to keep the text cohesive).

At the same time, keep all unrelated parts exactly as they are.

Return only the full updated answer text without adding explanations or extra comments.
"""

    response = model.generate_content(prompt)
    return {"edited_text": response.text.strip()}
