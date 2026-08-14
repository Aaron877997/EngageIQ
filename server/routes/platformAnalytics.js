// server/routes/platformAnalytics.js
const express = require('express');
const router = express.Router();
const { fetchConjugatePosts } = require('../utils/conjugateClient');

router.get('/platforms', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.userEmail || req.headers['x-user-id'] || req.query.userId || 'default_user';
    const platformsParam = req.query.platforms?.split(',').map(p => {
      let lower = p.toLowerCase();
      return lower === 'x' ? 'twitter' : lower;
    }).filter(Boolean) || [];

    const posts = await fetchConjugatePosts(userEmail);
    const data = {};

    posts.forEach(row => {
      const plat = (row.platform || 'instagram').toLowerCase().replace('x', 'twitter');
      if (platformsParam.length && !platformsParam.includes(plat)) return;

      const engagement =
        Number(row.metrics?.likes || row.likes || 0) +
        Number(row.metrics?.comments || row.comments || 0) +
        Number(row.metrics?.shares || row.shares || 0);

      data[plat] = (data[plat] || 0) + engagement;
    });

    res.json(data);
  } catch (error) {
    console.error('Platform Analytics Error:', error);
    res.status(500).json({ error: 'Failed to retrieve platform analytics.' });
  }
});

module.exports = router;
