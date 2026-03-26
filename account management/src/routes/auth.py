from fastapi import APIRouter

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup():
    print("hello world")