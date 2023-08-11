const jwt = require("jsonwebtoken");

exports.userVerification =  (req, res,next) => {
  // extracting the token and message from req
  const token = req.headers.authorization;
  const { message } = req.body;

  try {
    if (token) {
        // decrypting the token
      const { userId, userName } =  jwt.verify(
        token,
        process.env.LOGIN_PASSWORD_TOKENKEY
      );
      // assigning to req object 
      req.userId = userId;
      req.userName = userName;
      req.message = message;
    }
    // assigning to next function
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json("invalid token");
  }
};
