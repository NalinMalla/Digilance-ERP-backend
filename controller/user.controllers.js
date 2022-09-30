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

exports.createUser = createUser;
exports.findAllUsers = findAllUsers;
exports.findUserByEID = findUserByEID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
