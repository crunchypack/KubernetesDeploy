/*Schema for admin users */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

var adminUser = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
// Authenticate

adminUser.statics.authenticate = async function(email, password) {
  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      const err = new Error("Admin user not found.");
      err.status = 401;
      throw err;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return user;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    throw error;
  }
};

// Hash password befor saving in database
adminUser.pre("save", function(next) {
  let admin = this;
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      console.log("SALT ERROR " + err);
      return next(err);
    }
    bcrypt.hash(admin.password, salt, (error, hash) => {
      if (error) {
        console.log("ERROR IN HASH " + error);
        return next(error);
      }
      admin.password = hash;
      next();
    });
  });
});
var Admin = mongoose.model("admins", adminUser);
module.exports = Admin;
