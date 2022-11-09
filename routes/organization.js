const router = require("express").Router();
const multer = require("multer");

const authJwt = require("../middleWares/authJwt");
const organizationController = require("../controller/organization.controllers");

//Required for storing image in the backend
const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },

  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().slice(0, 10) + "--" + file.originalname
    );
  },
});

const upload = multer({
  storage: Storage,
  // limits:{fileSize: 1024*1024*16}
});

router.route("/").get(organizationController.getOrganizationInfo);
router
  .route("/update")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    upload.single("logo"),
    organizationController.updateOrganizationInfo
  );
// router.route("/passwordComplexity").post(organizationController.retrievePasswordComplexity);    //for some reason get requests are not excepted

module.exports = router;
