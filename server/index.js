const express = require('express');

const axios  = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;

// const getMockData = async () => {
//   const response = await axios.get('https://api.hatchways.io/assessment/blog/posts?tag=tech');
//   console.log(response.data);
// } 

// getMockData();

app.get('/api/ping', (req, res) => {
  res.status(200).send({"success": true});
});

app.get('/api/posts', async (req,res) => {
  if (!req.query.tags) {
    return res.status(400).send({"error": "Tags parameter is required"});
  }
  try {
    const {data} = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${req.query.tags}`);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});



app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})