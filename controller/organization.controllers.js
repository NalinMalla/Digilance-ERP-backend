const mongodb = require("mongodb");
const fs = require("fs");
const binary = mongodb.Binary;

let Organization = require("../models/organization.model");

const updateOrganizationInfo = (req, res) => {
  Organization.findOne()
    .then((organization) => {
      console.log("Update Org");
      let taxClearDate = req.body.taxClearDate;
      if (organization) {
        organization.name = req.body.name;
        organization.address = req.body.address;
        organization.slogan = req.body.slogan;
        organization.pan.number = req.body.panNumber;
        
      } else {
        organization = new Organization({
          name: req.body.name,
          address: req.body.address,
          slogan: req.body.slogan,
          pan: { number: req.body.panNumber },
        });
      }

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
          { date: Date.parse(req.body.taxClearDate), picture: binary(req.files.taxClearCert.data) },
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

      organization
        .save()
        .then(() =>
          res.json({
            success: true,
            message: `Organizational information has been updated.`,
          })
        )
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const getOrganizationInfo = (req, res) => {
  Organization.findOne()
    .then((org) => {
      // fs.writeFileSync("uploadedImage.jpg", org.logo);
      res.json(org);
    })
    .catch((err) => res.status(400).json(err));
};

const deleteOrganizationInfo = (req, res) => {
  Organization.deleteOne()
    .then(() =>
      res.json({
        success: true,
        message: `Organization with eID:${req.params.eID} deleted.`,
      })
    )
    .catch((err) => res.status(400).json(err));
};

exports.updateOrganizationInfo = updateOrganizationInfo;
exports.getOrganizationInfo = getOrganizationInfo;
exports.deleteOrganizationInfo = deleteOrganizationInfo;
