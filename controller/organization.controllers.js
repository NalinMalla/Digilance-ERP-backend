const mongodb = require("mongodb");
const fs = require("fs");
const binary = mongodb.Binary;

let Organization = require("../models/organization.model");
let OrganizationSettings = require("../models/organizationSettings.model");

const createOrganization = (req, res) => {
  console.log("Start Create org");
  // let taxClearDate = req.body.taxClearDate;
  let organization = new Organization({
    orgID: req.body.orgID,
    name: req.body.name,
    slogan: req.body.slogan,
    pan: { number: req.body.panNumber },
    vat: { number: req.body.vatNumber },
  });

  // if (req.files.logo) {
  //   organization.logo = binary(req.files.logo.data);
  // }
  // if (req.files.registerCert) {
  //   organization.registerCert = binary(req.files.registerCert.data);
  // }
  // if (req.files.panCert) {
  //   organization.pan.picture = binary(req.files.panCert.data);
  // }
  // if (req.files.vatCert) {
  //   organization.vat.picture = binary(req.files.vatCert.data);
  // }
  // if (req.files.taxClearCert && taxClearDate) {
  //   organization.taxClearCert = [
  //     {
  //       date: Date.parse(req.body.taxClearDate),
  //       picture: binary(req.files.taxClearCert.data),
  //     }
  //   ];
  // }
  // if (req.files.mou) {
  //   organization.mou = binary(req.files.mou.data);
  // }
  // if (req.files.moa) {
  //   organization.moa = binary(req.files.moa.data);
  // }
  // if (req.files.orgChart) {
  //   organization.orgChart = binary(req.files.orgChart.data);
  // }
  console.log("req.files");
  console.log(req.files);
  Object.values(req.files).forEach((val) => {
    //Here, val stores a file sent in each iteration
    for (let i = 0; i < val.length; i++) {
      if(val[i].size> req.fileSize){
        return res.json({errors: true, message: `File size cannot exceed ${req.fileSize} bytes.`})
      }

      let index = val[i].fieldname; //fieldname is the name of the input field in the frontend
      // console.log(index);
      if (index == "logo") {
        organization.logo = val[i].path;
      }

      if (index == "registerCert") {
        organization.registerCert = [...organization.registerCert, val[i].path];
      }

      if (index == "panCert") {
        organization.pan.picture = val[i].path;
      }

      if (index == "vatCert") {
        organization.vat.picture = val[i].path;
      }

      // if (index == "taxClearCert" && taxClearDate) {
      //   organization.taxClearCert = [
      //     ...organization.taxClearCert,
      //     { date: Date.parse(req.body.taxClearDate), picture: val[i].path },
      //   ];
      // }

      if (index == "taxClearCert") {
        organization.taxClearCert = [...organization.taxClearCert, val[i].path];
      }

      if (index == "mou") {
        organization.mou = [...organization.mou, val[i].path];
      }

      if (index == "moa") {
        organization.moa = [...organization.moa, val[i].path];
      }

      if (index == "orgChart") {
        organization.orgChart = [...organization.orgChart, val[i].path];
      }
    }
  });

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
      let moa = [],
        mou = [],
        orgChart = [],
        registerCert = [],
        taxClearCert = [];
      // let taxClearDate = req.body.taxClearDate;
      if (req.body.orgID) {
        organization.orgID = req.body.orgID;
      }
      if (req.body.name) {
        organization.name = req.body.name;
      }
      if (req.body.slogan) {
        organization.slogan = req.body.slogan;
      }

      if (req.body.panNumber) {
        organization.pan.number = req.body.panNumber;
      }

      if (req.body.vatNumber) {
        organization.vat.number = req.body.vatNumber;
      }

      if (req.body.branchID) {
        organization.branchID = req.body.branchID;
      }

      // if (req.files.logo) {
      //   organization.logo = binary(req.files.logo.data);
      // }

      // if (req.files.registerCert) {
      //   organization.registerCert = binary(req.files.registerCert.data);
      // }
      // if (req.files.panCert) {
      //   organization.pan.picture = binary(req.files.panCert.data);
      // }
      // if (req.files.vatCert) {
      //   organization.vat.picture = binary(req.files.vatCert.data);
      // }
      // if (req.files.taxClearCert && taxClearDate) {
      //   organization.taxClearCert = [
      //     ...organization.taxClearCert,
      //     {
      //       date: Date.parse(req.body.taxClearDate),
      //       picture: binary(req.files.taxClearCert.data),
      //     },
      //   ];
      // }
      // if (req.files.mou) {
      //   organization.mou = binary(req.files.mou.data);
      // }
      // if (req.files.moa) {
      //   organization.moa = binary(req.files.moa.data);
      // }
      // if (req.files.orgChart) {
      //   organization.orgChart = binary(req.files.orgChart.data);
      // }
      console.log("Organization found for update.");
      Object.values(req.files).forEach((val) => {
        //Here, val stores a file sent in each iteration
        console.log("val");
        console.log(val);
        console.log(val.length);

        for (let i = 0; i < val.length; i++) {
          console.log("Enter val");
          if(val[i].size> req.fileSize){
            return res.json({errors: true, message: `File size cannot exceed ${req.fileSize} bytes.`})
          }
          let index = val[i].fieldname; //fieldname is the name of the input field in the frontend
          console.log(index);

          if (index == "logo") {
            organization.logo = val[i].path;
          }

          if (index == "registerCert") {
            registerCert = [...registerCert, val[i].path];
            organization.registerCert = registerCert;
          }

          if (index == "panCert") {
            organization.pan.picture = val[i].path;
          }

          if (index == "vatCert") {
            organization.vat.picture = val[i].path;
          }

          // if (index == "taxClearCert" && taxClearDate) {
          //   organization.taxClearCert = [
          //     ...organization.taxClearCert,
          //     { date: Date.parse(req.body.taxClearDate), picture: val[i].path },
          //   ];
          // }

          if (index == "taxClearCert") {
            console.log("in tax clear");
            taxClearCert = [...taxClearCert, val[i].path];
            console.log(taxClearCert);
            organization.taxClearCert = taxClearCert;
          }

          if (index == "mou") {
            mou = [...mou, val[i].path];
            organization.mou = mou;
          }

          if (index == "moa") {
            moa = [...moa, val[i].path];
            organization.moa = moa;
          }

          if (index == "orgChart") {
            console.log("in orgChart");

            orgChart = [...orgChart, val[i].path];
            console.log(orgChart);
            organization.orgChart = orgChart;
          }
        }
        console.log("end of val");
      });

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
  Organization.findOne({ orgID: req.params.orgID })
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json(org);
    })
    .catch((err) => res.status(400).json(err));
};

