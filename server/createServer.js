
const mongoose = require("mongoose");


const startServer = async (app) => {
    try {
      await mongoose.connect("mongodb+srv://admin:123@cluster0.popsprf.mongodb.net/fixmate?retryWrites=true&w=majority&appName=Cluster0");
      app.listen(5000, () => {
        console.log("Server is running on port 5000");
      });
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  
module.exports = startServer;
  