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
    '-threads 8',
    '-bufsize 10',
    '-c:v copy',
    '-preset veryfast',
    '-c:a aac',
    '-map 0:v',
    '-map 0:a',
  ],
  hlsOptions: [
    '-hls_wrap 5',
    '-hls_time 5',
  ],
  hlsFileName: 'index.m3u8',
};

const hlsServer = new HLSServer(config);

module.exports = hlsServer;
