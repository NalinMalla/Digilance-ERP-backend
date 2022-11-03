let Organization = require("../models/organization.model");

const updateOrganizationInfo = (req, res) => {
  Organization.findOne()
    .then((organization) => {
      if (organization) {
        organization.name = req.body.name;
        organization.address = req.body.address;
        organization.email = req.body.email;
        organization.contactNo = req.body.contactNo;
        organization.faxNo = req.body.faxNo;
        organization.poBoxNo = req.body.poBoxNo;

        if (req.file !== undefined) {
          organization.logo = req.file.path;
        } 
        else {
          organization.logo = organization.logo;
        }
      } 
      else {
        let logo = null;
        if (req.file) {
          logo = req.file.path;
        } 
        organization = new Organization({
          name: req.body.name,
          address: req.body.address,
          email: req.body.email,
          contactNo: req.body.contactNo,
          faxNo: req.body.faxNo,
          poBoxNo: req.body.poBoxNo,
          logo: logo
        });
      }
      organization.save()
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
    .then((org) => res.json(org))
    .catch((err) => res.status(400).json(err));
};

exports.updateOrganizationInfo = updateOrganizationInfo;
exports.getOrganizationInfo = getOrganizationInfo;
