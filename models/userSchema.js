const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "Please, insert a name"],
  },
  email: {
    type: String,
    require: [true, "Please provide your e-mail"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please, provide a valid e-mail"],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please, confirm your password"],
    validate: {
      // This just works on SAVE and CREATE functions
      validator: function (el) {
        return el === this.password;
      },
      message: "Password does not match with the password confirmation",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  //If the password wasn't modified
  if (!this.isModified("password")) return next();

  //Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  //Undefine the confirmed password because it was changed
  this.passwordConfirm = undefined;
  next();
});

/* 
Instance methods - compare the password specified by the user with the 
encrypted passoword
*/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/*
Instance method - check if the user changed its password
*/

userSchema.methods.passwordChanged = function (JWTtimestamp) {
  if (this.passwordChanged) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimeStamp, JWTtimestamp);
    return JWTtimestamp < changedTimeStamp;
  }

  //False means not changed, which means that the JWTTimestamp is less than the changedTimeStamp
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
