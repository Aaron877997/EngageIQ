// server/routes/engagementTimeline.js
const express = require('express');
const router = express.Router();
const { fetchConjugatePosts } = require('../utils/conjugateClient');

router.get('/engagement-timeline', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.userEmail || req.headers['x-user-id'] || req.query.userId || 'default_user';
    const platformsParam = req.query.platforms?.split(',').map(p => {
      let lower = p.toLowerCase();
      return lower === 'x' ? 'twitter' : lower;
    }).filter(Boolean) || [];

    const posts = await fetchConjugatePosts(userEmail);
    const timeline = {};

    posts.forEach((row) => {
      const plat = (row.platform || 'instagram').toLowerCase().replace('x', 'twitter');
      if (platformsParam.length && !platformsParam.includes(plat)) return;

      const date = new Date(row.timestamp || row.post_time || row.createdAt || Date.now()).toISOString().split('T')[0];

      const likes = Number(row.metrics?.likes || row.likes || 0);
      const comments = Number(row.metrics?.comments || row.comments || 0);
      const shares = Number(row.metrics?.shares || row.shares || 0);

      if (!timeline[date]) {
        timeline[date] = {
          likes: 0,
          comments: 0,
          shares: 0
        };
      }

      timeline[date].likes += likes;
      timeline[date].comments += comments;
      timeline[date].shares += shares;
    });

    const result = Object.keys(timeline)
      .sort()
      .map(date => ({
        date,
        likes: timeline[date].likes,
        comments: timeline[date].comments,
        shares: timeline[date].shares,
        engagement:
          timeline[date].likes +
          timeline[date].comments +
          timeline[date].shares
      }));

    res.json(result);
  } catch (error) {
    console.error('Engagement Timeline Error:', error);
    res.status(500).json({ error: 'Failed to retrieve engagement timeline.' });
  }
});

module.exports = router;
