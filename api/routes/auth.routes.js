const { auth } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);

    next();
  });

  app.post("/api/auth/signup", auth.checkDuplicate, controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/refresh", controller.refreshToken);
  app.post("/api/auth/verify", auth.verifyToken, controller.accessToken);
};
