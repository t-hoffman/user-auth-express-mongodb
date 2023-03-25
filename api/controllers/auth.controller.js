const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const db = require("../models");
const { User: User, refreshToken: RefreshToken } = db;

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
      };
      const token = jwt.sign(userInfo, SECRET_KEY, {
        expiresIn: config.jwtExpiration,
      });
      const refreshToken = await RefreshToken.createToken(user);

      // Create cookie holding a refreshToken
      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: !req.headers["user-agent"].includes("Postman"),
          sameSite: "None",
          maxAge: 60 * 60 * 24,
        })
        .send({ ...userInfo, accessToken: token });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: err });
    });
};

exports.signout = async (req, res) => {
  const { refreshToken: requestToken } = req.cookies;

  const removedToken = await RefreshToken.findOne({ token: requestToken }).then(
    async (token) => {
      if (token) {
        return await RefreshToken.findByIdAndDelete({ _id: token._id });
      }
    }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: !req.headers["user-agent"].includes("Postman"),
    sameSite: "None",
  });

  res.status(200).send({ message: "User signed out." });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.cookies;

  if (!requestToken)
    return res
      .status(403)
      .send({ message: "Refresh token not found or expired." });

  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken)
      return res
        .status(403)
        .send({ message: "Refresh token not found or expired." });

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndDelete({ _id: refreshToken._id });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: !req.headers["user-agent"].includes("Postman"),
        sameSite: "None",
      });

      return res.status(403).send({
        message: "Refresh token expired.  Please make a new signin request.",
      });
    }

    const user = await User.findById({ _id: refreshToken.user });
    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    const newAccessToken = jwt.sign(userInfo, SECRET_KEY, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).send({ ...userInfo, accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err });
  }
};

exports.accessToken = (req, res) => {
  res.status(200).send({ ...req.user, accessToken: req.accessToken });
};
