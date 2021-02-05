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
    '-c:v libx264',
    '-s 1080x720',
    '-threads 12',
    '-b:v 1000k',
    '-maxrate 1200k',
    '-bufsize 20M',
    '-c:a aac',
    '-ac 2',
    '-b:a 64k',
  ],
  hlsOptions: [
    '-hls_wrap 10',
    '-hls_time 2',
  ],
  hlsFileName: 'index.m3u8',
};

const hlsServer = new HLSServer(config);

module.exports = hlsServer;
