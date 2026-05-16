const mongoose = require('mongoose');

// Tracks which badges each user has earned
const badgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: {
    type: String,
    enum: [
      'first_connection',
      'five_sessions',
      'top_mentor',
      'house_pride',
      'job_posted',
      'event_host',
      'leaderboard_top3',
      'resource_author'
    ]
  },
  earnedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);
