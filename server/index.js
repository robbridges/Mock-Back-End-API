const express = require('express');

const axios  = require('axios');
const { doesNotMatch } = require('assert');

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
  // if the user gives a comma seperated tag, we need to handle it with concurrent api requests.
  if (req.query.tags.includes(',')) {
    const tagArray = req.query.tags.split(',');
    
    const posts = [];
    // EUREKA!! Concurrently handled them all by mapping axios requests
    const axiosRequests = tagArray.map((tag) =>
      axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}` )
    );

    try {
      const axiosResults = await Promise.all(axiosRequests);
      axiosResults.map((result) => {
        posts.push(result.data.posts);
      })
    } catch (err) {
      res.status(500).send(e.message);
    }
    
    return res.status(200).send({posts});
  // user has only given one tag, we can handle it as we normally would.   
  } else {
    try {
      const {data} = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${req.query.tags}`);
      return res.status(200).send(data);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  } 
});





app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})