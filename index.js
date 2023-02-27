const express = require('express')
const app = express()
const port = process.env.PORT || 8000;
require('dotenv').config()
const connectMongo = require('./config/mongo.config');
const postRouter = require('./src/routers/post.router')
const POST_PREFIX = '/api'
const cors = require('cors')

connectMongo()

app.use(cors())
app.use(express.json());

app.get(POST_PREFIX, (req, res) => {
  res.send('Hello World!')
})

app.use(POST_PREFIX, postRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})