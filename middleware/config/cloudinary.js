const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dj5ph1k2r",
  api_key: process.env.API_KEY || "874228825552952",
  api_secret: process.env.API_SECRET || "-bVExvUKFfSF-nHfWp9F8iuQyqM",
});

module.exports = cloudinary;
