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

// Unsend/Delete a message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: 'Message not found' });

    // Only sender can delete
    if (message.senderId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await Message.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
