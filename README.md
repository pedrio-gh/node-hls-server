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
    port: 8080,
    mediaPath: "./media",       // Root path to store media files
    cors: {                     // CORS options
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "*" 
    }
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
// addStream(streamName: String, streamSource: file path or URL)
server.addStream('stream1', 'path/to/video/file.mkv');
server.addStream('stream2', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
server.addStream('stream3', 'http://clappr.io/highline.mp4')
```

## Accessing streams
Once successfully added a stream, it will be served at:
- localhost:{port}/{streamName}/{hslFileName}.m3u8

With default config and above examples, streams could be accesed at:
````javascript
// M3U8 files
http://localhost:8080/stream1/index.m3u8 
http://localhost:8080/stream2/index.m3u8
http://localhost:8080/stream3/index.m3u8

// .ts segments files (just an example, several segments will be created and served from similar enpoints
http://localhost:8080/stream1/index1.ts 
http://localhost:8080/stream2/index1.ts
http://localhost:8080/stream3/index1.ts
````

# TO DO

 - [ ] Improve logging
 
 # Contributing
 This is my first open source project, feel free to report me errors, suggestions, anything you want.

## Disclaimer 
This project was inspired by [node-media-server](https://github.com/illuspas/Node-Media-Server) and [hls-server](https://github.com/t-mullen/hls-server) projects. The first offers a lot of other features not related with HLS. The second is a very lightweigthed middleware that was not enought for my purposes. Both of them also include features for rtmp and other stuff I was not interested in.

They are very useful but I wanted to make my own project strictly dedicated for serving HLS streams.