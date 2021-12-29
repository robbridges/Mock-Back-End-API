const express = require('express');

const axios  = require('axios');
const _ = require('lodash');
const apicache = require('apicache');

let cache = apicache.middleware

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cache('100 minutes'));

app.get('/api/ping', (req, res) => {
  res.status(200).send({"success": true});
});

app.get('/api/posts', async (req,res) => {
  // these are the only 3 that directions can be, it took me a minute to think of including undefeined in the event the client doesn't provide it.
  const directions = ['asc', 'desc', undefined];
  // the only options that should be passed to sort, we'll throw another error if it's not included in our array
  const sortKeywords = ['popularity', 'likes', 'reads', 'id', undefined];

  if (!directions.includes(req.query.direction)) {
    return res.status(400).send({error: "Direction parameter must be asc or desc"});
  }

  if (!sortKeywords.includes(req.query.sortBy)) {
    return res.status(400).send({error: "sortBy Parameter is invalid, please choose between popularity, likes, reads, or id"})
  }

  if (!req.query.tags) {
    return res.status(400).send({"error": "Tags parameter is required"});
  }
    /* if the user gives a comma seperated tag, we need to handle it with concurrent api requests, I removed the else catch if one tag was supplied. 
    we're actually taking of everything in this one. */
  
    const tagArray = req.query.tags.split(',');
    
    let posts = [];
    // EUREKA!! Concurrently handled them all by mapping axios requests
    const axiosRequests = tagArray.map((tag) =>
      axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}` )
    );

    try {
      const axiosResults = await Promise.all(axiosRequests);
      axiosResults.map((result) => {
        // we are checking for duplicates before we add the posts to the new post array, It works pretty good so far
        posts = checkforDuplicatePosts(posts, result.data.posts);
      })
    } catch (err) {
      return res.status(500).send(err.message);
    }
    
    // if the query param desc is passed we sort the posts the ports descending based on the field in the query param.
    if (req.query.direction === 'desc') {
      posts = posts.sort((a, b) => (b[req.query.sortBy] > a[req.query.sortBy]) ? 1 : -1)
    } else {
      posts = posts.sort((a, b) => (b[req.query.sortBy] < a[req.query.sortBy]) ? 1 : -1)
    }

    return res.status(200).send({posts});
});


// we need to compare each object within the posts, the best way to compare an object is Lodash, I've fought and argued about trying to not use a nested loop, but for now it'll have to do.
const checkforDuplicatePosts =(existingPosts, newPosts) => {
  for (let i = 0; i < newPosts.length; i++) {
    duplicatePost = false;

    for (let j = 0; j < existingPosts.length; j++) {
      if (_.isEqual(existingPosts[j], newPosts[i])) {
        duplicatePost = true;
      }
    }

    
    if (!duplicatePost) {
      existingPosts.push(newPosts[i]);
    }
  }

  return existingPosts;
}


app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})