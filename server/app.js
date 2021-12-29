const express = require('express');

const apicache = require('apicache');

const postRouter = require('./Routes/posts');

const app = express();

let cache = apicache.middleware

app.use(cache('100 minutes'));

app.use(postRouter);

module.exports = app;