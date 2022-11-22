const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrganizationSchema = new schema(
  {
    orgID: {
      type: String,
      required: [true, "Organization's ID is mandatory"],
      unique: true
    },
    name: {
      type: String,
      required: [true, "Organization's name is mandatory"],
      unique: true
    },
    logo: { type:  Buffer},
    slogan: { type: String },
    registerCert: { type: Buffer },
    pan:{
      picture: { type: Buffer},
      number: { type: String}
    },
    taxClearCert: [{date: {type: Date}, picture: {type: Buffer}}],
    mou: {type: Buffer},    //Memorandum of Understanding, which doesn't need to be legally binding
    moa: {type: Buffer},    //Memorandum of Agreement, which needs to be legally enforced
    orgChart: {type: Buffer},   //Shows the hierarchical structure of a company
    branch: { type: schema.Types.ObjectId },     //Shows the hierarchical structure of a company
  },
  {
    timestamps: true,
  }
);
const Organization = mongoose.model("Organization", OrganizationSchema);
module.exports = Organization;