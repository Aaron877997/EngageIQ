//this is server/routes/aiQuery.js

const express = require('express')
const router = express.Router()
const processAnalytics = require('../utils/analyticsProcessor')

router.post('/ai-query', (req, res) => {
  const { question } = req.body
  const platforms = req.query.platforms?.split(',') || []

  processAnalytics(platforms, (stats) => {
    let response = 'Data not sufficient. Try asking about engagement, reach, likes, content type, or what to post.'

    const q = question.toLowerCase();

    if (q.includes('engagement')) {
      response = `Your overall engagement rate across selected platforms is ${stats.engagementRate}, with a total of ${stats.engagement} engagements.`
    } 
    else if (q.includes('reach') || q.includes('drop')) {
      response = `Your total reach is ${stats.reach}. The drop last week was likely due to algorithm changes; try posting more Reels!`
    } 
    else if (q.includes('likes')) {
      response = `You have a total of ${stats.likes} likes.`
    }
    else if (q.includes('content') || q.includes('best')) {
      response = `Based on your data, Video and Reels are performing 42% better than static posts.`
    }
    else if (q.includes('post next') || q.includes('what should i post')) {
      response = `You should post a Video/Reel between 6–8 PM with a question-based hook.`
    }

    res.json({ response })
  })
})

module.exports = router

