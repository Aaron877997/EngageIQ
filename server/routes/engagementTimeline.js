//this is server/routes/engagementTimeline.js

const express = require('express')
const router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')

router.get('/engagement-timeline', (req, res) => {
  const timeline = {}

  fs.createReadStream('data/social_media.csv')
    .pipe(csv())
    .on('data', (row) => {
      const platforms = req.query.platforms?.split(',').map(p => {
        let lower = p.toLowerCase();
        return lower === 'x' ? 'twitter' : lower;
      }) || [];
      if (platforms.length && !platforms.includes((row.platform || "").toLowerCase())) return;

      const date = new Date(row.post_time).toISOString().split('T')[0]

      const likes = Number(row.likes || 0)
      const comments = Number(row.comments || 0)
      const shares = Number(row.shares || 0)

      if (!timeline[date]) {
        timeline[date] = {
          likes: 0,
          comments: 0,
          shares: 0
        }
      }

      timeline[date].likes += likes
      timeline[date].comments += comments
      timeline[date].shares += shares
    })
    .on('end', () => {
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
        }))

      res.json(result)
    })
})

module.exports = router

