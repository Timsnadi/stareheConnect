const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: String },
  deadline: { type: String },
  field: { type: String, default: 'All streams' },
  link: { type: String },
  open: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
