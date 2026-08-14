// server/routes/postOptimizer.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
  predictTextPost,
  predictImagePost,
  predictVideoPost
} = require('../../ml/multimodalPredictor');

const mockDataPath = path.join(__dirname, '../data/platform_mock_data.json');

// Helper to get platform mock data
function getPlatformMockData() {
  try {
    if (fs.existsSync(mockDataPath)) {
      return JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading mock data:', e);
  }
  return { platforms: {} };
}

/**
 * Universal Post Draft Predictor (supports text, image, video)
 */
router.post('/predict-draft', (req, res) => {
  try {
    const {
      postType = 'text',
      platform = 'instagram',
      text = '',
      caption = '',
      followers = 10000,
      aspectRatio,
      imageType,
      slideCount,
      hasTextOverlay,
      durationSec,
      hasSubtitles,
      hookRating,
      audioType
    } = req.body;

    const contentText = text || caption || '';

    let prediction;
    if (postType === 'video') {
      prediction = predictVideoPost({
        platform,
        followers: Number(followers) || 10000,
        durationSec: Number(durationSec) || 28,
        aspectRatio: aspectRatio || '9:16',
        hasSubtitles: Boolean(hasSubtitles),
        hookRating: Number(hookRating) || 8,
        audioType: audioType || 'trending',
        caption: contentText
      });
    } else if (postType === 'image') {
      prediction = predictImagePost({
        platform,
        followers: Number(followers) || 10000,
        aspectRatio: aspectRatio || '4:5',
        imageType: imageType || 'carousel',
        slideCount: Number(slideCount) || 5,
        hasTextOverlay: Boolean(hasTextOverlay),
        caption: contentText
      });
    } else {
      prediction = predictTextPost({
        text: contentText,
        platform,
        followers: Number(followers) || 10000,
        postType: 'text'
      });
    }

    res.json(prediction);
  } catch (error) {
    console.error('Predict Draft Error:', error);
    res.status(500).json({ error: 'Failed to predict engagement for draft.' });
  }
});

/**
 * Dedicated Video Predictor
 */
router.post('/predict-video', (req, res) => {
  try {
    const prediction = predictVideoPost(req.body);
    res.json(prediction);
  } catch (error) {
    console.error('Predict Video Error:', error);
    res.status(500).json({ error: 'Failed to analyze video engagement.' });
  }
});

/**
 * Platform Trending Topics & Live Insights
 */
router.get('/trending-topics', (req, res) => {
  try {
    const { platform } = req.query;
    const data = getPlatformMockData();

    if (platform && data.platforms[platform.toLowerCase()]) {
      return res.json({
        platform: platform.toLowerCase(),
        data: data.platforms[platform.toLowerCase()]
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Trending Topics Error:', error);
    res.status(500).json({ error: 'Failed to retrieve trending topics.' });
  }
});

module.exports = router;
