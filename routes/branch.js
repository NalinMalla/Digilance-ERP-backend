const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const branchController = require("../controller/branch.controllers");

router.route("/getBranch/:name").get(branchController.getBranchInfoByName);

router
  .route("/update/:name")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.updateBranchInfo
  );

router
  .route("/delete/:name")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    branchController.deleteBranch
  );

router.route("/getAllCountries").get(branchController.getAllCountries);
router.route("/getCountry/:countryCode").get(branchController.getCountry);

router.route("/getAllStates").get(branchController.getAllStates);
router.route("/getStatesOfCountry/:countryCode").get(branchController.getStatesOfCountry);

router.route("/getAllCities").get(branchController.getAllCities);
router.route("/getCitiesOfCountry/:countryCode").get(branchController.getCitiesOfCountry);
router.route("/getCitiesOfState/:countryCode/:stateCode").get(branchController.getCitiesOfState);




module.exports = router;
