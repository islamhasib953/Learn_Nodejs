const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  description: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 1024
  },
  price: {
    type: Number,
    required: true,
    min: 10,
  }
});
// s فى تسمية الموديل بكتبه مفرد واول حرف كابتل لما ارن بيتحط فى الداتاابيز كله حروف سمول واخر الكلمة
module.exports = mongoose.model('Course', courseSchema);