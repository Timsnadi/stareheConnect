const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for current user
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name email role house stream clubs')
    .sort({ updatedAt: -1 });
    
    res.json(conversations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create or find a conversation
router.post('/', auth, async (req, res) => {
  const { participantId } = req.body;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (conversation) {
      return res.json(conversation);
    }

    conversation = new Conversation({
      participants: [req.user.id, participantId]
    });

    await conversation.save();
    res.json(conversation);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
