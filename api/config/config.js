// Envronment variables
require("dotenv").config();
module.exports = { PORT, MONGODB_URI, SECRET_KEY, TOKEN_HEADER, TOKEN_SPLIT } =
  process.env;

// Config variables
module.exports = {
  jwtExpiration: 60,
  jwtRefreshExpiration: 60 * 60,
};

// MONGODB connection
require("./db.connection");
