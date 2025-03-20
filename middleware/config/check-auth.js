const jwt = require('jsonwebtoken');
const HttpError = require("../utilities/http-errors");

function checkToken(req, res, next) {
  // Skip OPTIONS request
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Check if the Authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication failed! Token missing or invalid.');
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Decode the token using your secret key
    const decodedToken = jwt.verify(token, 'this is secret key');

    // Attach the decoded token (user data) to the request object
    req.user = decodedToken._doc;

    // Proceed to the next middleware or route handler
    next();
    
  } catch (err) {
    // If there's an error (token missing/expired/invalid), send a 401 response
    const error = new HttpError('Authentication failed! Invalid or expired token.', 401);
    return next(error);
  }
}

module.exports = checkToken;
