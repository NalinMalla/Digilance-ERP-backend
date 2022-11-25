let Country = require("country-state-city").Country;
const State = require("country-state-city").State;
const City = require("country-state-city").City;

let Branch = require("../models/branch.model");
let Organization = require("../models/organization.model");

const createRootBranch = (req, res) => {
  let branchID;

  branchID =
    "" +
    0 +
    "-" +
    req.body.countryCode +
    "-" +
    req.body.stateCode +
    "-" +
    req.body.city;

  let branch = new Branch({
    branchID: branchID,
    orgID: req.body.orgID,
    countryCode: req.body.countryCode,
    stateCode: req.body.stateCode,
    city: req.body.city,
    level: 0,
    address: req.body.address,
    email: req.body.email,
    contactNo: req.body.contactNo,
    faxNo: req.body.faxNo,
    poBoxNo: req.body.poBoxNo,
    departments: req.body.departments,
    branchHead: req.body.branchHead
  });

  branch
    .save()
    .then(() => {
      console.log("Branch Data Saved");
      Organization.findOne({ orgID: req.body.orgID })
        .then((organization) => {
          console.log("Found Org");
          if (!organization.branchID) {
            organization.branchID = branchID;
            organization
              .save()
              .then(
                res.json({
                  success: true,
                  message: `New Branch created.`,
                })
              )
              .catch((err) => res.json(err));
          }
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const createBranch = (req, res) => {
  let level, branchID;

  Branch.findOne({ branchID: req.body.parentBranchID })
    .then((parentBranch) => {
      console.log("Found Parent Branch");
      console.log(parentBranch);
      level = parentBranch.level + 1;
      return parentBranch;
    })
    .then(async (parentBranch) => {
      console.log(typeof level);
      if (req.body.idPostfix) {
        //Incase there is more than one branch of the same level in the same city
        branchID =
          "" +
          level +
          "-" +
          req.body.countryCode +
          "-" +
          req.body.stateCode +
          "-" +
          req.body.city +
          "-" +
          req.body.idPostfix;
      } else {
        branchID =
          "" +
          level +
          "-" +
          req.body.countryCode +
          "-" +
          req.body.stateCode +
          "-" +
          req.body.city;
      }
      let branch = new Branch({
        branchID: branchID,
        orgID: req.body.orgID,
        countryCode: req.body.countryCode,
        stateCode: req.body.stateCode,
        city: req.body.city,
        level: level,
        address: req.body.address,
        email: req.body.email,
        contactNo: req.body.contactNo,
        faxNo: req.body.faxNo,
        poBoxNo: req.body.poBoxNo,
        departments: req.body.departments,
        branchHead: req.body.branchHead
      });
      console.log(branch);
      let save = await branch
        .save()
        .then(() => {
          console.log("Branch Data Saved");
          console.log(parentBranch);
          return "success";
        })
        .catch((err) => err);

      if (save === "success") {
        return parentBranch;
      }
    })
    .then(async (parentBranch) => {
      console.log("Set Parent Branch Data");
      console.log(parentBranch);
      parentBranch.childBranchIDs = [...parentBranch.childBranchIDs, branchID];

      await parentBranch
        .save()
        .then(async () => {
          await Organization.findOne({ orgID: req.body.orgID })
            .then(async (organization) => {
              console.log("Found Org");
              if (!organization.branchID) {
                organization.branchID = branchID;
                await organization
                  .save()
                  .then()
                  .catch((err) => res.json(err));
              }
              console.log("returning from org found");
              return;
            })
            .catch((err) => res.json(err));
          console.log("returning from parent branch alter");
          return;
        })
        .catch((err) => res.json(err));
      console.log("returning res");
      return res.json({
        success: true,
        message: `Branch successfully created.`,
      });
    });
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
  console.log(
    City.getCitiesOfState(req.params.countryCode, req.params.stateCode)
  );
  res.json(City.getCitiesOfState(req.params.countryCode, req.params.stateCode));
};

const getCitiesOfCountry = (req, res) => {
  console.log(City.getCitiesOfCountry(req.params.countryCode).length);

  res.json(City.getCitiesOfCountry(req.params.countryCode));
};

exports.createBranch = createBranch;
exports.createRootBranch = createRootBranch;
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
