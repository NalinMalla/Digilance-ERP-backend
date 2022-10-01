const router = require("express").Router();
const userController = require("../controller/user.controllers");

router.route("/").get(userController.findAllUsers);
router.route("/add").post(userController.createUser);
router.route("/:eID").get(userController.findUserByEID);
router.route("/update/:eID").put(userController.updateUser);
router.route("/delete/:id").delete(userController.deleteUser);
router.route("/login").post(userController.login);
router.route("/accessResource").post(userController.decodeToken);

router.route("/requestIP").post(
  (req, res) => {
    var clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    console.log(clientIp);
    res.send(clientIp);
  }
);

module.exports = router;
