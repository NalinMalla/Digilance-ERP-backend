const mongodb = require("mongodb");
const fs = require("fs");
const binary = mongodb.Binary;

let Organization = require("../models/organization.model");

const createOrganization = (req, res) => {
  let taxClearDate = req.body.taxClearDate;
  let organization = new Organization({
    orgID: req.body.orgID,
    name: req.body.name,
    slogan: req.body.slogan,
    pan: { number: req.body.panNumber },
  });

  if (req.files.logo) {
    organization.logo = binary(req.files.logo.data);
  }
  if (req.files.registerCert) {
    organization.registerCert = binary(req.files.registerCert.data);
  }
  if (req.files.panCert) {
    organization.pan.picture = binary(req.files.panCert.data);
  }
  if (req.files.taxClearCert && taxClearDate) {
    organization.taxClearCert = [
      {
        date: Date.parse(req.body.taxClearDate),
        picture: binary(req.files.taxClearCert.data),
      }
    ];
  }
  if (req.files.mou) {
    organization.mou = binary(req.files.mou.data);
  }
  if (req.files.moa) {
    organization.moa = binary(req.files.moa.data);
  }
  if (req.files.orgChart) {
    organization.orgChart = binary(req.files.orgChart.data);
  }

  organization
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `${req.body.name} has been enlisted as an organization.`,
          })
        )
        .catch((err) => res.json(err));
};

const updateOrganizationInfo = (req, res) => {
  Organization.findOne({ orgID: req.params.orgID })
    .then((organization) => {
      let taxClearDate = req.body.taxClearDate;
      if(req.body.orgID)
      {
        organization.orgID = req.body.orgID;
      }
      if(req.body.name)
      {
        organization.name = req.body.name;
      }

      organization.slogan = req.body.slogan;
      organization.pan.number = req.body.panNumber;
      organization.branchID = req.body.branchID;


      if (req.files.logo) {
        organization.logo = binary(req.files.logo.data);
      }

      if (req.files.registerCert) {
        organization.registerCert = binary(req.files.registerCert.data);
      }
      if (req.files.panCert) {
        organization.pan.picture = binary(req.files.panCert.data);
      }
      if (req.files.taxClearCert && taxClearDate) {
        organization.taxClearCert = [
          ...organization.taxClearCert,
          {
            date: Date.parse(req.body.taxClearDate),
            picture: binary(req.files.taxClearCert.data),
          },
        ];
      }
      if (req.files.mou) {
        organization.mou = binary(req.files.mou.data);
      }
      if (req.files.moa) {
        organization.moa = binary(req.files.moa.data);
      }
      if (req.files.orgChart) {
        organization.orgChart = binary(req.files.orgChart.data);
      }
      console.log("Organization found for update.");
      // Object.values(req.files).forEach((val) => {   //Here, val stores a file sent in each iteration
      //   let index = val[0].fieldname;   //fieldname is the name of the input field in the frontend
      //   console.log("Request file: ");
      //   console.log(val[0]);
      //   // if (index == "logo") {
      //   //   organization.logo = val[0].path;
      //   // }
      //   if (index == "registerCert") {
      //     organization.registerCert = val[0].path;
      //   }
      //   if (index == "panCert") {
      //     organization.pan.picture = val[0].path;
      //   }
      //   if (index == "taxClearCert" && taxClearDate) {
      //     organization.taxClearCert = [
      //       ...organization.taxClearCert,
      //       { date: Date.parse(req.body.taxClearDate), picture: val[0].path},
      //     ];
      //   }
      //   if (index == "mou") {
      //     organization.mou = val[0].path;
      //   }
      //   if (index == "moa") {
      //     organization.moa = val[0].path;
      //   }
      //   if (index == "orgChart") {
      //     organization.orgChart = val[0].path;
      //   }
      // });
      console.log("organization.branchID");
      console.log(organization.branchID);
      organization
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `${req.params.orgID} organizational information has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const updateOrganizationBranchInfo = (req, res) => {
  Organization.findOne({ orgID: req.params.orgID })
    .then((organization) => {
      organization.branchID = req.body.branchID;

      organization
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `${req.params.orgID} organizational branch information has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const getOrganizationInfo = (req, res) => {
  Organization.findOne({orgID: req.params.orgID})
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json(org);
    })
    .catch((err) => res.status(400).json(err));
};

const getOrganizationBasicInfo = (req, res) => {
  Organization.findOne({orgID: req.params.orgID})
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json({
        orgID: org.orgID,
        name: org.name,
        logo: org.logo,
        branchID: org.branchID
      });
    })
    .catch((err) => res.status(400).json(err));
};

const deleteOrganizationInfo = (req, res) => {
  Organization.deleteOne({orgID: req.params.orgID})
    .then(() =>
      res.json({
        success: true,
        message: `Organization with orgID:${req.params.orgID} deleted.`,
      })
    )
    .catch((err) => res.status(400).json(err));
};

exports.createOrganization = createOrganization;
exports.updateOrganizationInfo = updateOrganizationInfo;
exports.getOrganizationInfo = getOrganizationInfo;
exports.deleteOrganizationInfo = deleteOrganizationInfo;
exports.getOrganizationBasicInfo = getOrganizationBasicInfo;
exports.updateOrganizationBranchInfo = updateOrganizationBranchInfo;
