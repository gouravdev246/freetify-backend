require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth.route')
const musicRoute = require('./routes/music.route')
var cors = require('cors')
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use('/api/auth', authRoute)
app.use('/api/music', musicRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app