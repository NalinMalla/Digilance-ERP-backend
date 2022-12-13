const router = require("express").Router();
const multer = require("multer");
let path = require("path");
const mongodb = require("mongodb");

const authJwt = require("../middleWares/authJwt");
const organizationController = require("../controller/organization.controllers");
const OrganizationSettings = require("../models/organizationSettings.model");

let validFileExts, uploadName;

// Required for storing image in the backend
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
  // limits: { fileSize: fileSize }, //In bytes, so its 1000000 is 1MB
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (!validFileExts.includes(ext)) {
      return callback(new Error("Only images are allowed"));
    }
    
    callback(null, true);
  },
});

uploadName = [
  { name: "logo", maxCount: 1 },
  { name: "registerCert", maxCount: 10 },
  { name: "panCert", maxCount: 1 },
  { name: "taxClearCert", maxCount: 50 },
  { name: "mou", maxCount: 10 },
  { name: "moa", maxCount: 10 },
  { name: "orgChart", maxCount: 10 },
  { name: "vatCert", maxCount: 1 },
];

const getOrgSetting = (req, res, next) => {
  OrganizationSettings.findOne().exec((err, orgSettings) => {
    if (err) {
      res.status(500).send(err);
      next();
      return;
    }
    else if(!orgSettings){
      res.json({errors: true, message: "Organization Setting is not set."});
      next();
      return;
    }
    else{
      req.fileSize= Number(orgSettings.fileSize);
      validFileExts= orgSettings.validFileExtensions;
      next();
      return;
    }
  });
};

router.route("/all/:orgID").get(organizationController.getOrganizationInfo);

router.route("/all").get(organizationController.getAllOrganizationInfo);

router
  .route("/basic/:orgID")
  .get(organizationController.getOrganizationBasicInfo);

// router
//   .route("/create")
//   .post(
//     [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
//     upload.any(),
//     organizationController.createOrganization
//   );

router
  .route("/create")
  .post(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    getOrgSetting,
    upload.fields(uploadName),
    organizationController.createOrganization
  );

router
  .route("/update/:orgID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    getOrgSetting,
    upload.fields(uploadName),
    organizationController.updateOrganizationInfo
  );

// router
//   .route("/update/:orgID")
//   .put(
//     [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
//     organizationController.updateOrganizationInfo
//   );

router
  .route("/update/branch/:orgID")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.updateOrganizationBranchInfo
  );

router
  .route("/delete/:orgID")
  .delete(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.deleteOrganizationInfo
  );

router
  .route("/settings/update")
  .put(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.updateOrganizationSettings
  );

router
  .route("/setting")
  .get(
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.accessGrant],
    organizationController.getOrganizationSettings
  );

module.exports = router;
