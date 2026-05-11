const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get Matches (Backend Matching Logic)
router.get('/matches/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Matching logic: Same House OR Same Stream OR Shared Clubs
    // Alumni for Students, Students for Alumni
    const matchType = user.role === 'student' ? 'alumnus' : 'student';

    const matches = await User.find({
      _id: { $ne: user._id },
      role: matchType,
      $or: [
        { house: user.house },
        { stream: user.stream },
        { clubs: { $in: user.clubs } }
      ]
    }).limit(10);

    res.json(matches);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get All Users (Directory)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get User Profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update User Profile
router.put('/:id', async (req, res) => {
  try {
    const { name, bio, profession, industry, location, clubs, roles } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, bio, profession, industry, location, clubs, roles } },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

const Conversation = require('../models/Conversation');

// Get Connections (Users you have messaged)
router.get('/:id/connections', async (req, res) => {
  try {
    const convs = await Conversation.find({ 
      participants: req.params.id 
    }).populate('participants', '-password');
    
    // Extract unique participants that are NOT the user themselves
    const connections = [];
    const seen = new Set();
    
    convs.forEach(c => {
      c.participants.forEach(p => {
        if (p._id.toString() !== req.params.id && !seen.has(p._id.toString())) {
          connections.push(p);
          seen.add(p._id.toString());
        }
      });
    });
    
    res.json(connections);
  } catch (err) {
    console.error('Connections error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
