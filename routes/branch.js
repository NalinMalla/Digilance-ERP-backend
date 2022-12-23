const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const branchController = require("../controller/branch.controllers");

router.route("/getBranch/:branchID").get(branchController.getBranchInfo);

router
  .route("/all")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.getAllBranchInfo
  );

router
  .route("/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createBranch
  );

  router
  .route("/addCSV")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createBranchesByCSV
  );

router
  .route("/root/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createRootBranch
  );

//Will later be changed so that high level user can access
router
  .route("/update/basic/:branchID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.updateBasicBranchInfo
  );

router
  .route("/update/structure/:branchID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.updateBranchStructure
  );

router
  .route("/delete/:branchID")
  .delete(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.deleteBranch
  );

router
  .route("/settings/update")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.updateBranchSettings
  );

router
  .route("/settings")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.getBranchSettings
  );

router.route("/recursiveTrail/:branchID").get(branchController.recursiveTrial);

router
  .route("/location/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createBranchLocation
  );

router.route("/getLocationByCountry").post(branchController.getLocationByCountry);
router.route("/getLocationByState").post(branchController.getLocationByState);
router.route("/getLocationByDistrict").post(branchController.getLocationByDistrict);
router.route("/getLocationByVDC").post(branchController.getLocationByVDC);

// router.route("/getAllCountries").get(branchController.getAllCountries);
// router.route("/getCountry/:countryCode").get(branchController.getCountry);

// router.route("/getAllStates").get(branchController.getAllStates);
// router
//   .route("/getStatesOfCountry/:countryCode")
//   .get(branchController.getStatesOfCountry);

// router.route("/getAllCities").get(branchController.getAllCities);
// router
//   .route("/getCitiesOfCountry/:countryCode")
//   .get(branchController.getCitiesOfCountry);
// router
//   .route("/getCitiesOfState/:countryCode/:stateCode")
//   .get(branchController.getCitiesOfState);

module.exports = router;
