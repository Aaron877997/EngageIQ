/**
 * Conjugate Media Server - Platform & Channel Routes
 * 
 * Handles platform credentials, channels, profiles, and subscriber/follower counts
 * scoped by user email.
 */

const express = require('express');
const router = express.Router();
const conjugateStore = require('../services/conjugateStore');

/**
 * Helper to extract user email/key from request
 */
function getRequestUserEmail(req) {
  return req.headers['x-user-email'] || req.query.userEmail || req.body?.userEmail || req.headers['x-user-id'] || 'default_user';
}

/**
 * GET /api/platforms
 * Retrieve all platform channels and subscriber stats for a user email
 */
router.get('/platforms', async (req, res) => {
  try {
    const userEmail = getRequestUserEmail(req);
    const channels = await conjugateStore.getChannels(userEmail);
    res.json({
      success: true,
      userEmail,
      channels
    });
  } catch (error) {
    console.error('[Conjugate Platform Route Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch platform channels.' });
  }
});

/**
 * PATCH /api/platforms/:platform/subscribers
 * Modulate subscriber or follower count for a platform channel
 */
router.patch('/platforms/:platform/subscribers', async (req, res) => {
  try {
    const { platform } = req.params;
    const userEmail = getRequestUserEmail(req);
    const { delta, subscribers } = req.body;

    const updated = await conjugateStore.updateChannel(userEmail, platform, {
      deltaSubscribers: delta,
      subscribers
    });

    res.json({
      success: true,
      message: `Subscribers updated for ${platform.toUpperCase()}`,
      channel: updated
    });
  } catch (error) {
    console.error('[Conjugate Platform Update Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to update subscribers.' });
  }
});

/**
 * PUT /api/platforms/:platform/profile
 * Update channel profile metadata (bio, handle, name, category, avatar)
 */
router.put('/platforms/:platform/profile', async (req, res) => {
  try {
    const { platform } = req.params;
    const userEmail = getRequestUserEmail(req);
    const profileData = req.body;

    const updated = await conjugateStore.updateChannel(userEmail, platform, profileData);

    res.json({
      success: true,
      message: `Channel profile updated for ${platform.toUpperCase()}`,
      channel: updated
    });
  } catch (error) {
    console.error('[Conjugate Platform Profile Error]:', error);
    res.status(500).json({ error: error.message || 'Failed to update channel profile.' });
  }
});

module.exports = router;
