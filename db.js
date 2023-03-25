/*
  MONGODB CLEANUP FUNCTIONS
*/

const mongoose = require("mongoose");
const { refreshToken: RefreshToken } = (db = require("./api/models"));

RefreshToken.find({}).then((tokens) => {
  let toDelete = [];
  for (token of tokens) {
    if (RefreshToken.verifyExpiration(token)) toDelete.push(token._id);
  }
  if (toDelete.length > 0) {
    RefreshToken.deleteMany({ _id: { $in: toDelete } }).then((res) =>
      console.log("CLEARED EXPIRED REFRESH TOKENS FROM MONGODB", res)
    );
  }
});
