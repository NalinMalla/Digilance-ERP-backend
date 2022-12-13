const mongoose = require("mongoose");
const schema = mongoose.Schema;

const OrganizationSettingsSchema = new schema(
  {
    validFileExtensions : [{type: String}],
    fileSize: {type: String}
  },
  {
    timestamps: true,
  }
);
const OrganizationSettings = mongoose.model("OrganizationSettings", OrganizationSettingsSchema);
module.exports = OrganizationSettings;
