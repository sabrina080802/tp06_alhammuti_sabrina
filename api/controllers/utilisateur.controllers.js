const { v4: uuidv4 } = require("uuid");
const { ACCESS_TOKEN_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../services/users.service");

const errors = {
  NO_ACCOUNT: "Ces données ne correspondent à aucun compte",
  PASSWORD_HASH: "Erreur lors du hashage du mot de passe",
  PASSWORD_SMALL: "Le mot de passe est trop court",
  EMAIL_WRONG: "L'adresse email est invalide",
  EMAIL_ALREADY_TAKEN: "Cet email est déjà pris",
};

function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "365d" });
}

// Find a single Utilisateur with an login
exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = Users.getUserByEmail(email);
  if (!user) {
    return res.status(404).send({ success: false, error: errors.NO_ACCOUNT });
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err)
      return res.status(404).send({
        success: false,
        message: errors.PASSWORD_HASH,
      });

    if (!isMatch) {
      return res.status(404).send({
        success: false,
        error: errors.NO_ACCOUNT,
      });
    }

    const userData = {
      id: user.id,
      name: user.firstname,
      email: user.email,
    };
    const accessToken = generateAccessToken(userData);
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.send({ success: true, user, token: accessToken });
  });
};

exports.register = (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    address,
    postal_code,
    city,
    country,
    phone,
    gender,
  } = req.body;

  const emailPattern = /[a-z0-9.-_]+@[a-z0-9-_.]+.[a-z0-9]+/;
  if (password.length < 6) {
    return res
      .status(400)
      .send({ success: false, error: error.PASSWORD_SMALL });
  } else if (!emailPattern.test(email)) {
    return res.status(400).send({ success: false, error: error.EMAIL_WRONG });
  }

  const user = Users.getUserByEmail(email);
  if (user) {
    return res
      .status(400)
      .send({ success: false, error: error.EMAIL_ALREADY_TAKEN });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err)
      return res.status(500).send({
        success: false,
        error: errors.PASSWORD_HASH,
      });

    const newUser = {
      id: uuidv4(),
      firstname,
      lastname,
      email,
      password: hashedPassword,
      gender,
      postal_code,
      address,
      city,
      phone,
      country,
    };

    Users.addUser(newUser);
    Users.save();
    res.status(200).send({ success: true });
  });
};

exports.updateProfil = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const decoded = jwt.decode(token);
  const user = Users.getUser(decoded.id);
  if (!user) {
    req.status(404);
    return;
  }

  for (const key in req.body) {
    if (key == "password") {
      if (user[key] != "") {
        user[key] = bcrypt.hashSync(user[key]);
      }
    } else if (key != "id") {
      user[key] = req.body[key];
    }
  }
  Users.save();
  res.send({ success: true });
};

exports.disconnect = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const decoded = jwt.decode(token);
  const user = Users.getUser(decoded.id);
  if (user) {
    user.logoutAt = Date.now();
    Users.save();
    res.send({ success: true });
  } else res.send({ success: false });
};
