// let Country = require("country-state-city").Country;
// const State = require("country-state-city").State;
// const city = require("country-state-city").districtCode;

let Branch = require("../models/branch.model");
let BranchSettings = require("../models/branchSettings.model");
let BranchLocations = require("../models/branchLocations.model");
let Organization = require("../models/organization.model");

const generateBranchID = async (
  level,
  countryCode,
  stateCode,
  districtCode,
  vdcCode = null,
  uniqueKey = null
) => {
  let branchID = "";
  let parameter = {
    level: level,
    countryCode: countryCode,
    stateCode: stateCode,
    districtCode: districtCode,
    vdcCode: vdcCode,
    uniqueKey: uniqueKey,
  };

  await BranchSettings.findOne()
    .then((branchSettings) => {
      let count = 4;

      if (vdcCode && uniqueKey) {
        count = 6;
      } else if (vdcCode) {
        count = 5;
      } else if (uniqueKey) {
        count = 5;
      }
      console.log("count : " + count);
      for (let i = 0; i < count; i++) {
        // if (i === 0) {
        //   branchID = "" + parameter[branchSettings.branchIDFormat[i]];
        // } else {
        //   branchID =
        //     branchID + "-" + parameter[branchSettings.branchIDFormat[i]];
        // }
        branchID = branchID + parameter[branchSettings.branchIDFormat[i]];
      }
      console.log("branchID: " + branchID);
    })
    .catch(() => {
      branchID = level + countryCode + stateCode + districtCode;
      if (vdcCode) {
        branchID = branchID + vdcCode;
      }
      if (uniqueKey) {
        branchID = branchID + uniqueKey;
      }
    });
  console.log("returning branchID");
  return branchID;
};

