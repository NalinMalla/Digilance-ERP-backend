const mongoose = require("mongoose");

const schema = mongoose.Schema;

const PasswordComplexitySchema = new schema(
  {
    complexity: {
      type: Number,
      required: [true, "Password complexity has to be set."],
      default: 1
    },
  },
  {
    timestamps: true,
  }
);

const PasswordComplexity = mongoose.model("PasswordComplexity", PasswordComplexitySchema);

module.exports = PasswordComplexity;
