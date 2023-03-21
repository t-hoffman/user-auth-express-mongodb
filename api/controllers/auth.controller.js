const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  db = require("../models"),
  User = db.User,
  { SECRET_KEY } = process.env;

exports.signup = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  newUser
    .save()
    .then((user) => {
      user.password = undefined;
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err }));
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) return res.status(404).send({ message: "User not found." });

      const passwordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid login credentials.",
        });
      }

      const userInfo = {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token = jwt.sign(userInfo, SECRET_KEY, {
          expiresIn: 86400,
        });

      res.status(200).send({ ...userInfo, accessToken: token });
    })
    .catch((err) => res.status(500).send({ message: err }));
};
