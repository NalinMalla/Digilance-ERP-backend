const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const branchController = require("../controller/branch.controllers");

router.route("/getBranch/:branchID").get(branchController.getBranchInfo);

router.route("/all").get([authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant], branchController.getAllBranchInfo);

router
  .route("/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createBranch
  );

router
  .route("/root/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.createRootBranch
  );

// router
//   .route("/update/:name")
//   .put(
//     [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
//     branchController.updateBranchInfo
//   );

router
  .route("/delete/:branchID")
  .delete(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.deleteBranch
  );

router.route("/getAllCountries").get(branchController.getAllCountries);
router.route("/getCountry/:countryCode").get(branchController.getCountry);

router.route("/getAllStates").get(branchController.getAllStates);
router
  .route("/getStatesOfCountry/:countryCode")
  .get(branchController.getStatesOfCountry);

router.route("/getAllCities").get(branchController.getAllCities);
router
  .route("/getCitiesOfCountry/:countryCode")
  .get(branchController.getCitiesOfCountry);
router
  .route("/getCitiesOfState/:countryCode/:stateCode")
  .get(branchController.getCitiesOfState);

module.exports = router;
