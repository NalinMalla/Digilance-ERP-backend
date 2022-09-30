const router = require("express").Router();
const userController = require("../controller/user.controllers");

router.route("/").get(userController.findAllUsers);
router.route("/add").post(userController.createUser);
router.route("/:eID").get(userController.findUserByEID);
router.route("/update/:eID").put(userController.updateUser);
router.route("/delete/:id").delete(userController.deleteUser);

module.exports = router;
