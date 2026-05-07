const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumnus', 'admin'], default: 'student' },
  house: { type: String, required: true },
  stream: { type: String, required: true },
  clubs: [{ type: String }],
  roles: [{ type: String }],
  profession: { type: String }, // For alumni
  yearJoined: { type: Number },
  yearLeft: { type: Number },
  bio: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
