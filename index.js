require('dotenv').config();
const express = require('express');

const app = express();
const router = require('./routes');

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', router);

app.listen(3333, () => console.log('Listening on port 3333'));

app.get('/ok', (req, res) => {
  res.send('ok');
});
