const HttpsErrors = require("../utilities/http-errors");

function catchAsyncError(theFunction) {

  return function (req, res, next) {

    // PROMISE.RESOLVE TAKE PROMISE OBJECT AND CHECKS IF ERROR OCCOURED
    
    Promise.resolve(theFunction(req, res, next)).catch((err)=>{
      return next(new HttpsErrors(`Error Occoured ${err}`, 500))
    });

  }

}

module.exports = catchAsyncError;