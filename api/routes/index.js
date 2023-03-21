module.exports = (app) => {
  require("./auth.routes")(app);
  require("./user.routes")(app);
};
