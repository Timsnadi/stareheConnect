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
    if (!participantId) return res.status(400).json({ msg: 'Participant ID is required' });

    // Ensure consistent ID comparison
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] }
    }).populate('participants', 'name email role house stream clubs');

    if (conversation) {
      return res.json(conversation);
    }

    conversation = new Conversation({
      participants: [req.user.id, participantId]
    });

    await conversation.save();
    
    // Populate before sending back to avoid frontend break
    const populated = await Conversation.findById(conversation._id).populate('participants', 'name email role house stream clubs');
    res.json(populated);
  } catch (err) {
    console.error('Conversation Create Error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// Delete a conversation
router.delete('/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ msg: 'Conversation not found' });

    // Ensure user is a participant using toString comparison
    const isParticipant = conversation.participants.some(p => p.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Conversation deleted' });
  } catch (err) {
    console.error('Conversation Delete Error:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;
