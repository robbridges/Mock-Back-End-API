const request = require('supertest');
const app = require('../server/app');



test('testing jest implementation', () => {
  const number = 2;
  expect(number).toBe(2);
})

test('Should get correct response from server when getting api/ping route', async () => {
  await request(app).get('/api/ping')
  .expect(200)
})

test('Should get correct response body from server when getting api/ping route', async () => {
   await request(app).get('/api/ping')
   .expect({success: true});
})

test('Should correctly return 404 when route does not exist', async () => {
  await request(app).get('/api/djklwajdlk')
  .expect(404);
})

test('Should throw an error code if no tag is given', async () => {
  await request(app).get('/api/posts')
  .expect(400);
})

test('Should give proper error message when no tag parameter is given', async () => {
  await request(app).get('/api/posts')
  .expect({error: "Tags parameter is required"});
});

test('Should give correct code when request is given correctly', async () => {
  await request(app).get('/api/posts?tags=tech')
  .expect(200)
})

test('Should allow multiple tags to be given with comma seperated values', async () => {
  await request(app).get('/api/posts?tags=tech,history')
  .expect(200);
});

test('Should succeed when asking app to sort by reads of post order in incorrect direction query is given', async () => {
  await request(app).get('/api/posts?tags=tech,history&sortBy=likes')
  .expect(200);
});

test('Should give an error code if client requests to sort by unknown parameter', async () => {
  await request(app).get('/api/posts?tags=tech,health&sortBy=fake')
  .expect(400)
});

test('Should give a unique error code if client requests to sort by unknown paramter', async () => {
  await request(app).get('/api/posts?tags=tech,science&sortBy=fake')
  .expect({error: "sortBy Parameter is invalid, please choose between popularity, likes, reads, or id"});
});

test('Should succeed if client requests sort direction with acceptable direction', async () => {
  await request(app).get('/api/posts?tags=tech,finance&sortBy=likes&direction=desc')
  .expect(200);
});

test('Should give an error code of 400 if the direction is not asc or desc', async () => {
  await request(app).get('/api/posts?tags=tech,finance&sortBy=likes&direction=ascx')
  .expect(400);
})

test('Should give unique error message letting the user know the accepted direction queries', async () => {
  await request(app).get('/api/posts?tags=tech,finance&sortBy=likes&direction=ascx')
  .expect({error: "Direction parameter must be asc or desc"});
})

test('posts should all have a unique id', async () => {
  const response = await request(app).get('/api/posts?tags=culture')
  /* I'm going to extract the array returned, and try to convert it to a set. Since sets do not allow duplicate objects to be added if the size of the array and the set are the same
   then no duplicates exist in the initial array. */
  const posts = response.body.posts
  const postSet = new Set(posts);
  expect(postSet.size).toEqual(posts.length);
});

test('if no direction is given, the posts should be sorted by ID in descending order', async () => {
  const response = await request(app).get('/api/posts?tags=culture')
  const posts = response.body.posts
  const postIdArray = []
  posts.map(post => postIdArray.unshift(post.id));
  expect(postIdArray).toEqual(postIdArray.sort())
});

test('sorting by likes without a direction given sorts them by ascending order', async () => {
  const response = await request(app).get('/api/posts?tags=culture&sortBy=likes')
  const posts = response.body.posts
  const postLikesArray = []
  posts.map(post => postLikesArray.push(post.likes));
  expect(postLikesArray).toEqual(postLikesArray.sort());
});

test('Sorting by reads in desc direction given returns the likes in descending order', async () => {
  const response = await request(app).get('/api/posts?tags=culture&sortBy=reads&direction=desc')
  const posts = response.body.posts
  const postReadsArray = posts.map(post => post.reads)
  // we are going to have to actually reverse sort the array with a custom easy to implement function to make sure they are equal.
  expect(postReadsArray).toEqual(postReadsArray.sort((a,b) => {return b-a}));
});





