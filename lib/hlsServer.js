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
    '-preset superfast',
    '-tune zerolatency',
    '-threads 12',
    '-b:v 1M',
    '-minrate 1M',
    '-maxrate 1M',
    '-bufsize 100M',
    '-c:a aac',
    '-ac 2',
    '-b:a 64k',
  ],
  hlsOptions: [
    '-hls_time 2',
  ],
  hlsFileName: 'index.m3u8',
  ffmpegLoggingLevel: '-loglevel info',
};

const hlsServer = new HLSServer(config);

setInterval(() => {
  hlsServer.hlsSessions.forEach((session) => {
    if (session.lastRequestAt + 30000 > Date.now()) {
      console.log(`Stopping inactive stream ${session.name}`);
      hlsServer.stopStream(session.name);
    }
  });
}, 60000);

module.exports = hlsServer;
