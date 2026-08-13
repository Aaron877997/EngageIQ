import { useState, useEffect } from "react";
import axios from "axios";
import "./EngagementPrediction.css";

function EngagementPrediction({ selectedPost, isOpen, onClose }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPost && isOpen) {
      setPrediction(null);
      setError(null);
      handleAnalyze();
    }
  }, [selectedPost, isOpen]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      let followers, postText, postType, reactions, comments, daysSincePosted;

      if (selectedPost.specificContent) {
        postText =
          selectedPost.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text || "";
        const createdTime = selectedPost.created?.time;
        daysSincePosted = createdTime
          ? Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24))
          : 0;
        followers = 0;
        postType = "text";
        reactions = 0;
        comments = 0;
      } else {
        followers = parseInt(selectedPost.followers) || 0;
        postText = selectedPost.content || "";
        postType = selectedPost.media_type || "text";
        reactions = parseInt(selectedPost.reactions) || 0;
        comments = parseInt(selectedPost.comments) || 0;
        daysSincePosted =
          parseInt(selectedPost.daysSincePosted) || parseInt(selectedPost.time_spent) || 0;
      }

      const response = await axios.post("http://localhost:5001/api/predict-engagement", {
        followers,
        postText,
        postType,
        reactions,
        comments,
        daysSincePosted,
      });
      setPrediction(response.data);
    } catch (err) {
      console.error("Error predicting engagement:", err);
      setError("Failed to analyze engagement. Please ensure the ML server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal prediction-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="engagement-prediction-card">
          <div className="prediction-header">
            <h3>Engagement Prediction</h3>
          </div>

          {loading ? (
            <div className="prediction-loading">
              <span className="loading-spinner" />
              Analyzing post engagement...
            </div>
          ) : error ? (
            <div className="prediction-content">
              <div className="alert alert-error">{error}</div>
              <button type="button" className="btn btn-primary" onClick={handleAnalyze}>
                Retry Analysis
              </button>
            </div>
          ) : prediction ? (
            <div className="prediction-content">
              <div className="metric-block">
                <div className="metric-icon">📈</div>
                <div>
                  <div className="metric-label">Growth Likelihood</div>
                  <div className="metric-value">
                    {prediction.growth} ({prediction.confidence}%)
                  </div>
                </div>
              </div>
              <div className="metric-block">
                <div className="metric-icon">🔢</div>
                <div>
                  <div className="metric-label">Expected Engagement</div>
                  <div className="metric-value">
                    Expected reactions in 7 days: ~{prediction.expectedReactions}
                  </div>
                </div>
              </div>
              <div className="explanation-block">
                <div className="explanation-header">
                  <span className="explanation-icon">🧠</span>
                  <span className="explanation-title">Why this prediction?</span>
                </div>
                <ul className="explanation-list">
                  {prediction.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="prediction-content">
              <button type="button" className="btn btn-primary btn-block" onClick={handleAnalyze}>
                Analyze Engagement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EngagementPrediction;
