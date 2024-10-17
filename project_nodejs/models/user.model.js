const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 255,
    validate: [validator.isEmail, 'Invalid Email']
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  token: {
    type: String,
    required: false
  },
  role: {
    type: String,   //نا كدا بعرف ان المستخدم لازم يكون واحد من دول يعنى السترنج ده بشيل واحد من اللى تحت دول
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
    default: userRoles.USER
  },
  avatar: {
    type: String,
    default: 'uploads/profile.jpg'
  }
})
module.exports = mongoose.model('User', userSchema);