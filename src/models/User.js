const mongoose = require('mongoose');
const { hashPassword } = require('../utils/authUtils');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true},
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'},
  createdAt: {
    type: Date,
    default: Date.now}});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// TODO: Add a virtual field for password confirmation if needed for signup forms
// UserSchema.virtual('passwordConfirm')
//   .get(() => this.password)
//   .set(function(value) {
//     this.password = value;
//   });

// TODO: Add a pre-save hook to validate password confirmation if the virtual field is implemented
// UserSchema.pre('save', function(next) {
//   if (this.isModified('password') && this.password !== this.passwordConfirm) {
//     return next(new Error('Passwords do not match'));
//   }
//   next();
// });

module.exports = mongoose.model('User', UserSchema);