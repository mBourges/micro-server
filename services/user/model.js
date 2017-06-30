const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  Email: { type: String, required: true, index: { unique: true } },
  Password: { type: String, required: true, select: false },
  IsAdmin: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('User', userModel);
