const router = require("express").Router();
// const multer = require("multer");
// let path = require("path");
const mongodb = require('mongodb');

const authJwt = require("../middleWares/authJwt");
const organizationController = require("../controller/organization.controllers");

// Required for storing image in the backend
// const Storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads");
//   },

//   filename: (req, file, callback) => {
//     callback(
//       null,
//       new Date().toISOString().slice(0, 10) + "--" + file.originalname
//     );
//   },
// });

// const upload = multer({
//   storage: Storage,
//   limits: { fileSize: 1000000 }, //In bytes, so its currently set to 1MB
//   fileFilter: function (req, file, callback) {
//     var ext = path.extname(file.originalname);
//     if (
//       ext !== ".png" &&
//       ext !== ".jpg" &&
//       ext !== ".gif" &&
//       ext !== ".jpeg" &&
//       ext !== ".txt"
//     ) {
//       return callback(new Error("Only images are allowed"));
//     }
//     callback(null, true);
//   },
// });

// const uploadName = [
//   { name: "logo", maxCount: 1 },
//   { name: "registerCert", maxCount: 1 },
//   { name: "panCert", maxCount: 1 },
//   { name: "taxClearCert", maxCount: 1 },
//   { name: "mou", maxCount: 1 },
//   { name: "moa", maxCount: 1 },
//   { name: "orgChart", maxCount: 1 },
// ];

router.route("/all/:orgID").get(organizationController.getOrganizationInfo);
router.route("/:orgID").get(organizationController.getOrganizationBasicInfo);

router
  .route("/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.createOrganization
  );

// router
//   .route("/update")
//   .put(
//     [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
//     upload.fields(uploadName),
//     organizationController.updateOrganizationInfo
//   );

router
  .route("/update/:orgID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.updateOrganizationInfo
  );

router
  .route("/delete/:orgID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.deleteOrganizationInfo
  );

module.exports = router;
