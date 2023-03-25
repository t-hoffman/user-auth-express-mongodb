// DB connection & config variables
require("./api/config/config");

const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// CORS & parsers
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser(SECRET_KEY));

// Home route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to my app!" });
});

// Routes
require("./api/routes")(app);

app.listen(PORT);

// CLEANUP FUNCTIONS
require("./db");
