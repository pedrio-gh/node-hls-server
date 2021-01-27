const Logger = require('./logger');
const EventsEmitter = require('events');
const mkdirp = require('mkdirp');

const FFMPEG = require('fluent-ffmpeg');

class HLSSession extends EventsEmitter {
  constructor (name, input, options) {
    super();
    this.name = name;
    this.input = input;
    this.mediaPath = options.mediaPath;
    this.transOptions = options.transOptions;
    this.hlsOptions = options.hlsOptions;
    this.hlsFileName = options.hlsFileName;
    this.ffmpeg = FFMPEG();
  }

  run () {
    const outputPath = `${this.mediaPath}/${this.name}`;
    const hlsFileName = this.hlsFileName || 'index.m3u8';

    Logger.debug(`[INFO] Transmuxing HLS: ${this.input} => ${outputPath}`);
    Logger.debug(`[INFO] HLS file name: ${hlsFileName}`);

    mkdirp.sync(outputPath);

    this.ffmpeg
      .addInput(this.input)
      .addOption('-loglevel warning')
      .addOption(this.transOptions)
      .addOption('-f hls')
      .addOption(this.hlsOptions)
      .output(`${outputPath}/${hlsFileName}`);

    this.ffmpeg.on('start', (command) =>
      Logger.debug('[INFO] FFMPEG transcoding started with command: ' + command)
    );

    this.ffmpeg.on('stderr', (stdErrline) =>
      Logger.error(stdErrline)
    );

    this.ffmpeg.on('error', (err, stdout, stderr) =>
      Logger.error(err.message)
    );

    this.ffmpeg.on('end', (stdout, stderr) => {
      this.emit('end');
      Logger.debug('[INFO] Transcoding ended');
    });

    this.ffmpeg.run();
  }

  stop () {
    this.ffmpeg.kill('SIGKILL');
  }
}

module.exports = HLSSession;
