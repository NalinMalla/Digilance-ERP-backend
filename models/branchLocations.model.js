const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BranchLocationsSchema = new schema(
  {
    country: {type: String, required: [true, "Country is mandatory."] },
    countryCode: { type: String, required: [true, "Country Code is mandatory."] },
    state: {type: String, required: [true, "State is mandatory."] },
    stateCode: { type: String, required: [true, "State Code is mandatory."] },
    district: {type: String, required: [true, "District is mandatory."] },
    districtCode: { type: String, required: [true, "District Code is mandatory."] },
    vdc: {type: String},
    vdcCode: {type: String},
    noOfWards: {type: String}
  },
  {
    timestamps: true,
  }
);

const BranchLocations = mongoose.model("BranchLocations", BranchLocationsSchema);
module.exports = BranchLocations;
