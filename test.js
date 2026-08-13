const processAnalytics = require('./server/utils/analyticsProcessor');

processAnalytics(['instagram'], (data) => {
  console.log('Result:', data);
});
