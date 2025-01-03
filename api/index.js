const express = require("express");
const cors = require("cors");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { exec } = require("child_process");
const utilisateur = require("./controllers/utilisateur.controllers");

exec("cd angular-client-form && ng serve");

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  headers: "Content-Type, Authorization",
  exposedHeaders: "Authorization",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/catalogue.routes")(app);

app.post("/api/login", utilisateur.login);
app.post("/api/register", utilisateur.register);
app.post("/api/disconnect", utilisateur.disconnect);
app.post("/api/updateProfil", utilisateur.updateProfil);

app.get(
  "*",
  createProxyMiddleware({
    target: "http://localhost:4200",
    changeOrigin: true,
  })
);

// set port, listen for requests
const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
