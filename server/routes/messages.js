const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  const { conversationId, content } = req.body;
  try {
    const newMessage = new Message({
      conversationId,
      senderId: req.user.id,
      content
    });

    const savedMessage = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        createdAt: new Date(),
        senderId: req.user.id
      }
    });

    res.json(savedMessage);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
