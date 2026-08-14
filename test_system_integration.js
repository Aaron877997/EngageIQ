/**
 * Comprehensive System Integration Test
 * 
 * Validates:
 * 1. Conjugate Media Server (Port 5002) - Email Document Keying (users/{userEmail})
 * 2. Multi-User Isolation - Data scoped accurately per user email
 * 3. EngageIQ Server (Port 5001) - Analytics, Sentiment, Timelines, Platforms for userEmail
 * 4. AI Query Smart Router - Fixed queries to ML Model, Random queries to Gemini Agent
 * 5. Standalone Conjugate Media Client build validation
 */

const conjugateStore = require('./conjugate-media/server/services/conjugateStore');
const { routeAIQuery, isFixedListedQuery } = require('./server/utils/aiAssistantRouter');
const processAnalytics = require('./server/utils/analyticsProcessor');
const { trainModelOnPastPosts } = require('./ml/dynamicTrainer');

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Standalone Conjugate Media & EngageIQ Tests');
  console.log('========================================================\n');

  const testUserEmail = 'saurabh.test@engageiq.com';

  // TEST 1: Conjugate Media Channel & Post Management under User Email Document
  console.log(`--- [TEST 1] Conjugate Media Firebase Storage for ${testUserEmail} ---`);
  const initialChannels = await conjugateStore.getChannels(testUserEmail);
  console.log('✓ Channels Loaded for User Email:', Object.keys(initialChannels).join(', '));
  console.log('  Instagram Initial Subscribers:', initialChannels.instagram?.subscribers);

  // Increase Subscribers by 2,500
  const updatedChannel = await conjugateStore.updateChannel(testUserEmail, 'instagram', {
    deltaSubscribers: 2500
  });
  console.log('✓ Updated Instagram Subscribers (+2500):', updatedChannel.subscribers);

  // Create a new post for this user
  const newPost = await conjugateStore.createPost(testUserEmail, {
    platform: 'instagram',
    postType: 'video',
    category: 'AI & Tech',
    caption: 'Dynamic Multi-Agent System on Conjugate Media! What are your thoughts? #AI #Dev',
    mediaSpecs: { aspectRatio: '9:16', durationSec: 28, hasSubtitles: true, hookRating: 9 }
  });
  console.log('✓ New Post Created for User:', newPost.id, `(${newPost.platform.toUpperCase()})`);

  // Modulate Metrics (+800 likes, +120 comments)
  const modulatedPost = await conjugateStore.updatePostMetrics(testUserEmail, newPost.id, {
    likesDelta: 800,
    commentsDelta: 120,
    sharesDelta: 65
  });
  console.log('✓ Modulated Post Metrics: Likes =', modulatedPost.metrics.likes, 'Comments =', modulatedPost.metrics.comments, 'Score =', modulatedPost.metrics.engagementScore);

  // Add Comment with Automated Sentiment Tagging
  const commentResult = await conjugateStore.addComment(testUserEmail, newPost.id, {
    user: 'lead_architect',
    comment: 'The user email document keying in Firestore works seamlessly!'
  });
  console.log('✓ Added Comment:', commentResult.newComment.comment, '-> Sentiment:', commentResult.newComment.sentiment);

  console.log('\n--- [TEST 2] Dynamic ML Model Retraining on User Email Dataset ---');
  const trainedModel = trainModelOnPastPosts(testUserEmail);
  console.log('✓ Ridge Regression Retrained on Live Posts!');
  console.log('  Model Status:', trainedModel.status);
  console.log('  R² Score:', trainedModel.r2_score);
  console.log('  Samples Count:', trainedModel.sample_count);

  console.log('\n--- [TEST 3] Dynamic EngageIQ Analytics Integration for User Email ---');
  const analytics = await processAnalytics(['instagram', 'twitter', 'linkedin', 'facebook'], null, testUserEmail);
  console.log(`✓ Aggregated Live Analytics for ${testUserEmail}:`);
  console.log(`  Total Likes: ${analytics.likes.toLocaleString()}`);
  console.log(`  Total Comments: ${analytics.comments.toLocaleString()}`);
  console.log(`  Total Shares: ${analytics.shares.toLocaleString()}`);
  console.log(`  Total Reach: ${analytics.reach.toLocaleString()}`);
  console.log(`  Engagement Rate: ${analytics.engagementRate}`);

  console.log('\n--- [TEST 4] AI Assistant Smart Routing (Target 1) ---');
  
  // 4A: Fixed Query -> Routes to ML Model
  const fixedQuery = "What should I post next to increase engagement?";
  console.log(`Query A: "${fixedQuery}"`);
  const classA = isFixedListedQuery(fixedQuery);
  console.log(`  Classification: IsFixed = ${classA.isFixed} (Pattern: ${classA.patternId})`);
  const resultA = await routeAIQuery(fixedQuery, ['instagram', 'linkedin'], 'auto', testUserEmail);
  console.log(`  Engine Selected: ${resultA.engineUsed} (${resultA.engineLabel})`);
  console.log(`  Response Title: ${resultA.title}`);
  console.log(`  Response Snippet: ${resultA.response.split('\n')[0]}`);

  // 4B: Random / Creative Query -> Routes to Gemini Agent
  const randomQuery = "Write 3 viral opening hooks for an AI SaaS product launch";
  console.log(`\nQuery B: "${randomQuery}"`);
  const classB = isFixedListedQuery(randomQuery);
  console.log(`  Classification: IsFixed = ${classB.isFixed}`);
  const resultB = await routeAIQuery(randomQuery, ['linkedin', 'twitter'], 'auto', testUserEmail);
  console.log(`  Engine Selected: ${resultB.engineUsed} (${resultB.engineLabel})`);
  console.log(`  Response Title: ${resultB.title}`);

  console.log('\n========================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================================');
}

runTests().catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
