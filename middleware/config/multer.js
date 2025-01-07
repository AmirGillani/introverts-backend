// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mobilemate', // Specify a folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif','webp'], // Specify allowed formats
    },
});

// Set up Multer to handle file uploads
const upload = multer({ storage: storage });

module.exports = upload;
