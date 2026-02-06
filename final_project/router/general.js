const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body)
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
    new Promise((resolve, reject) => {
      resolve(books);
    }).then((books) => {
      return res.status(200).json(books);
    }).catch((err) => {
      return res.status(500).json({ message: "Internal Server Error while getting book list" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error while getting book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    new Promise((resolve, reject) => {
      const isbn = req.params?.isbn;
      if (!isbn) {
        // no ISBN provided
        reject(res.status(400).json({ message: "ISBN parameter is required" }));
      } else if (books[isbn]) {
        // ISBN found among books
        resolve(books[isbn]);
      } else {
        reject(res.status(404).json({ message: "Book not found" }));
      }
    }).then((book) => {
      return res.status(200).json(book);
    }).catch((err) => {
      return res.status(500).json({ message: "Internal Server Error while getting book by ISBN" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error while getting book by ISBN" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    new Promise((resolve, reject) => {
      const author = req.params?.author;
      console.log("Author requested:", author);
      if (!author) {
        // no author provided
        reject(res.status(400).json({ message: "Author parameter is required" }));
      } else {
        // search for books by the given author
        resolve(books);
      }
    }).then((books) => {
      const results = [];
      for (const [isbn, book] of Object.entries(books)) {
        console.log(book.author, author);
        if (book.author.toLowerCase() === author.toLowerCase()) {
          results.push({ isbn, ...book });
        }
      }
      console.log(results);
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(404).json({ message: "No books found by the specified author" });
      }
    }).catch((err) => {
      return res.status(500).json({ message: "Internal Server Error while getting books by author" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error while getting books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    new Promise((resolve, reject) => {
      const title = req.params?.title;
      console.log("Title requested:", title);
      if (!title) {
        // no title provided
        reject(res.status(400).json({ message: "Title parameter is required" }));
      } else {
        resolve(books);
      }
    }).then((books) => {
      const title = req.params?.title;
      // search for books by the given title
      const results = [];
      for (const [isbn, book] of Object.entries(books)) {
        console.log(book.title, title);
        if (book.title.toLowerCase() === title.toLowerCase()) {
          results.push({ isbn, ...book });
        }
      }
      console.log(results);
      if (results.length > 0) {
        return res.status(200).json(results);
      } else {
        return res.status(404).json({ message: "No books found by the specified author" });
      }
    }).catch((err) => {
      return res.status(500).json({ message: "Internal Server Error while getting books by title" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error while getting books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    new Promise((resolve, reject) => {
      const isbn = req.params?.isbn;
      if (!isbn) {
        // no ISBN provided
        reject(res.status(400).json({ message: "ISBN parameter is required" }));
      } else if (books[isbn]) {
        // ISBN found among books
        resolve(books[isbn].reviews);
      } else {
        reject(res.status(404).json({ message: "Book not found" }));
      }
    }).then((reviews) => {
      return res.status(200).json(reviews);
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error while getting books review" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error while getting books review" });
  }
});

module.exports.general = public_users;
