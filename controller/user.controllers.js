const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let User = require("../models/user.model");
let SignInLog = require("../models/userSignInLog.model");

const createUser = async (req, res) => {
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
  });

  newUser
    .save()
    .then(() => res.json(`User ${req.body.userName} Added.`))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

const findAllUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

const findUserByEID = (req, res) => {
  User.findOne({ eID: req.params.eID })
    .then((user) =>
      user === null
        ? res
            .status(404)
            .json(`User with eID ${req.params.eID} does not exists.`)
        : res.json(user)
    )
    .catch((err) => res.status(400).json(`Error: ${err}`));
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

      user
        .save()
        .then(() => res.json(`User ${req.params.eID} updated.`))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

const deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json(`User ${req.params.id} deleted.`))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

const logUserSignIn = (user, error, clientIP) => {
  let eID = null;
  let userName = null;
  if (user) {
    eID = user.eID;
    userName = user.userName;
    if (error !== null) {
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
            .catch((err) => console.log(`Error: ${err}`));
        })
        .catch((err) => console.log(`Error: ${err}`));
    } else {
      User.findOne({ eID: eID })
        .then((user) => {
          user.countLoginMistakes = 0;
          user.lock = false;
          user
            .save()
            .then(() => console.log(`User ${eID} countLoginMistakes reset.`))
            .catch((err) => console.log(`Error: ${err}`));
        })
        .catch((err) => console.log(`Error: ${err}`));
    }
  }
  const userSignInLog = new SignInLog({
    eID: eID,
    userName: userName,
    errorCode: error,
    // continuityField: user,
    remarks: error ? "Unsuccessful Login" : "Successful Login",

    loggingIP: clientIP,
  });

  userSignInLog
    .save()
    .then(() => console.log(`User ${user.userName} signIn has been logged.`))
    .catch((err) => console.log(`Error: ${err}`));
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
    res.status(500).send({ error: error });
    logUserSignIn(existingUser, error, clientIP);
    return;
  }
  if (existingUser) {
    const passwordTest = await bcrypt.compare(password, existingUser.password);
    if (!existingUser.lock) {
      if (!passwordTest) {
        res.status(401).send({ error: "Incorrect User Name or Password." });
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
      res.status(401).send({ error: error });
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
      res.status(500).send({ error: error });
      logUserSignIn(existingUser, error, clientIP);
      return;
    }

    logUserSignIn(existingUser, null, clientIP);
    res.status(200).json({
      success: true,
      data: {
        eID: existingUser.eID,
        userName: existingUser.userName,
        privilege: existingUser.privilege,
        token: token,
      },
    });
  } else {
    res.status(401).send({ error: "Incorrect User Name or Password." });
    logUserSignIn(existingUser, `User '${userName}' doesn't exist.`, clientIP);
    return;
  }
};

const resetLock = (req, res) => {
  console.log(req.params);
  User.findOne({ eID: req.params.eID })
    .then((user) => {
      user.countLoginMistakes = 0;
      user.lock = false;
      user
        .save()
        .then(() => res.json(`User ${req.params.eID} lock disabled.`))
        .catch((err) => res.json(`Error: ${err}`));
    })
    .catch((err) => console.log(`Error: ${err}`));
};

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserByEID = findUserByEID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.resetLock = resetLock;
