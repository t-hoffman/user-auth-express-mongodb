exports.allAccess = (req, res) => {
  res.status(200).send({ message: "Public Content", headers: req.headers });
};

exports.userBoard = (req, res) => {
  res.status(200).send(req.user);
};
