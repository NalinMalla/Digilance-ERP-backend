const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrganizationSchema = new schema(
  {
    name: {
      type: String,
      required: [true, "Organization's name is mandatory"],
    },
    logo: { type:  Buffer},
    address: { type: String },
    slogan: { type: String },
    registerCert: { type: Buffer },
    pan:{
      picture: { type: Buffer},
      number: { type: String}
    },
    taxClearCert: [{date: {type: Date}, picture: {type: Buffer}}],
    mou: {type: Buffer},    //Memorandum of Understanding, which doesn't need to be legally binding
    moa: {type: Buffer},    //Memorandum of Agreement, which needs to be legally enforced
    orgChart: {type: Buffer}   //Shows the hierarchical structure of a company 

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
