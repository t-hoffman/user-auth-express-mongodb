const { auth } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);

    next();
  });

  app.get("/api/test/all", controller.allAccess);
  app.get("/api/test/user", auth.verifyToken, controller.userBoard);
};
