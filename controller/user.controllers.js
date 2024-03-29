const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

let User = require("../models/user.model");
let SignInLog = require("../models/userSignInLog.model");
let AccessLog = require("../models/userAccessLog.model");
let PasswordComplexity = require("../models/passwordComplexity.model");
const { request, response } = require("express");
// let userLock = require("../middleWares/userLock");

//Basic User CRUD functions
const createUser = async (req, res) => {
  console.log("req.body");
  console.log(req.body);
  const eID = Number(req.body.eID);
  const salt = await bcrypt.genSalt(10);
  const secPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    eID: eID,
    name: req.body.name,
    userName: req.body.userName,
    password: secPassword,
    passwordHistory: [secPassword],
    privilege: req.body.privilege,
    modules: req.body.modules,
    level: req.body.level,
    branchID: req.body.branchID,
  });

  await newUser
    .save()
    .then(() =>
      res.json({
        success: true,
        message: `New user ${req.body.userName} created.`,
      })
    )
    .catch((err) => res.json(err));
};

const createUsersByCSV = async (req, res) => {
  // if(req.body.length > 1){

  // }
  let error;
  let userInputs = req.body;
  console.log(userInputs);
  for (let i = 0; i < userInputs.length; i++) {
    if(error){
      return res.json(error);
    }
    if (userInputs[i].userName) {
      console.log("userInputs[i]");
      console.log(userInputs[i]);
      let request = {
        body: userInputs[i],
      };
      let response = {
        json: (msg) => {
          console.log(msg);
        },
      };
      await createUser(request, response)
        .then()
        .catch((err) => {
          error = err;
        });
    }
  }
  if(error){
    return res.status(400).json(error);
  }
  else{
    return res.json({success: true, message: "All users in the CSV file have been registered."})
  }
};

const findAllUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(err));
};

const findUserByEID = (req, res) => {
  User.findOne({ eID: req.params.eID })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({
            errors: true,
            message: `User with eID ${req.params.eID} does not exist.`,
          })
    )
    .catch((err) => res.status(400).json(err));
};

const findUserByID = (req, res) => {
  User.findOne({ _id: req.params._id }) //Normally id works but id is being used by authJwt middleware
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({
            errors: true,
            message: `User with id ${req.params.id} does not exist.`,
          })
    )
    .catch((err) => res.status(400).json(err));
};

const findUserByUName = (req, res) => {
  User.findOne({ userName: req.params.userName })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({
            errors: true,
            message: `User with user name ${req.params.userName} does not exist.`,
          })
    )
    .catch((err) => res.status(400).json(err));
};

const findUsersByName = (req, res) => {
  User.find({ name: req.params.name })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({
            errors: true,
            message: `User with user name ${req.params.userName} does not exist.`,
          })
    )
    .catch((err) => res.status(400).json(err));
};

const findUsersByBranchID = (req, res) => {
  User.find({ branchID: req.params.branchID })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(404).json({
            errors: true,
            message: `Branch ${req.params.branchID} currently doesn't have any employees.`,
          })
    )
    .catch((err) => res.status(400).json(err));
};

const updateUser = (req, res) => {
  User.findOne({ eID: req.params.eID })
    .then(async (user) => {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        user.password = secPassword;
        if (user.passwordHistory.length === 5) {
          user.passwordHistory.shift();
          user.passwordHistory = [...user.passwordHistory, secPassword];
        } else {
          user.passwordHistory = [...user.passwordHistory, secPassword];
        }
      }

      user.name = req.body.name;
      user.userName = req.body.userName;
      user.eID = Number(req.body.eID);
      user.privilege = req.body.privilege;
      user.modules = req.body.modules;
      user.level = req.body.level;
      user.branchID = req.body.branchID;

      user
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `User ${req.params.eID} updated.`,
          })
        )
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => res.status(400).json(err));
};

const deleteUser = (req, res) => {
  User.deleteOne({ eID: req.params.eID })
    .then(() =>
      res.json({
        success: true,
        message: `User with eID:${req.params.eID} deleted.`,
      })
    )
    .catch((err) => res.status(400).json(err));
};

