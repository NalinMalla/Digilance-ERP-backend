const jwt = require("jsonwebtoken");

let User = require("../models/user.model");

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
    if (err) {
      res.status(500).send({ error: err });
      return;
    }

    console.log(user.privilege);

    if (user.privilege !== "Admin") {
      res.status(403).send({ error: "Require Admin Role!" });
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
