const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resource = require('../models/Resource');
const Scholarship = require('../models/Scholarship');

// GET /api/resources — get all approved resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find({ approved: true })
      .populate('uploadedBy', 'name')
      .sort({ reads: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/resources — upload a resource (pending approval)
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, url } = req.body;
    if (!title?.trim()) return res.status(400).json({ msg: 'Title is required' });

    const resource = new Resource({
      title, type: type || 'Guide',
      url, uploadedBy: req.user.id,
      approved: false
    });

    await resource.save();
    res.status(201).json({ msg: 'Resource submitted for review', resource });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// PUT /api/resources/:id/read — increment read count
router.put('/:id/read', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { reads: 1 } },
      { new: true }
    );
    res.json({ reads: resource.reads });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// GET /api/resources/scholarships — get open scholarships
router.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ open: true }).sort({ deadline: 1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
