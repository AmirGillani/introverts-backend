const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // cloudinary instance
  params: {
    folder: 'introverts', // The Cloudinary folder where files will be stored
    resource_type: 'auto', // Let Cloudinary detect type (image/video/etc)
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm'], // Allow videos
  },
});

// Set up Multer to handle file uploads
const upload = multer({ storage: storage });

module.exports = upload;
