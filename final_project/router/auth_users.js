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
      const accessToken = jwt.sign({ username: req.body.username }, JWT_SECRET, { expiresIn: 60 * 60 });
      req.session.authorization = { accessToken };
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password or register." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = jwt.decode(req.session.authorization['accessToken']).username;
    const review = req.body.review;

    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = jwt.decode(req.session.authorization['accessToken']).username;

    if (books[isbn]) {
      if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
      } else {
        return res.status(404).json({ message: "Review by this user not found" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
