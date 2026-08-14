# ml/train_model.py
import json
import os
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from textblob import TextBlob

JSON_PATH = os.path.join(os.path.dirname(__file__), '../server/data/platform_posts_feed.json')
OUTPUT_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'python_trained_model.json')

def extract_python_features(post):
    text = post.get('caption_text', '') or post.get('text', '')
    sentiment = TextBlob(text).sentiment.polarity if text else 0.0
    char_count = len(text)
    has_question = 1 if '?' in text or 'what do you think' in text.lower() else 0
    has_cta = 1 if any(k in text.lower() for k in ['link in bio', 'swipe', 'save', 'share', 'comment', 'learn']) else 0
    hashtags = len([w for w in text.split() if w.startswith('#')])
    
    media = post.get('media_specs', {})
    p_type = post.get('post_type', 'text').lower()
    is_video = 1 if p_type in ['video', 'reels'] else 0
    duration = media.get('duration_sec', 25 if is_video else 0)
    aspect = media.get('aspect_ratio', '')
    is_vertical = 1 if aspect == '9:16' or (is_video and aspect != '16:9') else 0
    has_subtitles = 1 if media.get('has_subtitles', False) else 0
    hook_rating = media.get('hook_rating', 7)
    is_carousel = 1 if p_type == 'carousel' or media.get('image_type') == 'carousel' else 0
    
    plat = post.get('platform', 'instagram').lower().replace('x', 'twitter')
    plat_ig = 1 if plat == 'instagram' else 0
    plat_tw = 1 if plat == 'twitter' else 0
    plat_li = 1 if plat == 'linkedin' else 0
    plat_fb = 1 if plat == 'facebook' else 0

    return [
        sentiment,
        min(1.0, char_count / 300.0),
        has_question,
        has_cta,
        min(1.0, hashtags / 6.0),
        is_video,
        1 if (is_video and 15 <= duration <= 40) else 0,
        is_vertical,
        has_subtitles,
        hook_rating / 10.0,
        is_carousel,
        plat_ig,
        plat_tw,
        plat_li,
        plat_fb
    ]

def train():
    print(f"Loading platform posts from {JSON_PATH}...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    posts = data.get('posts', [])
    X = []
    y = []
    
    for p in posts:
        X.append(extract_python_features(p))
        y.append(p.get('engagement_score', 75))
        
    X = np.array(X)
    y = np.array(y)
    
    model = GradientBoostingRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    preds = model.predict(X)
    r2 = r2_score(y, preds)
    mae = mean_absolute_error(y, preds)
    
    print(f"Model Trained Successfully! R2 Score: {r2:.4f}, MAE: {mae:.2f}, Samples: {len(X)}")
    
    model_data = {
        "framework": "Scikit-Learn GradientBoostingRegressor",
        "r2_score": round(float(r2), 4),
        "mae": round(float(mae), 2),
        "sample_count": len(X),
        "feature_importances": [round(float(imp), 4) for imp in model.feature_importances_]
    }
    
    with open(OUTPUT_MODEL_PATH, 'w', encoding='utf-8') as out:
        json.dump(model_data, out, indent=2)
        
    return model_data

if __name__ == '__main__':
    train()
