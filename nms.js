const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const M3U8FileParser = require('m3u8-file-parser')
const NodeMediaServer = require('node-media-server')

module.exports.init = () => {
  const config = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 8000,
      mediaroot: './media',
      allow_origin: '*'
    },
    trans: {
      ffmpeg: '/usr/bin/ffmpeg',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=3:hls_list_size=4:hls_flags=delete_segments]'
        }
      ]
    }
  }

  const nms = new NodeMediaServer(config)
  nms.run()

  const file = fs.readFileSync('source.m3u8', { encoding: 'utf-8' })
  const reader = new M3U8FileParser()
  let content = reader.read(file)
  content = reader.getResult()

  content.segments.forEach((channel, i) => {
    const command = ffmpeg(channel.url, { logger: true })
    command.addInputOptions(['-re'])
    command.addOutputOptions([
      '-f flv',
      '-c:v libx264',
      '-preset veryfast',
      '-tune zerolatency',
      '-c:a aac'
    ])

    command.output(`rtmp://localhost/live/${channel.inf.title}`)
    command.on('error', function (err) {
      console.log(`${channel.inf.title.replace(/ /g, '_')} an error happened:` + err.message)
    })

    command.run()
  })
}
