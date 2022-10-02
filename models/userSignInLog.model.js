const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSignInLogSchema = new schema(
  {
    eID: {
      type: Number,
      // required: [true, "Employee ID is mandatory."],
    },

    userName: {
      type: String,
      // required: true,
      // minlength: [5, "User Name should be more than 4 characters."],
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
