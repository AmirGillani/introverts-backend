const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // cloudinary instance
  params: {
    folder: 'introverts', // The Cloudinary folder where the uploaded files will be stored
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Allowed file formats
  },
});

// Set up Multer to handle file uploads
const upload = multer({ storage: storage });

module.exports = upload;
