const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log("MONGODB connected 🙌 🙌 🙌");
});

mongoose.connection.on("error", (err) => {
  console.log("MONGODB ERROR:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MONGODB disconnected ⚡️ 🔌 ⚡️");
});
