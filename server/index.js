const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/ping', (req, res) => {
  res.status(200).send({"success": true});
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})