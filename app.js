const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

// add .env file
require('dotenv').config();

// Configure AWS SDK with your credentials
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configure Multer for file upload
const upload = multer();

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer
    };

    s3.upload(uploadParams, (err, data) => {
        if (err) {
            console.error('Error object:', err);
            console.error('Error message:', err.message);
            console.error('Error code:', err.code);
            return res.status(500).send('Failed to upload image');
        }
        res.send(`Image uploaded successfully. URL: ${data.Location}`);
    });
});

// Download endpoint
app.get('/download/:key', (req, res) => {
    const { key } = req.params;
    const downloadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    };

    s3.getObject(downloadParams, (err, data) => {
        if (err) {
            console.error('Error object:', err);
            console.error('Error message:', err.message);
            console.error('Error code:', err.code);
            return res.status(500).send('Failed to download image');
        }
        res.send(data.Body);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
