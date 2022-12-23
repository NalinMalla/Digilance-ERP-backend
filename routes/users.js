const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const userController = require("../controller/user.controllers");

router
  .route("/all")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findAllUsers
  );

router
  .route("/add")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.createUser
  );

router
  .route("/addCSV")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.createUsersByCSV
  );

router
  .route("/:eID")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findUserByEID
  );

router
  .route("/id/:_id")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findUserByID
  );

router
  .route("/userName/:userName")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findUserByUName
  );

router
  .route("/name/:name")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findUsersByName
  );

router
  .route("/branch/:branchID")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findUsersByBranchID
  );

router
  .route("/:eID/getInfo")
  .get(
    [authJwt.verifyToken, authJwt.selfVerification, authJwt.accessGrant],
    userController.findUserByEID
  );

router
  .route("/update/:eID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.updateUser
  );

router
  .route("/delete/:eID")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.deleteUser
  );

router.route("/login").post(userController.login);

router
  .route("/unlock/:eID")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.unlockUserByID
  );

router
  .route("/lock/:eID")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.lockUserByID
  );

router
  .route("/authJwt")
  .post(authJwt.verifyToken, authJwt.isAdmin, authJwt.authResponse);

router
  .route("/signInLogs")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findAllSignInLog
  );

router
  .route("/accessLogs")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.findAllAccessLog
  );

router
  .route("/passwordComplexity")
  .post(userController.retrievePasswordComplexity); //for some reason get requests are not excepted

router
  .route("/updatePasswordComplexity")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    userController.updatePasswordComplexity
  );

module.exports = router;
