const mongoose = require("mongoose");

const schema = mongoose.Schema;

const OrganizationSchema = new schema(
  {
    name: {
      type: String,
      required: [true, "Organization's name is mandatory"],
    },
    logo: { type: String },
    address: { type: String },
    email: { type: String },
    contactNo: { type: String },
    faxNo: { type: String },
    poBoxNo: { type: String },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = Organization;
