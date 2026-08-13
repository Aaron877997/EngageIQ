//this is server/routes/exportReport.js

const express = require('express')
const router = express.Router()
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const processAnalytics = require('../utils/analyticsProcessor')

router.get('/export-report', (req, res) => {
  const doc = new PDFDocument({ margin: 40 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=EngageIQ_Report.pdf'
  )

  doc.pipe(res)

  // TITLE
  doc
    .fontSize(20)
    .text('EngageIQ – Social Media Analytics Report', { align: 'center' })
    .moveDown(2)

  // ANALYTICS
  processAnalytics((stats) => {
    doc.fontSize(14).text('Key Metrics').moveDown(0.5)

    doc.fontSize(11)
    doc.text(`Total Likes: ${stats.likes}`)
    doc.text(`Total Comments: ${stats.comments}`)
    doc.text(`Total Shares: ${stats.shares}`)
    doc.text(`Total Engagement: ${stats.engagement}`)
    doc.text(`Engagement Rate: ${stats.engagementRate}`)
    doc.moveDown(1.5)

    // INSIGHTS
    doc.fontSize(14).text('Insights Summary').moveDown(0.5)
    doc.fontSize(11)
    doc.text(
      '• Engagement trends indicate consistent audience interaction across platforms.'
    )
    doc.text(
      '• Content with higher emotional sentiment tends to receive better engagement.'
    )
    doc.moveDown(1.5)

    // RECOMMENDATIONS
    doc.fontSize(14).text('Strategic Recommendations').moveDown(0.5)
    doc.fontSize(11)
    doc.text('• Recommended Content Type: Reels / Carousel')
    doc.text('• Best Time to Post: 6–8 PM')
    doc.text('• Caption Strategy: Question-based hooks')
    doc.text('• Posting Frequency: 4–5 times per week')

    doc.end()
  })
})

module.exports = router
