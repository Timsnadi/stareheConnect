const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// GET /api/events — get all approved events, with rsvp status
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ approved: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: 1 });

    const result = events.map(e => ({
      ...e.toObject(),
      rsvp: e.rsvps.some(id => id.toString() === req.user.id),
      rsvpCount: e.rsvps.length
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// PUT /api/events/:id/rsvp — toggle RSVP
router.put('/:id/rsvp', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const userId = req.user.id;
    const alreadyRsvped = event.rsvps.some(id => id.toString() === userId);

    if (alreadyRsvped) {
      event.rsvps = event.rsvps.filter(id => id.toString() !== userId);
    } else {
      event.rsvps.push(userId);
    }

    await event.save();
    res.json({ rsvp: !alreadyRsvped, rsvpCount: event.rsvps.length });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/events/suggest — suggest a new event (pending approval)
router.post('/suggest', auth, async (req, res) => {
  try {
    const { title, date, type, description } = req.body;
    if (!title?.trim() || !date?.trim())
      return res.status(400).json({ msg: 'Title and date are required' });

    const [month, day] = date.split(' ');
    const event = new Event({
      title, date, month, day,
      type: type || 'Webinar',
      description,
      createdBy: req.user.id,
      approved: false   // requires admin approval
    });

    await event.save();
    res.status(201).json({ msg: 'Suggestion submitted for review', event });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
