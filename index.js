require('dotenv').config();
const express = require('express');
const NMS = require('./nms');

NMS.init();

const app = express();
const router = require('./routes');

app.set('view engine', 'ejs');
app.use('/', router);

app.listen(3000, () => console.log('Listening on port 3000'));
