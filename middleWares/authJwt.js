const jwt = require("jsonwebtoken");

let User = require("../models/user.model");
let AccessLog = require("../models/userAccessLog.model");

const logUserAccess = (user, error, clientIP) => {
  let eID = null;
  let userName = null;
  if (user) {
    eID = user.eID;
    userName = user.userName;
  }
  const userAccessLog = new AccessLog({
    eID: eID,
    userName: userName,
    error: error,
    remarks: error ? "Unsuccessful Login" : "Successful Login",
    loggingIP: clientIP,
  });

  userAccessLog
    .save()
    .then(() => console.log(`User ${user.userName}'s activity has been logged.`))
    .catch((err) => console.log(`Error: ${err}`));
};

const verifyToken = (req, res, next) => {
  // let token = req.headers["x-access-token"];
  const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'

  if (!token) {
    return res.status(403).send({ error: "No token provided!" });
  }

  jwt.verify(token, "secretkeyappearshere", (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "Unauthorized!" });
    }
    console.log("decoded");
    console.log(decoded);
    req.eID = decoded.eID;

    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    let clientIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    if (err) {
      res.status(500).send({ error: err });
      logUserAccess(user, err, clientIP);
      return;
    }

    console.log(user.privilege);

    if (user.privilege !== "Admin") {
      res.status(403).send({ error: "Admin Privilege is required!" });
      logUserAccess(user, "Admin Privilege is required!", clientIP);
      return;
    }
    next();
    return;
  });
};

const authResponse = (req, res) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }

    if (!user) {
      return res.status(400).send({ error: "User doesn't exist!" });
    }
    return res.status(200).send({ success: true });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  authResponse,
};

module.exports = authJwt;
