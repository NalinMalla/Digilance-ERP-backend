const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSignInLogSchema = new schema(
  {
    eID: {
      type: Number,
    },

    userName: {
      type: String,
    },

    errorCode: {
      type: String
    },

    loggingIP: {
      type: String,
      required: [true, "Users IP address is required"]
    },

    continuityField: {
      type: String
    },

    remarks: {
      type: String
    }
 
  },
  {
    timestamps: true,
  }
);

const UserSignInLog = mongoose.model("UserSignInLog", UserSignInLogSchema);

module.exports = UserSignInLog;
