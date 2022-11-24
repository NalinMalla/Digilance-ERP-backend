const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
    countryCode: { type: String, required: [true, "Country is a mandatory field for branch."] },
    stateCode: { type: String, required: [true, "State is a mandatory field for branch."] },
    city: { type: String, required: [true, "City is a mandatory field for branch."] },
    address: { type: String },
    parentBranchID: { type: String },
    childBranchIDs: [{ type: String }],
    email: { type: String },
    contactNo: [{ type: String }],
    faxNo: { type: String },
    poBoxNo: { type: String },
    level: { type: Number, required: [true, "Branch Level is mandatory"] }, //Set by the system by comparing to the parentBranch level eventually leading to the root branch whose level 0
  },
  {
    timestamps: true,
  }
);
const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch;
