from fastapi import FastAPI
from pydantic import BaseModel
from model import predict

app = FastAPI()

class PredictRequest(BaseModel):
    followers: int
    postText: str
    postType: str
    reactions: int
    comments: int
    daysSincePosted: int

@app.post("/api/predict-engagement")
def predict_endpoint(request: PredictRequest):
    data = request.dict()
    result = predict(data)
    return result

#uvicorn app:app --reload 