const getOrganizationBasicInfo = (req, res) => {
  Organization.findOne({ orgID: req.params.orgID })
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json({
        _id: _id,
        orgID: org.orgID,
        name: org.name,
        logo: org.logo,
        branchID: org.branchID,
      });
    })
    .catch((err) => res.status(400).json(err));
};

const getAllOrganizationInfo = (req, res) => {
  Organization.find()
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json(org);
    })
    .catch((err) => res.status(400).json(err));
};

const deleteOrganizationInfo = (req, res) => {
  Organization.deleteOne({ orgID: req.params.orgID })
    .then(() =>
      res.json({
        success: true,
        message: `Organization with orgID:${req.params.orgID} deleted.`,
      })
    )
    .catch((err) => res.status(400).json(err));
};

const updateOrganizationSettings = (req, res) => {
  console.log("in update org setting");
  OrganizationSettings.findOne()
    .then((organizationSettings) => {
      if (organizationSettings) {
        if (req.body.fileSize) {
          organizationSettings.fileSize = req.body.fileSize;
        }
        if (req.body.validFileExts) {
          organizationSettings.validFileExtensions = req.body.validFileExts;
        }
      } else {
        organizationSettings = new OrganizationSettings({
          fileSize: req.body.fileSize,
          validFileExtensions: req.body.validFileExts,
        });
      }

      organizationSettings
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Successfully updated Organization settings.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const getOrganizationSettings = (req, res) => {
  OrganizationSettings.findOne()
    .then((organizationSettings) => {
      return res.json(organizationSettings);
    })
    .catch((err) => res.json(err));
};



exports.createOrganization = createOrganization;
exports.updateOrganizationInfo = updateOrganizationInfo;
exports.getOrganizationInfo = getOrganizationInfo;
exports.deleteOrganizationInfo = deleteOrganizationInfo;
exports.getOrganizationBasicInfo = getOrganizationBasicInfo;
exports.updateOrganizationBranchInfo = updateOrganizationBranchInfo;
exports.updateOrganizationSettings = updateOrganizationSettings;
exports.getOrganizationSettings = getOrganizationSettings;
exports.getAllOrganizationInfo = getAllOrganizationInfo;
