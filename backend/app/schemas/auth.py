from pydantic import BaseModel, EmailStr, Field, validator


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class CreateUserRequest(BaseModel):
    username: str
    password: str = Field(min_length=8)

    @validator('password')
    def validate_password_requirements(cls, value):
        if not any(char.isupper() for char in value):
            raise ValueError('Password must contain at least one upper case letter')
        if not any(char.islower() for char in value):
            raise ValueError('Password must contain at least one lower case letter')
        if not any(char.isdigit() for char in value):
            raise ValueError('Password must contain at least one digit')
        if not any(char in "!@#$%^&*()_-+=<>?/[]{}|.,'`~\"\\" for char in value):
            raise ValueError('Password must contain at least one symbol')

        return value


class Token(BaseModel):
    access_token: str
    token_type: str


class PasswordResetInput(BaseModel):
    email: EmailStr


class PasswordResetConfirmInput(BaseModel):
    token: str
    new_password: str
