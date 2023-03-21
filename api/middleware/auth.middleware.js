const jwt = require("jsonwebtoken"),
  db = require("../models"),
  User = db.User,
  { SECRET_KEY } = process.env;

exports.checkDuplicate = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: "User already exists." });
      }

      User.findOne({ email: req.body.email })
        .then((user) => {
          if (user) {
            return res.status(400).send({ message: "User already exists." });
          }

          next();
        })
        .catch((err) => {
          return res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
};

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).send({ message: "No token provided." });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: err });

    req.user = decoded;
    next();
  });
};

exports.isTyler2 = (req, res, next) => {
  if (req.user.username !== "tyler2")
    return res.status(401).send({ message: "Unauthorized user." });

  next();
};
