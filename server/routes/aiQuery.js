// server/routes/aiQuery.js
const express = require('express');
const router = express.Router();
const { processNaturalLanguageQuery } = require('../utils/nlpQueryEngine');

router.post('/ai-query', async (req, res) => {
  try {
    const { question } = req.body;
    const platforms = req.query.platforms ? req.query.platforms.split(',').filter(Boolean) : [];

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Please provide a valid question.' });
    }

    const result = await processNaturalLanguageQuery(question, platforms);
    res.json(result);
  } catch (error) {
    console.error('AI Query Error:', error);
    res.status(500).json({
      error: 'Failed to process AI query.',
      response: 'An error occurred while analyzing the query. Please try asking again.'
    });
  }
});

module.exports = router;
