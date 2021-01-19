#  node-hls-server
Simple HLS server running on NodeJS. It takes care of remuxing your video sources into HLS and serve it. 

# Features
- Remux inputs (video or streaming) to **HTTP Live Streaming** (HLS)
- Serve **.m3u8** and **.ts**  segments at a dedicated endpoint
- Support for custom ffmpeg command options

# Usage
## Start the server
### Default config
```javascript
const HLSServer = require('hlsServer');
const server = new HLSServer(); // If no config is provided it will use the default options
server.run();
```

### Custom Config
```javascript
const HLSServer = require('hlsServer');
const server = new HLSServer({
    port: 3000,
    mediaPath: "./media",       // Root path to store media files
    transOptions: [             // FFMPEG transcoding options
        "-c:v copy",
        "-c:a copy"
    ],
    hlsOptions: [               // Specific FFMPEG HLS options
        "-hls_wrap 5",
        "-hls_time 5"
    ],
    hlsFileName: "index.m3u8"   // m3u8 and segments basename
});  // See config options for more information
server.run();
```

## Adding streams from sources 
```javascript
server.addStream('stream_name', 'path/to/video/file.mkv');
server.addStream('stream_name2', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
server.addStream('stream_name3', 'http://clappr.io/highline.mp4')
```

## Disclaimer 
This project was inspired by [node-media-server](https://github.com/illuspas/Node-Media-Server) and [hls-server](https://github.com/t-mullen/hls-server) projects. The first offers a lot of other features not related with HLS. The second is a very lightweigthed middleware that was not enought for my purposes. Both of them also include features for rtmp and other stuff I was not interested in.

They are very useful but I wanted to make my own project strictly dedicated for serving HLS streams.