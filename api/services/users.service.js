const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");
const usersData = loadUsers();

function loadUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
}

exports.Users = {
  addUser: (userData) => {
    usersData.push(userData);
  },
  getUserByEmail: (email) => {
    return usersData.find((usr) => usr.email == email);
  },
  getUser: (id) => {
    return usersData.find((usr) => usr.id == id);
  },
  save: () => {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
  },
};
