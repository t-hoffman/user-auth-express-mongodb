// Envronment variables
require("dotenv").config();
module.exports = { PORT, MONGODB_URI, SECRET_KEY, TOKEN_HEADER, TOKEN_SPLIT } =
  process.env;

// Config variables
module.exports = {
  // jwtExpiration: 3600,
  // jwtRefreshExpiration: 86400,
  jwtExpiration: 30,
  jwtRefreshExpiration: 180,
};

// MONGODB connection
require("./db.connection");
