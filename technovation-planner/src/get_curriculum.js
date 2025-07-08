import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/api/technovation', async (req, res) => {
  const response = await fetch('https://technovationchallenge.org/courses/beginner-division-curriculum/');
  const data = await response.text(); // or response.json() if it returns JSON
  res.send(data);
});

app.listen(5000, () => console.log('Proxy running on port 5000'));