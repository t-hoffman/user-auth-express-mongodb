// Envronment variables
require("dotenv").config();
module.exports = { PORT, MONGODB_URI, SECRET_KEY, TOKEN_HEADER, TOKEN_SPLIT } =
  process.env;

// Config variables
module.exports = {
  jwtExpiration: 60, // 1 min
  jwtRefreshExpiration: 60 * 60, // 1 hr
  cookieExpiration: 1000 * 60 * 60, // 1 hr
};

// MONGODB connection
require("./db.connection");
