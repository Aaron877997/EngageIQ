const http = require('http');
const req = http.get('http://localhost:5001/api/analytics?platforms=instagram,facebook', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.on('error', (e) => console.error('Error:', e.message));
req.setTimeout(2000, () => {
  console.log('Timeout!');
  req.destroy();
});
