const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = 'mongodb://localhost:27017/stareheConnect';

const alumni = [
  {
    name: 'James Kamau',
    email: 'james@starehe.alumni',
    password: 'password123',
    role: 'alumnus',
    house: 'Patshaw',
    stream: 'A',
    profession: 'Software Architect at Safaricom',
    industry: 'Tech & Telecom',
    location: 'Nairobi, Kenya',
    clubs: ['ICT Club', 'Science Club'],
    bio: 'Class of 2010. Passionate about mentoring the next generation of Kenyan engineers.',
    yearLeft: 2010
  },
  {
    name: 'Samuel Mwangi',
    email: 'samuel@starehe.alumni',
    password: 'password123',
    role: 'alumnus',
    house: 'Geturo',
    stream: 'B',
    profession: 'Investment Banker',
    industry: 'Finance',
    location: 'London, UK',
    clubs: ['Business Club', 'Chess Club'],
    bio: 'Helping Starehians navigate the world of global finance.',
    yearLeft: 2008
  },
  {
    name: 'Faith Njoroge',
    email: 'faith@starehe.alumni',
    password: 'password123',
    role: 'alumnus',
    house: 'Ngala',
    stream: 'C',
    profession: 'Senior Medical Officer',
    industry: 'Healthcare',
    location: 'Mombasa, Kenya',
    clubs: ['Red Cross', 'St. Johns Ambulance'],
    bio: 'Committed to school health initiatives and medical mentorship.',
    yearLeft: 2012
  },
  {
    name: 'David Otieno',
    email: 'david@starehe.alumni',
    password: 'password123',
    role: 'alumnus',
    house: 'Gikubu',
    stream: 'A',
    profession: 'Civil Engineer',
    industry: 'Construction',
    location: 'Nairobi, Kenya',
    clubs: ['Scouts', 'Drama Club'],
    bio: 'Expert in infrastructure development. Class of 2005.',
    yearLeft: 2005
  },
  {
    name: 'Sarah Wambui',
    email: 'sarah@starehe.alumni',
    password: 'password123',
    role: 'alumnus',
    house: 'RoundSquare',
    stream: 'D',
    profession: 'Legal Counsel',
    industry: 'Law',
    location: 'Nairobi, Kenya',
    clubs: ['Debate Club', 'Interact'],
    bio: 'Mentoring future legal minds of Starehe.',
    yearLeft: 2014
  }
];

const students = [
  {
    name: 'Peter Njoroge',
    email: 'peter@starehe.student',
    password: 'password123',
    role: 'student',
    house: 'Patshaw',
    stream: 'A',
    clubs: ['ICT Club', 'Badminton'],
    bio: 'Form 4 student interested in Computer Science.',
    yearJoined: 2021
  },
  {
    name: 'Kevin Kipchumba',
    email: 'kevin@starehe.student',
    password: 'password123',
    role: 'student',
    house: 'Kibaki',
    stream: 'B',
    clubs: ['Football', 'Drama'],
    bio: 'Passionate about sports and creative arts.',
    yearJoined: 2022
  },
  {
    name: 'Brian Mutua',
    email: 'brian@starehe.student',
    password: 'password123',
    role: 'student',
    house: 'Njonjo',
    stream: 'C',
    clubs: ['Science Club', 'Scouts'],
    bio: 'Aspiring doctor and current Form 3 student.',
    yearJoined: 2023
  },
  {
    name: 'Fahim',
    email: 'fahim@starehe.com',
    password: 'password123',
    role: 'student',
    house: 'Patshaw',
    stream: 'A',
    clubs: ['ICT Club', 'Science Club'],
    bio: 'Mentorship platform developer and student at Starehe.',
    yearJoined: 2024
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users to start fresh
    await User.deleteMany({});
    console.log('Cleared existing users.');

    const salt = await bcrypt.genSalt(10);
    const users = [...alumni, ...students].map(async (u) => {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    });

    const hashedUsers = await Promise.all(users);
    await User.insertMany(hashedUsers);

    console.log(`Successfully seeded ${hashedUsers.length} users.`);
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
