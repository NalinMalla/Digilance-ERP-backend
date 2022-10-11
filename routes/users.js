const router = require("express").Router();

const authJwt = require("../middleWares/authJwt");
const userController = require("../controller/user.controllers");

router.route("/").get([authJwt.verifyToken, authJwt.isAdmin],userController.findAllUsers);
router.route("/add").post([authJwt.verifyToken, authJwt.isAdmin],userController.createUser);
router.route("/:eID").get(userController.findUserByEID);
router.route("/update/:eID").put(userController.updateUser);
router.route("/delete/:id").delete(userController.deleteUser);
router.route("/login").post(userController.login);
router.route("/authJwt").post(authJwt.verifyToken, authJwt.isAdmin, authJwt.authResponse);

module.exports = router;
