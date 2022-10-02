const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    eID: {
      type: Number,
      required: [true, "Employee ID is mandatory."],
      unique: true,
    },

    name: {
      type: String,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "User Name should be more than 4 characters."],
    },

    password: {
      type: String,
      required: true,
      minlength: [4, "Password should be more than 3 characters."],
    },

    passwordHistory: [{ type: String, required: true, unique: true }],

    privilege: {
      type: String,
      required: true,
    },

    modules: [{ type: String, required: true, unique: true }],

    lock: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
