const mongoose = require('mongoose');

const cvReviewSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cvText: { type: String, required: true },
  jobDescription: { type: String },
  status: { type: String, enum: ['pending', 'in_review', 'completed'], default: 'pending' },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CvReview', cvReviewSchema);
