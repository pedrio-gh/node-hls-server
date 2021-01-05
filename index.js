require('dotenv').config()
const express = require('express')
const app = express()
const got = require('got')
const NMS = require('./nms')

const APP_URL = process.env.APP_URL
const API_URL = process.env.API_URL

app.set('view engine', 'ejs')

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

NMS.init()

app.get('/', async (req, res) => {
  const response = await got(`${API_URL}/api/streams`)
  // const listingInfo = await got('https://www.thesportsdb.com/api/v1/json/1/eventsnextleague.php?id=4335')

  const info = JSON.parse(response.body)

  const channels = Object.keys(info.live).map(channel => {
    return {
      name: channel,
      stream: `${APP_URL}/player/${channel}`
    }
  })

  console.log(channels.length)

  res.render('channels', { channels })
})

app.get('/player/:channelId', (req, res) => {
  const { channelId } = req.params
  const source = `${process.env.API_URL}/live/${channelId}/index.m3u8`

  res.render('player', { source })
})

app.listen(3000, () => console.log('Listening on port 3000'))
