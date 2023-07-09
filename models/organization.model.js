const mongoose = require("mongoose");
const schema = mongoose.Schema;
let uniqueValidator = require("mongoose-unique-validator");

// const OrganizationSchema = new schema(
//   {
//     orgID: {
//       type: String,
//       required: [true, "Organization's ID is mandatory"],
//       unique: true
//     },
//     name: {
//       type: String,
//       required: [true, "Organization's name is mandatory"],
//       unique: true
//     },
//     logo: { type:  Buffer},
//     slogan: { type: String },
//     registerCert: { type: Buffer },
//     pan:{
//       picture: { type: Buffer},
//       number: { type: String}
//     },
//     vat:{
//       picture: { type: Buffer},
//       number: { type: String}
//     },
//     taxClearCert: [{date: {type: Date}, picture: {type: Buffer}}],
//     mou: {type: Buffer},    //Memorandum of Understanding, which doesn't need to be legally binding
//     moa: {type: Buffer},    //Memorandum of Agreement, which needs to be legally enforced
//     orgChart: {type: Buffer},   //Shows the hierarchical structure of a company
//     branchID: { type: String },     //Shows the hierarchical structure of a company
//   },
//   {
//     timestamps: true,
//   }
// );

const OrganizationSchema = new schema(
  {
    orgID: {
      type: String,
      required: [true, "Organization's ID is mandatory"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Organization's name is mandatory"],
      unique: true,
    },
    logo: { type: String },
    slogan: { type: String },
    registerCert: [{ type: String }],
    pan: {
      picture: { type: String },
      number: { type: String },
    },
    vat: {
      picture: { type: String },
      number: { type: String },
    },
    // taxClearCert: [{ date: { type: Date }, picture: { type: String } }],
    taxClearCert: [{ type: String } ],

    mou: [{ type: String }], //Memorandum of Understanding, which doesn't need to be legally binding
    moa: [{ type: String }], //Memorandum of Agreement, which needs to be legally enforced
    orgChart: [{ type: String }], //Shows the hierarchical structure of a company
    branchID: { type: String }, //Shows the hierarchical structure of a company
  },
  {
    timestamps: true,
  }
);

OrganizationSchema.plugin(uniqueValidator, {
  type: "",
  message: "This {PATH} is already taken.",
}); // Replaces unique errors from the default MongoServerError(E11000) to ValidationError

const Organization = mongoose.model("Organization", OrganizationSchema);
module.exports = Organization;
