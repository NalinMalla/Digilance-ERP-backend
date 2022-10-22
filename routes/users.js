const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const userController = require("../controller/user.controllers");

router.route("/").get([authJwt.verifyToken, authJwt.isAdmin],userController.findAllUsers);
router.route("/add").post([authJwt.verifyToken, authJwt.isAdmin],userController.createUser);
router.route("/:eID").get(userController.findUserByEID);
router.route("/update/:eID").put([authJwt.verifyToken, authJwt.isAdmin],userController.updateUser);
router.route("/delete/:eID").post([authJwt.verifyToken, authJwt.isAdmin],userController.deleteUser);
router.route("/login").post(userController.login);
router.route("/unlock/:eID").post([authJwt.verifyToken, authJwt.isAdmin],userController.unlockUserByID);
router.route("/lock/:eID").post([authJwt.verifyToken, authJwt.isAdmin],userController.lockUserByID);
router.route("/authJwt").post(authJwt.verifyToken, authJwt.isAdmin, authJwt.authResponse);
router.route("/signInLogs").post([authJwt.verifyToken, authJwt.isAdmin],userController.findAllSignInLog);
router.route("/accessLogs").post([authJwt.verifyToken, authJwt.isAdmin],userController.findAllAccessLog);

module.exports = router;
