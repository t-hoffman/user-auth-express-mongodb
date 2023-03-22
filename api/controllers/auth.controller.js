const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  config = require("../config/config"),
  db = require("../models"),
  { User: User, refreshToken: RefreshToken } = db;

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
      res.status(200).send({ message: "Successfully created new user.", user });
    })
    .catch((err) => res.status(500).send({ message: err }));
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username })
    .then(async (user) => {
      if (!user)
        return res.status(401).send({ message: "Invalid login credentials." });

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({
          message: "Invalid login credentials.",
        });
      }

      const userInfo = {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token = jwt.sign(userInfo, SECRET_KEY, {
          expiresIn: config.jwtExpiration,
        }),
        refreshToken = await RefreshToken.createToken(user);

      res
        .status(200)
        .send({ ...userInfo, accessToken: token, refreshToken: refreshToken });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send({ message: err });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken === null)
    return res.status(403).send({ message: "Refresh token is required." });

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken)
      return res.status(403).send({ message: "Refresh token not found." });

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndDelete({ _id: refreshToken._id });

      return res.status(403).send({
        message:
          "Refresh token was expired.  Please make a new signin request.",
      });
    }

    const user = await User.findById({ _id: refreshToken.user }),
      userInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
    let newAccessToken = jwt.sign(userInfo, SECRET_KEY, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};
