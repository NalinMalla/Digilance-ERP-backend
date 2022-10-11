const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserAccessLogSchema = new schema(
  {
    eID: {
      type: Number,
    },

    userName: {
      type: String,
    },

    accessedModule: {
      type: String
    },

    error: {
      type: String
    },

    loggingIP: {
      type: String,
    },

    remarks: {
      type: String
    }
 
  },
  {
    timestamps: true,
  }
);

const UserAccessLog = mongoose.model("UserAccessLog", UserAccessLogSchema);

module.exports = UserAccessLog;
