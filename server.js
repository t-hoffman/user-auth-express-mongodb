// DB connection & env config variables
require("./api/config/config.js");

const express = require("express"),
  cors = require("cors"),
  app = express();

// CORS and parser
app.use(cors({ origin: "*" }));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to my app!" });
});

// Routes
require("./api/routes")(app);

app.listen(PORT);
