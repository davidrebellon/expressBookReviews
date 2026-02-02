const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "anotherVerySecretKeyThatWouldBeStoredInGitHubSecrets";

let users = {}; // change to object for faster lookups

const isValid = (username) => { //returns boolean
  if (users[username]) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  const isValidUser = isValid(username);
  if (isValidUser && users[username].password === password) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    const isAuthenticated = authenticatedUser(req.body.username, req.body.password);
    if (isAuthenticated) {
      // if username and password match, generate a JWT token and send it to the client
      const accessToken = jwt.sign({ username: req.body.username }, JWT_SECRET, { expiresIn: 60 * 60 })
      return res.status(200).json({ message: "Login successful", accessToken });
    } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
