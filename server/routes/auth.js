const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, house, stream, userType, clubs, roles, profession } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      house,
      stream,
      role: userType || 'student',
      clubs,
      roles,
      profession
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email, house, stream, role: user.role } });
  } catch (err) {
    console.error('Registration Error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: Object.values(err.errors).map(val => val.message).join(', ') });
    }
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Admin Override for Free Tier Demo
    if (email === 'admin@stareheconnect.com' && password === 'admin123') {
      return res.json({ 
        token: 'admin-token', 
        user: { id: 'admin-id', name: 'System Admin', email, role: 'admin', house: 'Patshaw', stream: 'A' } 
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email, house: user.house, stream: user.stream, role: user.role, clubs: user.clubs } });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
