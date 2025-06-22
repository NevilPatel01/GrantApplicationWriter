from pydantic import BaseModel


# Data model for the edit request
class ApplicationEditRequest(BaseModel):
    original_text: str
    selected_text: str
    edit_instruction: str
