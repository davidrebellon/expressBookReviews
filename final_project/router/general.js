const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists" });
    }
    users[username] = { password: password };
    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    return res.status(200).json(JSON.stringify(books, null, 2));
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  try {
    const isbn = req.params?.isbn;
    if (!isbn) {
      // no ISBN provided
      return res.status(400).json({ message: "ISBN parameter is required" });
    } else if (books[isbn]) {
      // ISBN found among books
      return res.status(200).json(JSON.stringify(books[isbn], null, 2));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const author = req.params?.author;
    console.log("Author requested:", author);
    if (!author) {
      // no author provided
      return res.status(400).json({ message: "Author parameter is required" });
    } else {
      // search for books by the given author
      const results = [];
      for (const [isbn, book] of Object.entries(books)) {
        console.log(book.author, author);
        if (book.author.toLowerCase() === author.toLowerCase()) {
          results.push({ isbn, ...book });
        }
      }
      console.log(results);
      if (results.length > 0) {
        return res.status(200).json(JSON.stringify(results, null, 2));
      } else {
        return res.status(404).json({ message: "No books found by the specified author" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
