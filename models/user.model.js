const mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema;

const UserSchema = new schema(
  {
    eID: {
      type: Number,
      required: [true, "Employee ID is mandatory."],
      unique: true
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

    modules: [
      {
        name: { type: String, required: true },
        isChecked: { type: Boolean, required: true },
      },
    ],

    countLoginMistakes: {
      type: Number,
      default: 0
    },

    lock: {
      type: Boolean,
      default: false,
    },

    lockPeriod: {
      type: Date
    },

    continuity: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(uniqueValidator, { type: '', message: 'This {PATH} is already taken.' });    // Replaces unique errors from the default MongoServerError(E11000) to ValidationError

const User = mongoose.model("User", UserSchema);

module.exports = User;
