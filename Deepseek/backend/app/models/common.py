## models/common.py
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class ResponseModel(BaseModel):
    data: Any
    message: str = "Success"
    
    @classmethod
    def create(cls, data, message="Success"):
        return cls(data=data, message=message)

class ErrorResponseModel(BaseModel):
    detail: str
    
    @classmethod
    def create(cls, detail):
        return cls(detail=detail)