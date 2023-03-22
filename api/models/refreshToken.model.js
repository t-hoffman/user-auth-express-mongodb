const mongoose = require("mongoose");
const config = require("../config/config");
const crypto = require("crypto");

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

RefreshTokenSchema.statics.createToken = async function (user) {
  const expiredAt = new Date();
  const _token = crypto.randomUUID();

  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

  const _object = new this({
    token: _token,
    user: user,
    expiryDate: expiredAt.getTime(),
  });

  const refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;
