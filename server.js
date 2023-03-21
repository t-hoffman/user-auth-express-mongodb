require("./api/config/db.connection.js");

const express = require("express"),
  cors = require("cors"),
  app = express(),
  { PORT } = process.env;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Welcome to my app!" });
});

// routes
require("./api/routes/auth.routes")(app);
require("./api/routes/user.routes")(app);

app.listen(PORT);
