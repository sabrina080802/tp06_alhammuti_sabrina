const { checkJwt } = require("./jwtMiddleware");

module.exports = (app) => {
  const catalogue = require("../controllers/catalogue.controllers");

  let router = require("express").Router();

  router.get("/", catalogue.get);

  app.use("/api/catalogue", router);
};
