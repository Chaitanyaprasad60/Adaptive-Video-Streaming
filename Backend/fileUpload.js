
const multer = require('multer');

// Function - Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'videos/'); // Folder where video files have to be uploaded
    },
    filename: function (req, file, cb) {
      // Unique filename for user-uploaded files
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      req.body.fileName = uniqueSuffix;
      cb(null, uniqueSuffix + '.mp4');
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;