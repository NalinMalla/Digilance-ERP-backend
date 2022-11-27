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
    branchHead: req.body.branchHead,
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
  let level, branchID, error, success;

  Branch.findOne({ branchID: req.body.parentBranchID })
    .then(
      (parentBranch) => {
        if (!parentBranch) {
          error = `Couldn't find the parent branch.`;
          return;
        }
        level = parentBranch.level + 1;
        success = `Branch Level was set after verifying with the parent branch; `;
        return parentBranch;
      },
      (err) => {
        error = err;
        return;
      }
    )
    .then(async (parentBranch) => {
      if (error) {
        return;
      }
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
        branchHead: req.body.branchHead,
        parentBranchID: req.body.parentBranchID,
      });
      await branch
        .save()
        .then(() => {
          success = `Branch ${branchID} successfully created. ${success}`;
        })
        .catch((err) => {
          error = err;
        });

      if (error) {
        return;
      } else {
        return parentBranch;
      }
    })
    .then(async (parentBranch) => {
      if (error) {
        return res.json({
          errors: true,
          message: error,
        });
      }

      parentBranch.childBranchIDs = [...parentBranch.childBranchIDs, branchID];

      await parentBranch
        .save()
        .then(async () => {
          success = `${success}Adopted by parent branch ${parentBranch.branchID} as its child; `;
          await Organization.findOne({ orgID: req.body.orgID })
            .then(async (organization) => {
              if (!organization.branchID) {
                organization.branchID = branchID;
                await organization
                  .save()
                  .then(() => {
                    success = `${success}Added branch information to the organization's records; `;
                  })
                  .catch(() => {
                    error = `Couldn't add branch information to the organization's records.`;
                  });
              }
              return;
            })
            .catch(() => {
              error = `Couldn't access the branch's organization's records.`;
            });
          return;
        })
        .catch(() => {
          error = `Couldn't add branch as child branch of ${parentBranch.branchID}.`;
        });

      if (error) {
        return res.json({
          errors: true,
          message: error,
        });
      } else {
        return res.json({
          success: true,
          message: success,
        });
      }
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

const getBranchInfo = (req, res) => {
  Branch.findOne({ branchID: req.params.branchID })
    .then((branch) => res.json(branch))
    .catch((err) => res.status(400).json(err));
};

const getAllBranchInfo = (req, res) => {
  Branch.find()
    .then((branch) => res.json(branch))
    .catch((err) => res.status(400).json(err));
};

const deleteBranch = (req, res) => {
  let error, success;
  Branch.findOne({ branchID: req.params.branchID })
    .then(async (branch) => {
      await Organization.findOne({ orgID: branch.orgID })
        .then(async (organization) => {
          if (organization.branchID === req.params.branchID) {
            organization.branchID = null;
            await organization
              .save()
              .then(async () => {
                success = `Branch information withing organization ${branch.orgID} was deleted; )`;
              })
              .catch(() => {
                error = `Couldn't delete branch information of organization ${branch.orgID}.`;
              });
          }
          await Branch.findOne({ branchID: branch.parentBranchID })
            .then(async (parentBranch) => {
              parentBranch.childBranchIDs = parentBranch.childBranchIDs.filter(
                (child) => child !== req.params.branchID
              );
              await parentBranch
                .save()
                .then(() => {
                  success = `${success} Branch was disowned by its parent; `;
                })
                .catch(() => {
                  error = `Couldn't remove the child status of branch ${req.params.branchID} in its parentBranch.`;
                });
            })
            .catch(() => {
              error = `Couldn't gain access to branch ${req.params.branchID}'s parent branch.`;
            });
          return;
        })
        .catch(() => {
          error = `Couldn't gain access to branch ${req.params.branchID}'s organization records.`;
          return;
        });
    })
    .then(async () => {
      if (error) {
        return;
      }
      await Branch.deleteOne({ branchID: req.params.branchID }).then(
        () => {
          success = `Branch ${req.params.branchID} deleted. ${success}`;
        },
        (err) => {
          error = err;
        }
      );
      return;
    })
    .then(async () => {
      if (error) {
        return res.json({ errors: true, message: error });
      }
      await Branch.deleteMany({ parentBranchID: req.params.branchID })
        .then(() => {
          success = `${success}All children of branch ${req.params.branchID} were deleted;`;
        })
        .catch(() => {
          error = `All children of branch ${req.params.branchID} could not be deleted.`;
        });

      if (error) {
        return res.json({ errors: true, message: error });
      } else {
        return res.json({ success: true, message: success });
      }
    })
    .catch((err) => res.json(err));
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
exports.getBranchInfo = getBranchInfo;
exports.getAllBranchInfo = getAllBranchInfo;
exports.deleteBranch = deleteBranch;
exports.getAllCountries = getAllCountries;
exports.getAllStates = getAllStates;
exports.getAllCities = getAllCities;
exports.getCountry = getCountry;
exports.getStatesOfCountry = getStatesOfCountry;
exports.getCitiesOfState = getCitiesOfState;
exports.getCitiesOfCountry = getCitiesOfCountry;
