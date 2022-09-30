const jwt = require("jsonwebtoken");

let User = require("../models/user.model");

const createUser = (req, res) => {
  const firstName = req.body.firstName;
  const middleName = req.body.middleName;
  const lastName = req.body.lastName;

  const eID = Number(req.body.eID);

  const newUser = new User({
    eID: eID,
    name: {
      firstName,
      middleName,
      lastName,
    },
    userName: req.body.userName,
    password: req.body.password,
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
    .then((user) => {
      firstName = req.body.firstName;
      middleName = req.body.middleName;
      lastName = req.body.lastName;
      user.name = { firstName, middleName, lastName };
      user.userName = req.body.userName;
      user.password = req.body.password;
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

const login = async (req, res, next) => {
  let { userName, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ userName: userName });
  } catch {
    const error = new Error(`Error! Something went wrong while retrieving user ${userName}'s details.`);
    return next(error);
  }
  if (!existingUser || existingUser.password != password) {
    const error = Error("Incorrect User Name or Password.");
    return next(error);
  }

  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { eID: existingUser.eID, userName: existingUser.userName },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong while creating token.");
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      eID: existingUser.eID,
      userName: existingUser.userName,
      token: token,
    },
  });
};

const decodeToken = (req, res)=>{  
  console.log(req);
  // const token = req.headers.authorization.split(' ')[1];  //Authorization: 'Bearer TOKEN'

  // if(!token)
  // {
  //     res.status(200).json({success:false, message: "Error! Token was not provided."});
  // }

  // //Decoding the token
  // const decodedToken = jwt.verify(token,"secretkeyappearshere");
  // res.status(200).json({
  //   success: true,
  //   data: {
  //     eID: decodedToken.eID,
  //     userName: decodedToken.userName,
  //   },
  // });
};

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserByEID = findUserByEID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.login = login;
exports.decodeToken = decodeToken;
