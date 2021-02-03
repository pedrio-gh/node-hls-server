const HLSServer = require('node-hls-server');

const config = {
  port: 8080,
  cors: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Method': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': '*',
  },
  mediaPath: './media',
  transOptions: [
    '-preset veryfast',
    '-vf scale=720:480',
    '-c:v libx264',
    '-b:v 700k',
    '-c:a aac',
    '-ac 2',
    '-b:a 64k',
  ],
  hlsOptions: [
    '-hls_wrap 5',
    '-hls_time 4',
  ],
  hlsFileName: 'index.m3u8',
};

const hlsServer = new HLSServer(config);

module.exports = hlsServer;
