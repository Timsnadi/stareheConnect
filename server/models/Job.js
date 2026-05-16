const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Nairobi' },
  type: { type: String, enum: ['Internship', 'Full-time', 'Contract'], default: 'Full-time' },
  field: { type: String },
  deadline: { type: String },
  description: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
