// server/utils/analyticsProcessor.js
const { fetchConjugatePosts } = require('./conjugateClient');

/**
 * Process aggregate metrics dynamically from live Conjugate Media posts
 */
async function processAnalytics(platforms = [], callback, userId = 'default_user') {
  if (typeof platforms === 'function') {
    callback = platforms;
    platforms = [];
  }

  try {
    const posts = await fetchConjugatePosts(userId);

    const lowerPlatforms = (platforms && platforms.length > 0)
      ? platforms.map(p => {
          let lower = p.toLowerCase();
          return lower === 'x' ? 'twitter' : lower;
        })
      : [];

    let likes = 0;
    let comments = 0;
    let shares = 0;
    let reach = 0;

    posts.forEach(row => {
      const currentPlatform = (row.platform || '').toLowerCase().replace('x', 'twitter');
      if (lowerPlatforms.length > 0 && !lowerPlatforms.includes(currentPlatform)) return;

      const l = Number(row.metrics?.likes || row.likes || 0);
      const c = Number(row.metrics?.comments || row.comments || 0);
      const s = Number(row.metrics?.shares || row.shares || 0);
      const r = Number(row.metrics?.reach || row.reach || (l + c + s) * 15);

      likes += l;
      comments += c;
      shares += s;
      reach += r;
    });

    const engagement = likes + comments + shares;
    const engagementRate = reach > 0 ? ((engagement / reach) * 100).toFixed(2) + '%' : '0%';

    const result = {
      likes,
      comments,
      shares,
      reach,
      engagement,
      engagementRate
    };

    if (typeof callback === 'function') {
      callback(result);
    }
    return result;
  } catch (err) {
    console.error('[Analytics Processor Error]:', err);
    const fallback = { likes: 0, comments: 0, shares: 0, reach: 0, engagement: 0, engagementRate: '0%' };
    if (typeof callback === 'function') callback(fallback);
    return fallback;
  }
}

module.exports = processAnalytics;
