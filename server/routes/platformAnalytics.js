//this is server/routes/platformAnalytics.js

const express = require('express')
const router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')

router.get('/platforms', (req, res) => {
  const data = {}

  fs.createReadStream('data/social_media.csv')
    .pipe(csv())
    .on('data', row => {
      const platforms = req.query.platforms?.split(',').map(p => {
        let lower = p.toLowerCase();
        return lower === 'x' ? 'twitter' : lower;
      }) || [];
      if (platforms.length && !platforms.includes((row.platform || "").toLowerCase())) return;

      const platform = row.platform
      const engagement =
        Number(row.likes || 0) +
        Number(row.comments || 0) +
        Number(row.shares || 0)

      data[platform] = (data[platform] || 0) + engagement
    })
    .on('end', () => {
      res.json(data)
    })
})

module.exports = router
