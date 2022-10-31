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
      return res.status(403).send({ error: "No token provided!" });
    }

    jwt.verify(token, "secretkeyappearshere", (err, decoded) => {
      if (err) {
        logUserAccess(null, "Invalid Token", clientIP, req.originalUrl, false);
        return res.status(401).send({ error: "Invalid Token!" });
      }
      req.eID = decoded.eID;
      req.validToken = true;
      next();
    });
  } else {
    return res
      .status(400)
      .send({ error: "Authorization Token is required for this request!" });
  }
};

const isAdmin = (req, res, next) => {
  User.findOne({ eID: req.eID }).exec((err, user) => {
    let clientIP =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    if (err) {
      res.status(500).send({ error: err });
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

    // console.log(user.privilege);

    if (user.privilege !== "Admin") {
      res.status(403).send({ error: "Admin privilege is required!" });
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

// const accessGrant = (res, req, next) => {
//   // let af = JSON.parse(req);
//   console.log(req);
//   let user = {
//     eID: req.eID,
//     userName: req.userName,
//     privilege: req.privilege
//   }
//   console.log(user);
//   logUserAccess(
//     user,
//     null,
//     req.clientIP,
//     req.originalUrl,
//     req.validToken,
//     req.validPrivilege
//   );
//   next();
//   return;
// };

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
  // accessGrant,
  authResponse,
};

module.exports = authJwt;
