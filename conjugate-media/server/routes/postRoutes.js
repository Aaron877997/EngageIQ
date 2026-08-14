/**
 * Conjugate Media Server - Post Management & Interaction Routes
 * 
 * Exposes full CRUD and real-time interaction modulation for posts scoped by user email.
 */

const express = require('express');
const router = express.Router();
const conjugateStore = require('../services/conjugateStore');

function getRequestUserEmail(req) {
  return req.headers['x-user-email'] || req.query.userEmail || req.body?.userEmail || req.headers['x-user-id'] || 'default_user';
}

/**
 * GET /api/posts
 * List posts with optional filters (platform, category, postType, search, sortBy)
 */
router.get('/posts', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const { platform, category, postType, search, sortBy } = req.query;

    const posts = await conjugateStore.getPosts(userEmail, {
      platform,
      category,
      postType,
      search,
      sortBy
    });

    res.json({
      success: true,
      userEmail,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('[Conjugate Posts Route Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch posts.' });
  }
});

/**
 * GET /api/posts/:id
 * Retrieve a single post by ID
 */
router.get('/posts/:id', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const post = await conjugateStore.getPostById(userEmail, req.params.id);

    if (!post) {
      return res.status(404).json({ error: `Post ${req.params.id} not found.` });
    }

    res.json({ success: true, post });
  } catch (error) {
    console.error('[Conjugate Single Post Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch post.' });
  }
});

/**
 * POST /api/posts
 * Publish a new post to the specified platform with media specs & category
 */
router.post('/posts', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const postData = req.body;

    if (!postData.caption && !postData.text) {
      return res.status(400).json({ error: 'Post caption or text is required.' });
    }

    const createdPost = await conjugateStore.createPost(userEmail, postData);

    res.status(201).json({
      success: true,
      message: `Post created successfully on ${createdPost.platform.toUpperCase()}!`,
      post: createdPost
    });
  } catch (error) {
    console.error('[Conjugate Create Post Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to create post.' });
  }
});

/**
 * PATCH /api/posts/:id/metrics
 * Modulate post metrics (increase or decrease likes, comments, shares, dislikes, reach, views)
 */
router.patch('/posts/:id/metrics', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const { id } = req.params;
    const updates = req.body;

    const updatedPost = await conjugateStore.updatePostMetrics(userEmail, id, updates);

    res.json({
      success: true,
      message: 'Post metrics updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    console.error('[Conjugate Metrics Update Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to update metrics.' });
  }
});

/**
 * POST /api/posts/:id/comments
 * Add an interactive comment to a post with automated sentiment tagging
 */
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const { id } = req.params;
    const commentData = req.body;

    const result = await conjugateStore.addComment(userEmail, id, commentData);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      comment: result.newComment,
      post: result.post
    });
  } catch (error) {
    console.error('[Conjugate Add Comment Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to add comment.' });
  }
});

/**
 * PATCH /api/posts/:id/timeline
 * Modify the post timeline/timestamp
 */
router.patch('/posts/:id/timeline', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const { id } = req.params;
    const { timestamp } = req.body;

    if (!timestamp) {
      return res.status(400).json({ error: 'Timestamp is required.' });
    }

    const updatedPost = await conjugateStore.updatePostTimeline(userEmail, id, timestamp);

    res.json({
      success: true,
      message: 'Post timeline updated successfully!',
      post: updatedPost
    });
  } catch (error) {
    console.error('[Conjugate Timeline Update Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to update post timeline.' });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post
 */
router.delete('/posts/:id', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const { id } = req.params;

    const deleted = await conjugateStore.deletePost(userEmail, id);

    res.json({
      success: true,
      message: 'Post deleted successfully!',
      deleted
    });
  } catch (error) {
    console.error('[Conjugate Delete Post Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to delete post.' });
  }
});

/**
 * POST /api/reset
 * Reset user sandbox to rich default dataset
 */
router.post('/reset', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const data = await conjugateStore.resetUserStore(userEmail);

    res.json({
      success: true,
      message: `Conjugate Media sandbox reset for ${userEmail}!`,
      data
    });
  } catch (error) {
    console.error('[Conjugate Reset Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to reset sandbox.' });
  }
});

module.exports = router;
