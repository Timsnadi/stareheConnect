const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Guide', 'Article', 'Roadmap', 'Checklist', 'Video'], default: 'Guide' },
  url: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reads: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
