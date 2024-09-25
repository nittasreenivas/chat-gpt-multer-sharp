const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();

// Setup storage using multer's memory storage (stores file in memory for processing)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create an uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Upload and resize image endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filename = Date.now() + '-' + req.file.originalname;

    // Resize and save the image using sharp
    await sharp(req.file.buffer)
      .resize(300, 300) // Resize to 300x300
      .toFile(path.join(uploadDir, filename));

    res.send(`Image uploaded and resized successfully as ${filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the image.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
