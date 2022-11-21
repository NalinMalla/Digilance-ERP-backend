let Country = require("country-state-city").Country;
const State = require("country-state-city").State;
const City = require("country-state-city").City;

let Branch = require("../models/branch.model");

const createBranch = (req, res) => {
  let branch = new Branch({
    name: req.body.name,
    countryCode: req.body.countryCode,
    stateCode: req.body.stateCode,
    cityCode: req.body.cityCode,
  });

  branch
    .save()
    .then(() =>
      res.json({
        success: true,
        message: `A new branch has been created.`,
      })
    )
    .catch((err) => res.json(err));
};

const updateBranchInfo = (req, res) => {
  Branch.findOne({ name: req.params.name })
    .then((branch) => {
      branch.name = req.body.name;
      branch.countryCode = req.body.countryCode;
      branch.stateCode = req.body.stateCode;
      branch.cityCode = req.body.cityCode;

      branch
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Branch information has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const getBranchInfoByName = (req, res) => {
  Branch.findOne({ name: req.params.name })
    .then((branch) => res.json(branch))
    .catch((err) => res.status(400).json(err));
};

const deleteBranch = (req, res) => {
  Branch.deleteOne({ name: req.params.name })
    .then(() =>
      res.json({
        success: true,
        message: `Branch ${req.params.name} deleted.`,
      })
    )
    .catch((err) => res.status(400).json(err));
};

const getAllCountries = (req, res) => {
  res.json(Country.getAllCountries());
};

const getCountry = (req, res) => {
  res.json(Country.getCountryByCode(req.params.countryCode));
};

const getAllStates = (req, res) => {
  res.json(State.getAllStates());
};

const getStatesOfCountry = (req, res) => {
  res.json(State.getStatesOfCountry(req.params.countryCode));
};

const getAllCities = (req, res) => {
  res.json(City.getAllCities());
};

const getCitiesOfState = (req, res) => {
  console.log(req.params.stateCode);
  console.log(City.getCitiesOfState(req.params.countryCode,req.params.stateCode));
  res.json(City.getCitiesOfState(req.params.countryCode,req.params.stateCode));
};

const getCitiesOfCountry = (req, res) => {
  console.log(City.getCitiesOfCountry(req.params.countryCode).length);

  res.json(City.getCitiesOfCountry(req.params.countryCode));
};

exports.createBranch = createBranch;
exports.updateBranchInfo = updateBranchInfo;
exports.getBranchInfoByName = getBranchInfoByName;
exports.deleteBranch = deleteBranch;
exports.getAllCountries = getAllCountries;
exports.getAllStates = getAllStates;
exports.getAllCities = getAllCities;
exports.getCountry = getCountry;
exports.getStatesOfCountry = getStatesOfCountry;
exports.getCitiesOfState = getCitiesOfState;
exports.getCitiesOfCountry = getCitiesOfCountry;
