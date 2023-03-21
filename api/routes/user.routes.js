const { auth } = require("../middleware"),
  controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.post(
    "/api/test/user",
    [auth.verifyToken, auth.isTyler2],
    controller.userBoard
  );
};
