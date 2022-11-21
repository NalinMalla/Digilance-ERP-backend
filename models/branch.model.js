const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BranchSchema = new schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is mandatory"],
    },
    countryCode: {type: String},
    stateCode: {type: String},
    cityCode: {type: String},
  },
  {
    timestamps: true,
  }
);
const Branch = mongoose.model("Branch", BranchSchema);
module.exports = Branch;
