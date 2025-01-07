const express = require("express");

const fs = require("fs");

const HttpsErrors = require("./middleware/utilities/http-errors");

const storeRouter = require("./routes/storeRoutes");

const startServer = require("./server/createServer")

const app = express();

app.use(express.json())

app.use("/store", storeRouter);

// THIS WILL BE CALLED WHEN NO RESPONCE IS ACHIVED FROM ROUTE

app.use(() => {
  const error = new HttpsErrors("route not found !!", 404);
  throw error;
});

// CALL ERROR HANDLING MIDDLE WARE

app.use(function (error, req, res, next) {
  if (error.code == "1100") {
    res.status(401).json({ message: "User already exists" });
  }

  // IF ANY ERROR OCCOURS THEN UNLINK THAT FILE FROM SERVER

  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//UNCAUGHT ERROR HANDLER

process.on("uncaughtException", (err) => {
  console.log(`uncaught err ${err.message}`);
  process.exit(1);
});

startServer(app);