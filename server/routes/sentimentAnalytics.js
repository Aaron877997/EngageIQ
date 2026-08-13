//this is server/routes/sentimentAnalytics.js

const express = require('express')
const router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')

router.get('/sentiment', (req, res) => {
  const sentimentCount = {
    positive: 0,
    neutral: 0,
    negative: 0
  }

  fs.createReadStream('data/social_media.csv')
    .pipe(csv())
    .on('data', (row) => {
      const platforms = req.query.platforms?.split(',') || []
      if (platforms.length && !platforms.includes(row.platform)) return

      const sentiment = row.sentiment_score?.toLowerCase()
      if (sentimentCount[sentiment] !== undefined) {
        sentimentCount[sentiment]++
      }
    })
    .on('end', () => {
      res.json(sentimentCount)
    })
})

module.exports = router
