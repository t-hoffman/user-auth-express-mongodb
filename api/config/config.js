require("dotenv").config();
module.exports = { PORT, MONGODB_URI, SECRET_KEY, TOKEN_HEADER } = process.env;

// MONGODB connection
require("./db.connection");
