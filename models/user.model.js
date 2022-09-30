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
      firstName: {
        type: String,
        required: [true, "First Name is mandatory."],
        minlength: [1, "First Name cannot be blank."],
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: [true, "Last Name is mandatory."],
        minlength: [1, "Last Name cannot be blank."],
      },
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
      minlength: [4, "Password should be more than 3 characters."]
    },

    privilege: {
      type: String,
      required: true,
    },

    modules: {
      dartaChalani: {
        type: Boolean,
        default: false,
      },
      employeeManagement: {
        type: Boolean,
        default: false,
      },
      payroll: {
        type: Boolean,
        default: false,
      },
      tiffin: {
        type: Boolean,
        default: false,
      },
    },

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
