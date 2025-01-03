exports.get = (req, res) => {
  const data = require("../../assets/mock/bouchon.json");

  res.setHeader("Content-Type", "application/json");

  res.send(data);
};
