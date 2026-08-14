/**
 * EngageIQ Server - AI Assistant Smart Intent Router
 * 
 * Target 1 Logic:
 * - For FIXED queries listed (trending topics, best time to post, Reels vs Static, 
 *   reach drop diagnosis, post recommendation, cross-platform comparison, metrics snapshot):
 *   -> Routes to EngageIQ ML Model & Dynamic Analytics Engine.
 * - For RANDOM / OPEN-ENDED queries:
 *   -> Routes to Gemini AI Agent (Google Generative AI).
 */

const { processNaturalLanguageQuery } = require('./nlpQueryEngine');
const { queryGeminiAgent } = require('./geminiAgent');

// Fixed query patterns for ML Engine
const FIXED_QUERY_PATTERNS = [
  // 1. Post Recommendations / What should I post next
  {
    id: 'recommendation',
    regex: /(what\s+should\s+i\s+post|post\s+next|next\s+post|increase\s+engagement|recommendation|how\s+to\s+increase\s+engagement)/i
  },
  // 2. Trending topics & hashtags
  {
    id: 'trending',
    regex: /(trend|trending|hashtag|trending\s+topics|popular\s+topics)/i
  },
  // 3. Best time to post / schedule
  {
    id: 'best_time',
    regex: /(best\s+time|when\s+to\s+post|posting\s+time|schedule|what\s+hour|peak\s+hour)/i
  },
  // 4. Content format comparison (Reels vs Static vs Carousel)
  {
    id: 'content_format',
    regex: /(reels\s+vs\s+static|static\s+vs\s+reels|content\s+format|content\s+type|carousel\s+vs|video\s+vs\s+static|which\s+content\s+type)/i
  },
  // 5. Reach or engagement drop diagnosis
  {
    id: 'diagnosis',
    regex: /(reach\s+drop|why\s+did\s+.*drop|engagement\s+drop|why\s+did\s+.*decrease|reach\s+decrease|fell\s+down|lost\s+reach)/i
  },
  // 6. Platform comparison
  {
    id: 'platform_comparison',
    regex: /(compare\s+.*vs|instagram\s+vs\s+twitter|linkedin\s+vs|facebook\s+vs|platform\s+comparison|compare\s+platforms)/i
  },
  // 7. Performance metrics summary
  {
    id: 'metrics_summary',
    regex: /(my\s+total\s+reach|total\s+likes|engagement\s+rate|my\s+performance\s+stats|show\s+metrics|analytics\s+summary)/i
  },
  // 8. ML model status & weights
  {
    id: 'ml_status',
    regex: /(ml\s+model|learned\s+weights|r2\s+score|ridge\s+regression|feature\s+importances)/i
  }
];

/**
 * Check if a query matches any of the fixed listed queries
 */
function isFixedListedQuery(question) {
  const q = (question || '').trim();
  for (const item of FIXED_QUERY_PATTERNS) {
    if (item.regex.test(q)) {
      return { isFixed: true, patternId: item.id };
    }
  }
  return { isFixed: false, patternId: null };
}

/**
 * Route incoming query based on classification and user preferences
 * 
 * @param {string} question - The user's query
 * @param {Array} connectedPlatforms - List of active platforms
 * @param {string} mode - 'auto' | 'ml_only' | 'gemini_only'
 * @param {string} userId - User identifier
 */
async function routeAIQuery(question, connectedPlatforms = [], mode = 'auto', userId = 'default_user') {
  const cleanQuery = (question || '').trim();
  const classification = isFixedListedQuery(cleanQuery);

  // Forced ML mode
  if (mode === 'ml_only') {
    const mlResult = await processNaturalLanguageQuery(cleanQuery, connectedPlatforms, userId);
    return {
      ...mlResult,
      engineUsed: 'ml_model',
      engineLabel: 'EngageIQ Dynamic ML Model & Analytics Engine',
      routingReason: 'User selected ML Model Only mode'
    };
  }

  // Forced Gemini mode
  if (mode === 'gemini_only') {
    const geminiResult = await queryGeminiAgent(cleanQuery, { platforms: connectedPlatforms, userId });
    return {
      ...geminiResult,
      routingReason: 'User selected Gemini Agent Only mode'
    };
  }

  // Auto Mode: Fixed Query -> ML Engine; Random Query -> Gemini Agent
  if (classification.isFixed) {
    const mlResult = await processNaturalLanguageQuery(cleanQuery, connectedPlatforms, userId);
    return {
      ...mlResult,
      engineUsed: 'ml_model',
      engineLabel: 'EngageIQ Dynamic ML Model & Analytics Engine',
      routingReason: `Matched fixed analytical query pattern (${classification.patternId})`
    };
  } else {
    const geminiResult = await queryGeminiAgent(cleanQuery, { platforms: connectedPlatforms, userId });
    return {
      ...geminiResult,
      routingReason: 'Random / Open-ended query routed to Gemini AI Agent'
    };
  }
}

module.exports = {
  routeAIQuery,
  isFixedListedQuery,
  FIXED_QUERY_PATTERNS
};
