const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config.json')
const uploadMiddleWare = require('./fileUpload');
const cors = require('cors');

const app = express();
const port = config.port || 3000;
const chunkSize = config.chunkSize || 5 * 10 ** 5; //500KB // This is the size of video we want to send in one go. 

app.use(cors())

// API - To load HTML page (Frontend)
app.get("/", function (req, res) {

  res.sendFile(__dirname + "/index.html");


});

app.get("/assets/:filename", function (req, res) {
  console.log(req.params.filename)

  console.log(__dirname + `/assets/${req.params.filename}`)
  res.sendFile(__dirname + `/assets/${req.params.filename}`);



});


// API - For Stream the video
app.get('/video/:filename', (req, res) => {
  console.log("Here",req.params.filename)
  //let fileName = "video.m3u8";
  let fileName = req.params.filename;
  console.log("poipoi", { fileName })
  //let rand = Math.random();
  // console.log({rand})
  // if(rand >  0.5){   
  //   console.log("inside") 
  //   fileName = "first2";
  // }
  const videoPath = `./videos/${fileName}`; // Replace with the actual path to your video file
  console.log({ fileName })
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  console.log(fileSize)
  const range = req.headers.range;
  res.setHeader('Content-Type', 'application/x-mpegURL');
  console.log({ videoPath })
  const file = fs.createReadStream(videoPath);
  file.pipe(res);
  //}
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
