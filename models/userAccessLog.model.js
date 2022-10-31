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

    privilege: {
      type: String
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
    },

    validToken: {
      type: Boolean
    },

    validPrivilege: {
      type: Boolean
    },

    validRole: {
      type: Boolean
    },
 
  },
  {
    timestamps: true,
  }
);

const UserAccessLog = mongoose.model("UserAccessLog", UserAccessLogSchema);

module.exports = UserAccessLog;