//User login modules
const logUserSignIn = (user, error, clientIP) => {
  let eID = null;
  let userName = null;
  let privilege = null;
  let continuity = null;
  if (user) {
    eID = user.eID;
    userName = user.userName;
    privilege = user.privilege;
    continuity = user.continuity;
    if (error) {
      User.findOne({ eID: eID })
        .then((user) => {
          user.countLoginMistakes += 1;
          if (user.countLoginMistakes >= 3) {
            user.lock = true;
          }
          user
            .save()
            .then(() =>
              console.log(`User ${eID} countLoginMistakes incremented.`)
            )
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      continuity = null;
      User.findOne({ eID: eID })
        .then((user) => {
          user.continuity = null;
          user.countLoginMistakes = 0;
          user.lock = false;
          user
            .save()
            .then(() => console.log(`User ${eID} countLoginMistakes reset.`))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }
  console.log("continuity:" + continuity);
  const userSignInLog = new SignInLog({
    eID: eID,
    userName: userName,
    privilege: privilege,
    errorCode: error,
    remarks: error ? "Unsuccessful Login" : "Successful Login",
    loggingIP: clientIP,
    continuity: continuity,
  });

  userSignInLog
    .save()
    .then(() => console.log(`User ${user.userName} signIn has been logged.`))
    .catch((err) => console.log(err));
};

const login = async (req, res, next) => {
  let { userName, password } = req.body;
  let clientIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  let existingUser, token;
  try {
    existingUser = await User.findOne({ userName: userName });
  } catch {
    const error = `Error! Something went wrong while retrieving user ${userName}'s details.`;
    res.status(500).send({ errors: true, message: error });
    logUserSignIn(existingUser, error, clientIP);
    return;
  }
  if (existingUser) {
    const passwordTest = await bcrypt.compare(password, existingUser.password);
    if (!userLockCheck(existingUser)) {
      if (!passwordTest) {
        res
          .status(401)
          .send({ errors: true, message: "Incorrect User Name or Password." });
        logUserSignIn(
          existingUser,
          `Incorrect password i.e. '${password}' used for login.`,
          clientIP
        );
        return;
      }
    } else {
      const error =
        "User Account has been locked. Please contact your IT Admin to unlock your account.";
      res.status(401).send({ errors: true, message: error });
      logUserSignIn(existingUser, error, clientIP);
      return;
    }

    try {
      //Creating jwt token
      token = jwt.sign(
        { eID: existingUser.eID, userName: existingUser.userName },
        "secretkeyappearshere",
        { expiresIn: 86400 }
      );
    } catch (err) {
      const error = "Error! Something went wrong while creating token.";
      res.status(500).send({ errors: true, message: error });
      logUserSignIn(existingUser, error, clientIP);
      return;
    }

    logUserSignIn(existingUser, null, clientIP);
    res.status(200).json({
      success: true,
      message: {
        eID: existingUser.eID,
        userName: existingUser.userName,
        privilege: existingUser.privilege,
        modules: existingUser.modules,
        token: token,
      },
    });
  } else {
    res
      .status(401)
      .send({ errors: true, message: "Incorrect User Name or Password." });
    logUserSignIn(existingUser, `User '${userName}' doesn't exist.`, clientIP);
    return;
  }
};

const userLockCheck = (user) => {
  if (user.lock) {
    if (user.lockPeriod.end) {
      //Converting date to timestamp for comparison
      let lockEndTimestamp = Date.parse(user.lockPeriod.end);
      //Comparing lockPeriod timestamp to current timestamp
      if (lockEndTimestamp <= Date.now()) {
        //Creating user defined req & res for compatibility with unlockUserByID(req, res)
        let req = { params: { eID: user.eID } };
        let res = {
          json: (msg) => {
            console.log(msg);
          },
        };
        unlockUserByID(req, res);
        return false;
      }
    }
    return true;
  } else {
    if (user.lockPeriod.start) {
      let lockStartTimestamp = Date.parse(user.lockPeriod.start);
      if (lockStartTimestamp <= Date.now()) {
        //Creating user defined req & res for compatibility with unlockUserByID(req, res)
        let req = {
          params: { eID: user.eID },
          body: {
            lockStartPeriod: user.lockPeriod.start,
            lockEndPeriod: user.lockPeriod.end,
          },
        };
        let res = {
          json: (msg) => {
            console.log(msg);
          },
        };
        lockUserByID(req, res);
        return true;
      }
    }
    return false;
  }
};

const unlockUserByID = (req, res) => {
  User.findOne({ eID: req.params.eID })
    .then((user) => {
      user.countLoginMistakes = 0;
      user.lock = false;
      user.lockPeriod = null;
      user.continuity = null;
      user
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `User ${req.params.eID} account has been unlocked.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const lockUserByID = (req, res) => {
  User.findOne({ eID: req.params.eID })
    .then((user) => {
      if (req.body.lockEndPeriod) {
        user.lockPeriod.end = new Date(req.body.lockEndPeriod);
        if (req.body.lockStartPeriod) {
          user.lockPeriod.start = new Date(req.body.lockStartPeriod);
          let lockStartTimestamp = Date.parse(user.lockPeriod.start);

          if (lockStartTimestamp <= Date.now()) {
            user.lock = true;
          } else {
            user.lock = false;
          }
        } else {
          user.lockPeriod.start = new Date();
          user.lock = true;
        }
        if (req.body.continuity) {
          user.continuity = req.body.continuity;
        }
      } else {
        user.lock = true;
        if (req.body.continuity) {
          user.continuity = req.body.continuity;
        }
      }

      user
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Lock has been set for User ${req.params.eID}.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err));
};

//User Logs modules
const findAllSignInLog = (req, res) => {
  SignInLog.find()
    .then((log) => res.json(log))
    .catch((err) => res.status(400).json(err));
};

const findAllAccessLog = (req, res) => {
  AccessLog.find()
    .then((log) => res.json(log))
    .catch((err) => res.status(400).json(err));
};

//User password complexity controls
const updatePasswordComplexity = (req, res) => {
  PasswordComplexity.findOne()
    .then((passwordComplexity) => {
      if (passwordComplexity) {
        passwordComplexity.complexity = req.body.complexity;
      } else {
        passwordComplexity = new PasswordComplexity({
          complexity: req.body.complexity,
        });
      }
      passwordComplexity
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `PasswordComplexity has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const retrievePasswordComplexity = (req, res) => {
  PasswordComplexity.findOne()
    .then((complexity) => res.json(complexity))
    .catch((err) => res.status(400).json(err));
};

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserByEID = findUserByEID;
exports.findUserByID = findUserByID;
exports.findUserByUName = findUserByUName;
exports.findUsersByName = findUsersByName;
exports.findUsersByBranchID = findUsersByBranchID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.unlockUserByID = unlockUserByID;
exports.lockUserByID = lockUserByID;
exports.findAllSignInLog = findAllSignInLog;
exports.findAllAccessLog = findAllAccessLog;
exports.updatePasswordComplexity = updatePasswordComplexity;
exports.retrievePasswordComplexity = retrievePasswordComplexity;
exports.createUsersByCSV = createUsersByCSV;
