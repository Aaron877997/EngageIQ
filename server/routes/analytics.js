// server/routes/analytics.js
const express = require('express');
const router = express.Router();
const processAnalytics = require('../utils/analyticsProcessor');

router.get('/analytics', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.userEmail || req.headers['x-user-id'] || req.query.userId || 'default_user';
    const platforms = req.query.platforms?.split(',').filter(Boolean) || [];

    const data = await processAnalytics(platforms, null, userEmail);
    res.json(data);
  } catch (error) {
    console.error('Analytics Route Error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics.' });
  }
});

module.exports = router;