const createRootBranch = async (req, res) => {
  let branchID = await generateBranchID(
    "00",
    req.body.countryCode,
    req.body.stateCode,
    req.body.districtCode,
    req.body.vdcCode
  );
  console.log(branchID);
  let branch = new Branch({
    branchID: branchID,
    orgID: req.body.orgID,
    countryCode: req.body.countryCode,
    stateCode: req.body.stateCode,
    districtCode: req.body.districtCode,
    vdcCode: req.body.vdcCode,
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

        level = Number(parentBranch.level) + 1;
        if (level < 10) {
          level = "0" + level;
        }

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

      console.log("level");
      console.log(level);
      branchID = await generateBranchID(
        level,
        req.body.countryCode,
        req.body.stateCode,
        req.body.districtCode,
        req.body.vdcCode,
        req.body.uniqueKey
      );

      let branch = new Branch({
        branchID: branchID,
        orgID: req.body.orgID,
        countryCode: req.body.countryCode,
        stateCode: req.body.stateCode,
        districtCode: req.body.districtCode,
        vdcCode: req.body.vdcCode,
        uniqueKey: req.body.uniqueKey,
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

const updateBasicBranchInfo = (req, res) => {
  Branch.findOne({ branchID: req.params.branchID })
    .then((branch) => {
      branch.address = req.body.address;
      branch.email = req.body.email;
      branch.contactNo = req.body.contactNo;
      branch.faxNo = req.body.faxNo;
      branch.poBoxNo = req.body.poBoxNo;
      branch.departments = req.body.departments;
      branch.branchHead = req.body.branchHead;
      if (req.body.orgID) {
        branch.orgID = req.body.orgID;
      }

      branch
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Basic Branch information has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const updateBranchStructure = (req, res) => {
  let level, error, success, parentBranchID, newParentBranch;
  Branch.findOne({ branchID: req.params.branchID })
    .then(async (branch) => {
      console.log("Found branch to be updated.");
      console.log(branch);
      if (!branch) {
        error = `Couldn't find branch ${req.params.branchID}.`;
        return;
      }
      if (
        req.body.newParentBranchID &&
        req.body.newParentBranchID !== branch.parentBranchID
      ) {
        console.log("In new Parent Branch");
        await Branch.findOne({ branchID: req.body.newParentBranchID }).then(
          (parentBranch) => {
            if (!parentBranch) {
              error = `Couldn't find the branch selected for parent.`;
              return;
            }

            branch.level = parentBranch.level + 1;
            success = `Branch Level was set after verifying with the new parent branch; `;
            newParentBranch = parentBranch;
            console.log(newParentBranch);
            return;
          },
          (err) => {
            error = err;
            return;
          }
        );
      }
      return branch;
    })
    .then(async (branch) => {
      let countryCode, stateCode, districtCode, vdcCode, uniqueKey;
      console.log("Update branch and new parent branch.");
      if (error) {
        return;
      }
      // console.log("Before update Branch data pass error test");
      console.log(branch);
      parentBranchID = branch.parentBranchID;
      // console.log("2.Before update Branch data pass error test");

      if (newParentBranch) {
        branch.parentBranchID = newParentBranch.branchID;
        // branch.level = level;
      }

      if (req.body.countryCode && req.body.stateCode && req.body.districtCode) {
        branch.countryCode = req.body.countryCode;
        branch.stateCode = req.body.stateCode;
        branch.districtCode = req.body.districtCode;
        countryCode = req.body.countryCode;
        stateCode = req.body.stateCode;
        districtCode = req.body.districtCode;
      } else {
        countryCode = branch.countryCode;
        stateCode = branch.stateCode;
        districtCode = branch.districtCode;
      }

      //Assign new vdcCode
      if (req.body.vdcCode) {
        branch.vdcCode = req.body.vdcCode;
        vdcCode = req.body.vdcCode;
      } else {
        vdcCode = branch.vdcCode;
      }

      //Assign new uniqueKey
      if (req.body.uniqueKey) {
        branch.uniqueKey = req.body.uniqueKey;
        uniqueKey = req.body.uniqueKey;
      } else {
        uniqueKey = branch.uniqueKey;
      }

      branch.branchID = await generateBranchID(
        branch.level,
        countryCode,
        stateCode,
        districtCode,
        vdcCode,
        uniqueKey
      );
      // console.log("Changing branch ID");
      // console.log(branch.branchID);

      console.log("Update Branch data");
      await branch
        .save()
        .then(() => {
          success = `Branch ${branch.branchID} was updated. ${success}`;
        })
        .catch((err) => {
          error = err;
        });

      if (error) {
        return;
      }

      console.log("Update Parent Branch data");
      if (newParentBranch) {
        newParentBranch.childBranchIDs = [
          ...newParentBranch.childBranchIDs,
          branch.branchID,
        ];

        await newParentBranch
          .save()
          .then(() => {
            success = `${success}Adopted by parent branch ${newParentBranch.branchID} as its child; `;
          })
          .catch(() => {
            error = `Couldn't add branch as child branch of ${newParentBranch.branchID}.`;
          });
      }
      return branch;
    })
    .then(async (branch) => {
      console.log("Update old parent branch.");
      if (error) {
        return res.json({
          errors: true,
          message: error,
        });
      }
      await Branch.findOne({ branchID: parentBranchID })
        .then(async (oldParentBranch) => {
          oldParentBranch.childBranchIDs =
            oldParentBranch.childBranchIDs.filter(
              (child) => child !== req.params.branchID
            );

          if (parentBranchID === branch.parentBranchID) {
            //Incase of only branchID changed and not the parent branch
            oldParentBranch.childBranchIDs = [
              ...oldParentBranch.childBranchIDs,
              branch.branchID,
            ];
          }

          await oldParentBranch
            .save()
            .then(() => {
              success = `${success} Branch's old parent's records were changed; `;
            })
            .catch(() => {
              error = `Couldn't change old parent branch records.`;
            });
        })
        .catch(() => {
          error = `Couldn't gain access to branch ${req.params.branchID}'s old parent branch.`;
        });

      return branch;
    })
    .then(async (branch) => {
      console.log("Update child branches.");
      if (error) {
        return res.json({ errors: true, message: error });
      }

      await Branch.find({ parentBranchID: req.params.branchID })
        .then(async (childBranch) => {
          for (let i = 0; i < childBranch.length; i++) {
            childBranch[i].parentBranchID = branch.branchID;
            await childBranch[i]
              .save()
              .then()
              .catch(() => {
                error = `Couldn't change child branch ${childBranch[i].branchID}'s records.`;
              });
          }

          if (error) {
            return;
          }
          success = `${success}All entries in child branches have been updated;`;
        })
        .catch(() => {
          error = `All entries in child branches could not be updated.`;
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

const recursiveDelete = async (branchID) => {
  await Branch.findOne({ parentBranchID: branchID }).then(async (child) => {
    console.log(`Visited child ${child.branchID}`);
    console.log(child.childBranchIDs);
    if (!child.childBranchIDs || child.childBranchIDs.length < 1) {
      // await Branch.deleteOne({ branchID: child.branchID }).then(
      //   () => {
      //     console.log(`Deleted Branch ${child.branchID}`)
      //   }
      // );
      console.log(`Deleted Branch ${child.branchID}`);
      return;
    }

    recursiveTrial(child.branchID);
  });
};

const deleteBranch = (req, res) => {
  let error, success, children;
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
    // .then(async () => {
    //   if (error) {
    //     return;
    //   }
    //   await recursiveDelete(req.params.branchID);
    // })
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

const recursiveTrial = (branchID) => {
  Branch.find({ parentBranchID: branchID }).then(async (child) => {
    if (!child.childBranchIDs) {
      return;
    }
    recursiveTrial(child.branchID);
    console.log(child);
  });
};

const createBranchLocation = (req, res) => {
  let branchLocation = new BranchLocations({
    country: req.body.country,
    countryCode: req.body.countryCode,
    state: req.body.state,
    stateCode: req.body.stateCode,
    district: req.body.district,
    districtCode: req.body.districtCode,
    vdc: req.body.vdc,
    vdc: req.body.vdcCode,
    noOfWards: req.body.noOfWards,
  });

  branchLocation
    .save()
    .then(() =>
      res.json({
        success: true,
        message: `New Branch created.`,
      })
    )
    .catch((err) => res.json(err));
};

const getLocationByCountry = (req, res) => {
  BranchLocations.find({ country: req.body.country })
    .then((Location) =>
      Location === null
        ? res.status(404).json({ error: `This location does not exist.` })
        : res.json(Location)
    )
    .catch((err) => res.status(400).json(err));
};

const getLocationByState = (req, res) => {
  BranchLocations.find({ country: req.body.country, state: req.body.state })
    .then((Location) =>
      Location === null
        ? res.status(404).json({ error: `This location does not exist.` })
        : res.json(Location)
    )
    .catch((err) => res.status(400).json(err));
};

const getLocationByDistrict = (req, res) => {
  BranchLocations.find({
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
  })
    .then((Location) =>
      Location === null
        ? res.status(404).json({ error: `This location does not exist.` })
        : res.json(Location)
    )
    .catch((err) => res.status(400).json(err));
};

const getLocationByVDC = (req, res) => {
  BranchLocations.find({
    country: req.body.country,
    state: req.body.state,
    district: req.body.district,
    vdc: req.body.vdc,
  })
    .then((Location) =>
      Location === null
        ? res.status(404).json({ error: `This location does not exist.` })
        : res.json(Location)
    )
    .catch((err) => res.status(400).json(err));
};

// const getAllCountries = (req, res) => {
//   res.json(Country.getAllCountries());
// };

// const getCountry = (req, res) => {
//   res.json(Country.getCountryByCode(req.params.countryCode));
// };

// const getAllStates = (req, res) => {
//   res.json(State.getAllStates());
// };

// const getStatesOfCountry = (req, res) => {
//   res.json(State.getStatesOfCountry(req.params.countryCode));
// };

// const getAllCities = (req, res) => {
//   res.json(districtCode.getAllCities());
// };

// const getCitiesOfState = (req, res) => {
//   console.log(req.params.stateCode);
//   console.log(
//     districtCode.getCitiesOfState(req.params.countryCode, req.params.stateCode)
//   );
//   res.json(districtCode.getCitiesOfState(req.params.countryCode, req.params.stateCode));
// };

// const getCitiesOfCountry = (req, res) => {
//   console.log(districtCode.getCitiesOfCountry(req.params.countryCode).length);

//   res.json(districtCode.getCitiesOfCountry(req.params.countryCode));
// };

const updateBranchSettings = (req, res) => {
  BranchSettings.findOne()
    .then((branchSettings) => {
      if (!req.body.branchIDFormat) {
        return res.json({
          errors: true,
          message: `A valid Branch ID format must be set for updating branch settings.`,
        });
      }
      if (branchSettings) {
        branchSettings.branchIDFormat = req.body.branchIDFormat;
      } else {
        branchSettings = new BranchSettings({
          branchIDFormat: req.body.branchIDFormat,
        });
      }
      branchSettings
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Successfully updated branch settings.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const getBranchSettings = (req, res) => {
  BranchSettings.findOne()
    .then((branchSettings) => res.json(branchSettings))
    .catch((err) => res.json(err));
};

exports.createBranch = createBranch;
exports.createRootBranch = createRootBranch;
exports.updateBasicBranchInfo = updateBasicBranchInfo;
exports.updateBranchStructure = updateBranchStructure;
exports.getBranchInfo = getBranchInfo;
exports.getAllBranchInfo = getAllBranchInfo;
exports.deleteBranch = deleteBranch;
// exports.getAllCountries = getAllCountries;
// exports.getAllStates = getAllStates;
// exports.getAllCities = getAllCities;
// exports.getCountry = getCountry;
// exports.getStatesOfCountry = getStatesOfCountry;
// exports.getCitiesOfState = getCitiesOfState;
// exports.getCitiesOfCountry = getCitiesOfCountry;
exports.updateBranchSettings = updateBranchSettings;
exports.getBranchSettings = getBranchSettings;
exports.recursiveTrial = recursiveTrial;
exports.createBranchLocation = createBranchLocation;
exports.getLocationByCountry = getLocationByCountry;
exports.getLocationByState = getLocationByState;
exports.getLocationByDistrict = getLocationByDistrict;
exports.getLocationByVDC = getLocationByVDC;
