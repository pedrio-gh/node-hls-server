require('dotenv').config();
const express = require('express');

const app = express();
const router = require('./routes');

app.set('view engine', 'ejs');
app.use('/', router);

app.listen(3000, () => console.log('Listening on port 3000'));

app.get('/ok', (req, res) => {
  res.send('ok');
});
