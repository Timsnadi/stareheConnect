const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // e.g. "Jun 20"
  month: { type: String },               // e.g. "Jun"
  day: { type: String },                 // e.g. "20"
  type: { type: String, enum: ['Webinar', 'In-person', 'Workshop'], default: 'Webinar' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
