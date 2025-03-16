
const mongoose = require("mongoose");


const startServer = async (app) => {
    try {
      await mongoose.connect(process.env.MONODB_CONNECTION_STRING);
      app.listen(process.env.PORT, () => {
        console.log("Server is running on port 5000");
      });
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  
module.exports = startServer;
  