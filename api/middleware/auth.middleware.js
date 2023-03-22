const jwt = require("jsonwebtoken"),
  db = require("../models"),
  User = db.User,
  { TokenExpiredError } = jwt;

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
  let token = req.headers[TOKEN_HEADER.toLowerCase()];

  if (TOKEN_SPLIT) token = token.split(TOKEN_SPLIT)[1];

  if (!token) return res.status(403).send({ message: "Unauthorized user." });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return this.catchError(err, res);

    req.user = decoded;
    next();
  });
};

exports.catchError = (err, res) => {
  if (err instanceof TokenExpiredError)
    return res
      .status(401)
      .send({ message: "Unauthorized user.  Access token expired." });

  return res.status(401).send({ message: "Unauthorized user." });
};
