const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config.json')
const uploadMiddleWare = require('./fileUpload');

const app = express();
const port = 3000;
const chunkSize = config.chunkSize || 5 * 10 ** 5; //500KB // This is the size of video we want to send in one go. 

// API - To load HTML page (Frontend)
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


// API - For Stream the video
app.get('/video/:filename', (req, res) => {

  let fileName = req.params.filename || "defaultVideo";
  let rand = Math.random();
  console.log({rand})
  if(rand >  0.5){   
    console.log("inside") 
    fileName = "first2";
  }
  const videoPath = `./videos/${fileName}.mp4`; // Replace with the actual path to your video file
  console.log({fileName})
  const stat = fs.statSync(videoPath);
  const fileSize = 1954955; //stat.size;
  console.log(fileSize)
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + chunkSize, fileSize - 1); //If end is not mention we decide the chunk size
    //const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
      "fileName":fileName
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});


// API - Handle video upload using multer
app.post('/upload', uploadMiddleWare.single('video'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({
      status: "error",
      message: 'No file uploaded.'
    });
  }
  res.send({
    status: "success",
    message: `${config.backendUrl}?${req.body.fileName}`
  });
});


// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
