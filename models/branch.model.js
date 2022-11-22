const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BranchSchema = new schema(
  {
    organization: {
      type: schema.Types.ObjectId,
      required: [true, "The branch needs to be part of an organization."],
    },
    countryCode: { type: String },
    stateCode: { type: String },
    city: { type: String },
    address: { type: String },
    parentBranch: { type: schema.Types.ObjectId },
    childBranch: [{ type: schema.Types.ObjectId }],
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
