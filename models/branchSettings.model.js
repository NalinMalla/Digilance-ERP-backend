const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BranchSettingsSchema = new schema(
  {
    branchIDFormat : [{type: String, required: true}]
  },
  {
    timestamps: true,
  }
);
const BranchSettings = mongoose.model("BranchSettings", BranchSettingsSchema);
module.exports = BranchSettings;
