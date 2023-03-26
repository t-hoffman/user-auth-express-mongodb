exports.allAccess = (req, res) => {
  console.log(req.cookies);
  res.status(200).send({
    message: "Public Content",
    headers: req.headers,
    cookies: req.cookies,
  });
};

exports.userBoard = (req, res) => {
  console.log(req.cookies);
  res.status(200).send(req.user);
};
