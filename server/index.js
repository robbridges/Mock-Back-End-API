const app = require('./app')


//fake git commit!!+!!!!!!
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT} `)
})
