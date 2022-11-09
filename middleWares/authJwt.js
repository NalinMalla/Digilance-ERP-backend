const jwt = require("jsonwebtoken");

let User = require("../models/user.model");
let AccessLog = require("../models/userAccessLog.model");

const logUserAccess = (
  user,
  error,
  clientIP,
  accessedModule,
  validToken,
  validPrivilege,
  validRole
) => {
  let eID = null;
  let userName = null;
  let privilege = null;
  if (user) {
    eID = user.eID;
    userName = user.userName;
    privilege = user.privilege;
  }
  const userAccessLog = new AccessLog({
    eID: eID,
    userName: userName,
    privilege: privilege,
    accessedModule: accessedModule,
    error: error,
    remarks: error
      ? `Access to module:${accessedModule} not provided`
      : `Access to module:${accessedModule} provided`,
    loggingIP: clientIP,
    validToken: validToken,
    validPrivilege: validPrivilege,
    validRole: validRole,
  });

  userAccessLog
    .save()
    .then(() =>
      console.log(`User ${user.userName}'s activity has been logged.`)
    )
    .catch((err) => console.log(`Error: ${err}`));
};

const verifyToken = (req, res, next) => {
  // let token = req.headers["x-access-token"];
  let clientIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'

    if (!token) {
      logUserAccess(
        null,
        "Token field empty",
        clientIP,
        req.originalUrl,
        false
      );
      return res
        .status(403)
        .send({ errors: true, message: "No token provided!" });
    }

    jwt.verify(token, "secretkeyappearshere", (err, decoded) => {
      if (err) {
        logUserAccess(null, "Invalid Token", clientIP, req.originalUrl, false);
        return res
          .status(401)
          .send({ errors: true, message: "Invalid Token!" });
      }
      req.eID = decoded.eID;
      req.validToken = true;
      next();
    });
  } else {
    return res
      .status(400)
      .send({
        errors: true,
        message: "Authorization Token is required for this request!",
      });
  }
};

const isAdmin = (req, res, next) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    let clientIP =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    if (err) {
      res.status(500).send(err);
      logUserAccess(
        user,
        err,
        clientIP,
        req.originalUrl,
        req.validToken,
        false
      );
      return;
    }

    if (user.privilege !== "Admin") {
      res.status(403).send({ errors: true, message: "Admin privilege is required!" });
      logUserAccess(
        user,
        "Admin privilege is required!",
        clientIP,
        req.originalUrl,
        req.validToken,
        false
      );
      return;
    }
    req.validPrivilege = true;
    req.eID = user.eID;
    req.userName = user.userName;
    req.privilege = user.privilege;
    req.clientIP = clientIP;
    next();
    return;
  });
};

const selfVerification = (req, res, next) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    let clientIP =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    if (err) {
      res.status(500).send(err);
      logUserAccess(
        user,
        err,
        clientIP,
        req.originalUrl,
        req.validToken,
        false
      );
      return;
    }
    
    if (req.params.eID != req.eID) {
      res.status(403).send({ errors: true, message: "Users cannot access other user's data!" });
      logUserAccess(
        user,
        "Users cannot access other user's data!",
        clientIP,
        req.originalUrl,
        req.validToken,
        false
      );
      return;
    }
    req.validPrivilege = true;
    req.eID = user.eID;
    req.userName = user.userName;
    req.privilege = user.privilege;
    req.clientIP = clientIP;
    next();
    return;
  });
};

const accessGrant = (req, res, next) => {
  let user = {
    eID: req.eID,
    userName: req.userName,
    privilege: req.privilege,
  };
  console.log(user);
  logUserAccess(
    user,
    null,
    req.clientIP,
    req.originalUrl,
    req.validToken,
    req.validPrivilege
  );
  next();
  return;
};

const authResponse = (req, res) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (!user) {
      return res.status(400).send({ errors: true, message: "User doesn't exist!" });
    }
    return res.status(200).send({ success: true, message: "Owner of this token is a valid user." });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  accessGrant,
  selfVerification,
  authResponse,
};

module.exports = authJwt;
