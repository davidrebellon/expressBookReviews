const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const SESSION_SECRET = "aVerySecretKeyThatWouldBeStoredInGitHubSecrets";
const JWT_SECRET = "anotherVerySecretKeyThatWouldBeStoredInGitHubSecrets";

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if (req?.session?.authorization['accessToken']) {
    jwt.verify(req.session.authorization['accessToken'], JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
