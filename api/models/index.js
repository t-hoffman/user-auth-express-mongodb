const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.User = require("./user.model");
db.refreshToken = require("./refreshToken.model");

module.exports = db;
