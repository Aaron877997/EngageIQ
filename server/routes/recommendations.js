//this is server/routes/recommendations.js

const express = require('express')
const router = express.Router()
const fs = require('fs')
const csv = require('csv-parser')

router.get('/recommendations', (req, res) => {
  const typeStats = {}
  const timeStats = {}

  fs.createReadStream('data/social_media.csv')
    .pipe(csv())
    .on('data', row => {
      const engagement =
        Number(row.likes || 0) +
        Number(row.comments || 0) +
        Number(row.shares || 0)

      typeStats[row.post_type] =
        (typeStats[row.post_type] || 0) + engagement

      const postTimeStr = row.post_time || "2023-10-01 12:00:00"
      const hourStr = postTimeStr.includes(' ') ? postTimeStr.split(' ')[1].split(':')[0] : "12"
      const hour = Number(hourStr)
      const slot = hour >= 18 && hour <= 20 ? '6–8 PM' : 'Other'

      timeStats[slot] = (timeStats[slot] || 0) + engagement
    })
    .on('end', () => {
      const bestType = Object.keys(typeStats).length 
        ? Object.entries(typeStats).sort((a,b)=>b[1]-a[1])[0][0] 
        : 'Video/Reels'
      const bestTime = Object.keys(timeStats).length
        ? Object.entries(timeStats).sort((a,b)=>b[1]-a[1])[0][0]
        : '6–8 PM'

      res.json({
        contentType: bestType,
        time: bestTime,
        caption: 'Question-based hooks',
        frequency: '4–5 times/week'
      })
    })
    .on('error', () => {
      res.json({
        contentType: 'Video/Reels',
        time: '6–8 PM',
        caption: 'Question-based hooks',
        frequency: '4–5 times/week'
      })
    })
})

module.exports = router
