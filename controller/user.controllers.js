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
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      user.name = req.body.name;
      user.userName = req.body.userName;
      user.password = secPassword;
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
  if(user){
    eID= user.eID;
    userName= user.userName;
  }
  const userSignInLog = new SignInLog({
    eID: eID,
    userName: userName,
    errorCode: error,
    // continuityField: user,
    remarks: (error)?"Unsuccessful Login": "Successful Login",

    loggingIP: clientIP,
  });

  userSignInLog
    .save()
    .then(() => console.log(`User ${user.userName} signIn has been logged.`))
    .catch((err) => console.log(`Error: ${err}`));
};

const login = async (req, res, next) => {
  let { userName, password } = req.body;
  let clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  let existingUser, token;
  try {
    existingUser = await User.findOne({ userName: userName });
  } catch {
    const error = new Error(
      `Error! Something went wrong while retrieving user ${userName}'s details.`
    );

    logUserSignIn(existingUser, error, clientIP);  
    return next(error);
  }
  if(existingUser)
  {
    const passwordTest = await bcrypt.compare(password, existingUser.password);
    if (!passwordTest) {
      const error = Error("Incorrect User Name or Password.");
      logUserSignIn(existingUser, `Incorrect password i.e. '${password}' used for login.`, clientIP);
      return next(error);
    }

    try {
      //Creating jwt token
      token = jwt.sign(
        { eID: existingUser.eID, userName: existingUser.userName },
        "secretkeyappearshere",
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      const error = new Error(
        "Error! Something went wrong while creating token."
      );
      logUserSignIn(existingUser, error, clientIP);  
      return next(error);
    }
  
    logUserSignIn(existingUser, null, clientIP);
    res.status(200).json({
      success: true,
      data: {
        eID: existingUser.eID,
        userName: existingUser.userName,
        token: token,
      },
    });
  }
  else{
    const error = Error("Incorrect User Name or Password.");
    logUserSignIn(existingUser, `User '${userName}' doesn't exist.`, clientIP);
    return next(error);
  }
};

const decodeToken = (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'

  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided." });
  }

  //Decoding the token
  const decodedToken = jwt.verify(token, "secretkeyappearshere");
  res.status(200).json({
    success: true,
    data: {
      eID: decodedToken.eID,
      userName: decodedToken.userName,
    },
  });
};

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserByEID = findUserByEID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.decodeToken = decodeToken;
