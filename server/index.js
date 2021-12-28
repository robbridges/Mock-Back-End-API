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


    // this works.. kind of.. it has two whole array listings of posts, and I know that there's got to be a better way. Work on this. 
    for (let i = 0; i < tagArray.length; i++) {
      const {data} = await axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tagArray[i]}`);
      posts.push(data);
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