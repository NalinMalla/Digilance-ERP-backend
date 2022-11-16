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
    slogan: { type: String },
    registerCert: { type: String },
    pan:{
      picture: { type: String},
      number: { type: String}
    },
    taxClearCert: [{date: {type: Date}, picture: {type: String}}],
    mou: {type: String},    //Memorandum of Understanding, which doesn't need to be legally binding
    moa: {type: String},    //Memorandum of Agreement, which needs to be legally enforced
    orgChart: {type: String}   //Shows the hierarchical structure of a company 

    // email: { type: String },
    // contactNo: { type: String },
    // faxNo: { type: String },
    // poBoxNo: { type: String },
  },
  {
    timestamps: true,
  }
);
const Organization = mongoose.model("Organization", OrganizationSchema);
module.exports = Organization;
