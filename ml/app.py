from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from model import predict

app = FastAPI(title="EngageIQ ML Prediction Service")

class PredictRequest(BaseModel):
    followers: Optional[int] = 10000
    postText: Optional[str] = ""
    postType: Optional[str] = "text"
    reactions: Optional[int] = 50
    comments: Optional[int] = 10
    daysSincePosted: Optional[int] = 1
    durationSec: Optional[int] = 25
    hasSubtitles: Optional[bool] = True
    hookRating: Optional[int] = 8

@app.post("/api/predict-engagement")
def predict_endpoint(request: PredictRequest):
    data = request.dict()
    result = predict(data)
    return result

# Run with: uvicorn app:app --reload --port 8000
