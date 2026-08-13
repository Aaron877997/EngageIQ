import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from textblob import TextBlob

X_class = np.array([
    [1000, 0.8, 1, 50, 10, 1],
    [500, 0.2, 0, 10, 2, 3],
    [2000, 0.6, 1, 100, 20, 2],
    [300, -0.3, 0, 5, 1, 5],
    [1500, 0.4, 1, 70, 15, 1],
])
y_class = np.array([2, 0, 2, 0, 1])

X_react = np.array([
    [1000, 0.8, 1, 50, 10, 1, 2],
    [500, 0.2, 0, 10, 2, 3, 0],
    [2000, 0.6, 1, 100, 20, 2, 2],
    [300, -0.3, 0, 5, 1, 5, 0],
    [1500, 0.4, 1, 70, 15, 1, 1],
])
y_react = np.array([200, 20, 300, 10, 150])

clf = RandomForestClassifier(random_state=42)
clf.fit(X_class, y_class)

reg = LinearRegression()
reg.fit(X_react, y_react)

def predict(data):
    followers = data['followers']
    postText = data['postText']
    postType = data['postType']
    reactions = data['reactions']
    comments = data['comments']
    daysSincePosted = data['daysSincePosted']
    sentiment = TextBlob(postText).sentiment.polarity
    postType_encoded = 1 if postType.lower() == 'image' else 0
    features_class = np.array([[followers, sentiment, postType_encoded, reactions, comments, daysSincePosted]])
    growth_class = clf.predict(features_class)[0]
    growth = ['LOW', 'MEDIUM', 'HIGH'][growth_class]
    proba = clf.predict_proba(features_class)[0]
    confidence = round(proba[growth_class] * 100, 2)
    features_react = np.array([[followers, sentiment, postType_encoded, reactions, comments, daysSincePosted, growth_class]])
    expectedReactions = int(reg.predict(features_react)[0])
    reasons = [
        'Positive sentiment',
        'Product-focused content',
        'Image-based post',
        'CTA present',
        'High follower base'
    ]
    confidence = int(round(proba[growth_class] * 100))
    return {
        'growth': growth,
        'confidence': confidence,
        'expectedReactions': expectedReactions,
        'reasons': reasons[:5]
    }
