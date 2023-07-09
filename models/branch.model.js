const mongoose = require("mongoose");
const schema = mongoose.Schema;
let uniqueValidator = require("mongoose-unique-validator");

const BranchSchema = new schema(
  {
    branchID: {
      type: String,
      required: [true, "Branch ID is mandatory"],
      unique: true
    },
    orgID: {
      type: String,
      required: [true, "The branch needs to be part of an organization."],
    },
    // country: { type: String, required: [true, "Country is a mandatory field for branch."] },
    // state: { type: String, required: [true, "State is a mandatory field for branch."] },
    // district: { type: String, required: [true, "District is a mandatory field for branch."] },
    // vdc: { type: String},
    countryCode: { type: String, required: [true, "Country Code is a mandatory field for branch."] },
    stateCode: { type: String, required: [true, "State Code is a mandatory field for branch."] },
    districtCode: { type: String, required: [true, "District Code is a mandatory field for branch."] },
    vdcCode: { type: String},
    uniqueKey: {type: String},
    address: { type: String },
    parentBranchID: { type: String },
    childBranchIDs: [{ type: String }],
    email: { type: String },
    contactNo: [{ type: String }],
    faxNo: { type: String },
    poBoxNo: { type: String },
    level: { type: String, required: [true, "Branch Level is mandatory"] }, //Set by the system by comparing to the parentBranch level eventually leading to the root branch whose level 0
    departments: [{name: {type: String}, depID: {type:String}}],
    branchHead: {type: schema.Types.ObjectId}
  },
  {
    timestamps: true,
  }
);

BranchSchema.plugin(uniqueValidator, {
  type: "",
  message: "This {PATH} is already taken.",
}); // Replaces unique errors from the default MongoServerError(E11000) to ValidationError

const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch;
