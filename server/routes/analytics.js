//this is server/routes/analytics.js

const express = require('express')
const router = express.Router()
const processAnalytics = require('../utils/analyticsProcessor')

router.get('/analytics', (req, res) => {
   const platforms = req.query.platforms?.split(',') || []

  processAnalytics(platforms, (data) => {
    res.json(data)
  })
})

module.exports = router


