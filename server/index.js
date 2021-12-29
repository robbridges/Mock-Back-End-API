const express = require('express');

const apicache = require('apicache');

const postRouter = require('./Routes/posts');

let cache = apicache.middleware

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cache('100 minutes'));

app.use(postRouter);





app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})