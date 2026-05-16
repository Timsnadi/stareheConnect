const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Badge = require('../models/Badge');

// GET /api/community/leaderboard — top alumni by conversation count
router.get('/leaderboard', async (req, res) => {
  try {
    // Count conversations each alumnus is in as a proxy for mentor activity
    const alumni = await User.find({ role: 'alumnus' }).select('name house stream profession');

    const scored = await Promise.all(alumni.map(async (a) => {
      const sessionCount = await Conversation.countDocuments({ participants: a._id });
      return {
        _id: a._id,
        name: a.name,
        house: a.house,
        profession: a.profession,
        sessions: sessionCount,
        pts: sessionCount * 50  // 50 pts per session
      };
    }));

    scored.sort((a, b) => b.pts - a.pts);
    res.json(scored.slice(0, 10));
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// GET /api/community/house-leaderboard — house points aggregated
router.get('/house-leaderboard', async (req, res) => {
  try {
    const houses = ['Kahawa', 'Thika', 'Nairobi', 'Mara', 'Athi', 'Ruiru'];

    const results = await Promise.all(houses.map(async (house) => {
      const members = await User.find({ house }).select('_id');
      const ids = members.map(m => m._id);
      const sessionCount = await Conversation.countDocuments({
        participants: { $in: ids }
      });
      return { house, pts: sessionCount * 50, color: houseColor(house) };
    }));

    results.sort((a, b) => b.pts - a.pts);
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

function houseColor(house) {
  const colors = {
    Kahawa: '#1D9E75', Thika: '#378ADD', Nairobi: '#7F77DD',
    Athi: '#EF9F27', Mara: '#D85A30', Ruiru: '#D4537E'
  };
  return colors[house] || '#888888';
}

// GET /api/community/badges/:userId — get user's badges
router.get('/badges/:userId', auth, async (req, res) => {
  try {
    const earned = await Badge.find({ user: req.params.userId });
    const earnedKeys = earned.map(b => b.badge);

    const ALL_BADGES = [
      { key: 'first_connection',  name: 'First connection',   icon: 'Heart' },
      { key: 'five_sessions',     name: '5 sessions',          icon: 'MessageCircle' },
      { key: 'top_mentor',        name: 'Top mentor',          icon: 'Star' },
      { key: 'house_pride',       name: 'House pride',         icon: 'Home' },
      { key: 'job_posted',        name: 'Job posted',          icon: 'Briefcase' },
      { key: 'event_host',        name: 'Event host',          icon: 'Calendar' },
      { key: 'leaderboard_top3',  name: 'Leaderboard top 3',  icon: 'Trophy' },
      { key: 'resource_author',   name: 'Resource author',     icon: 'BookOpen' },
    ];

    const result = ALL_BADGES.map(b => ({
      ...b,
      earned: earnedKeys.includes(b.key),
      earnedAt: earned.find(e => e.badge === b.key)?.earnedAt || null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Internal helper — award a badge (called from other routes)
router.post('/badges/award', auth, async (req, res) => {
  try {
    const { userId, badge } = req.body;
    const exists = await Badge.findOne({ user: userId, badge });
    if (exists) return res.json({ msg: 'Already earned' });

    await Badge.create({ user: userId, badge });
    res.json({ msg: 'Badge awarded', badge });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
