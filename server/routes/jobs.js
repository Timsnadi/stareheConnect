const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const CvReview = require('../models/CvReview');
const User = require('../models/User');

// GET /api/jobs — get all active jobs
router.get('/', async (req, res) => {
  try {
    const { field } = req.query;
    const filter = { active: true };
    if (field && field !== 'All') filter.field = field;

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name profession')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/jobs — alumni posts a job
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, type, field, deadline, description } = req.body;
    if (!title?.trim() || !company?.trim())
      return res.status(400).json({ msg: 'Title and company are required' });

    const job = new Job({
      title, company,
      location: location || 'Nairobi',
      type: type || 'Full-time',
      field, deadline, description,
      postedBy: req.user.id
    });

    await job.save();
    await job.populate('postedBy', 'name profession');
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/jobs/cv-review — student submits CV for review
router.post('/cv-review', auth, async (req, res) => {
  try {
    const { cvText, reviewerId, jobDescription } = req.body;
    if (!cvText?.trim()) return res.status(400).json({ msg: 'CV text is required' });

    const review = new CvReview({
      requestedBy: req.user.id,
      reviewer: reviewerId || null,
      cvText,
      jobDescription
    });

    await review.save();
    res.status(201).json({ msg: 'CV submitted for review', review });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// GET /api/jobs/reviewers — get alumni who can review CVs
router.get('/reviewers', async (req, res) => {
  try {
    const reviewers = await User.find({ role: 'alumnus' })
      .select('name profession field')
      .limit(20);
    res.json(reviewers);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
