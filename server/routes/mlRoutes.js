// server/routes/mlRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
  trainModelOnPastPosts,
  predictWithLearnedModel
} = require('../../ml/dynamicTrainer');

const JSON_FEED_PATH = path.join(__dirname, '../data/platform_posts_feed.json');
const MODEL_WEIGHTS_PATH = path.join(__dirname, '../../ml/trained_model.json');

/**
 * Get Current Live ML Model Status & Learned Weights
 */
router.get('/ml/status', (req, res) => {
  try {
    let modelState;
    if (fs.existsSync(MODEL_WEIGHTS_PATH)) {
      modelState = JSON.parse(fs.readFileSync(MODEL_WEIGHTS_PATH, 'utf-8'));
    } else {
      modelState = trainModelOnPastPosts();
    }
    res.json(modelState);
  } catch (error) {
    console.error('Error fetching ML model status:', error);
    res.status(500).json({ error: 'Failed to retrieve ML model status.' });
  }
});

/**
 * Trigger Live Retraining on Past Posts JSON Feed
 */
router.post('/ml/train', (req, res) => {
  try {
    const updatedModel = trainModelOnPastPosts();
    res.json({
      success: true,
      message: 'ML Model retrained successfully on latest platform posts feed!',
      model: updatedModel
    });
  } catch (error) {
    console.error('Error during ML model retraining:', error);
    res.status(500).json({ error: 'Model training failed.' });
  }
});

/**
 * Ingest / Sync New Platform Posts (JSON Form) and Automatically Retrain Model
 */
router.post('/ml/sync-posts', (req, res) => {
  try {
    const { posts } = req.body;
    if (!posts || !Array.isArray(posts)) {
      return res.status(400).json({ error: 'Please provide a valid array of post objects in JSON form.' });
    }

    let feedData = { dataset_metadata: {}, posts: [] };
    if (fs.existsSync(JSON_FEED_PATH)) {
      feedData = JSON.parse(fs.readFileSync(JSON_FEED_PATH, 'utf-8'));
    }

    // Append new posts with IDs
    posts.forEach((newPost, idx) => {
      if (!newPost.id) newPost.id = `sync_post_${Date.now()}_${idx}`;
      feedData.posts.unshift(newPost);
    });

    feedData.dataset_metadata.last_updated = new Date().toISOString();
    feedData.dataset_metadata.total_records = feedData.posts.length;

    fs.writeFileSync(JSON_FEED_PATH, JSON.stringify(feedData, null, 2), 'utf-8');

    // Retrain model on updated feed
    const retrained = trainModelOnPastPosts();

    res.json({
      success: true,
      message: `Successfully synced ${posts.length} new posts and retrained dynamic ML model!`,
      totalPostsCount: feedData.posts.length,
      model: retrained
    });
  } catch (error) {
    console.error('Error syncing posts and retraining:', error);
    res.status(500).json({ error: 'Failed to sync platform posts.' });
  }
});

module.exports = router;
