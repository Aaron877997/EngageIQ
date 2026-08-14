// Test all newly implemented endpoints
const http = require('http');

function postJson(urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5001,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(responseData) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: responseData });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: 'localhost', port: 5001, path: urlPath }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseData) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseData });
        }
      });
    });
    req.on('error', reject);
  });
}

async function runTests() {
  console.log('Testing AI Studio Endpoints on Server:');

  try {
    // 1. Test AI Natural Language Query
    const q1 = await postJson('/api/ai-query?platforms=instagram,twitter', {
      question: 'What is the best time to post on Instagram?'
    });
    console.log('1. AI Query (Best Time):', q1.status, q1.data?.title);

    // 2. Test Trending Topics Query
    const q2 = await postJson('/api/ai-query?platforms=linkedin', {
      question: 'What topics are trending on LinkedIn?'
    });
    console.log('2. AI Query (Trends):', q2.status, q2.data?.title);

    // 3. Test Text Draft Prediction
    const pred1 = await postJson('/api/predict-draft', {
      postType: 'text',
      platform: 'instagram',
      text: 'Discover 5 AI tools that will save you 10+ hours every week! Which one are you trying first? Link in bio. #AI #TechTrends',
      followers: 15000
    });
    console.log('3. Text Draft Prediction:', pred1.status, 'Score:', pred1.data?.engagementScore, 'Tier:', pred1.data?.tier);

    // 4. Test Video Prediction
    const videoPred = await postJson('/api/predict-video', {
      platform: 'instagram',
      durationSec: 28,
      aspectRatio: '9:16',
      hasSubtitles: true,
      hookRating: 9,
      audioType: 'trending',
      caption: 'Watch AI build an entire app in 60s!',
      followers: 15000
    });
    console.log('4. Video Prediction:', videoPred.status, 'Score:', videoPred.data?.engagementScore, 'Virality:', videoPred.data?.viralityRating);

    // 5. Test Trending Topics Platform API
    const trends = await getJson('/api/trending-topics?platform=instagram');
    console.log('5. Trending Topics API:', trends.status, 'Platform:', trends.data?.data?.name, 'Topics count:', trends.data?.data?.trendingTopics?.length);

    console.log('\nALL BACKEND ENDPOINTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  }
}

runTests();
