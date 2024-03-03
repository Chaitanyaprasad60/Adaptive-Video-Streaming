var fs = require('fs');
//var ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
// open input stream
var infs = new ffmpeg

infs.addInput('videos/first.mp4').outputOptions([
    '-map 0:0',
    '-map 0:1',
    '-map 0:0',
    '-map 0:1',
    '-s:v:0 2160x3840',
    '-c:v:0 libx264',
    '-b:v:0 2000k',
    '-s:v:1 960x540',
    '-c:v:1 libx264',
    '-b:v:1 365k',
    // '-var_stream_map', '"v:0,a:0 v:1,a:1"',
    '-master_pl_name master.m3u8',
    '-f hls',
    '-max_muxing_queue_size 1024',
    '-hls_time 1',
    '-hls_list_size 0',
    '-hls_segment_filename', 'v%v/fileSequence%d.ts'
]).output('./videos/video.m3u8')
    .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('error', function (err, stdout, stderr) {
        console.log('An error occurred: ' + err.message, err, stderr);
    })
    .on('progress', function (progress) {
        console.log('Processing: ' + progress.percent + '% done')
    })
    .on('end', function (err, stdout, stderr) {
        console.log('Finished processing!' /*, err, stdout, stderr*/)
    })
    .run()