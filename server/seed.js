const mongoose = require('mongoose');
require('dotenv').config();

const Event       = require('./models/Event');
const Job         = require('./models/Job');
const Scholarship = require('./models/Scholarship');
const Resource    = require('./models/Resource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stareheConnect';

const EVENTS = [
  { title: 'Tech careers webinar',      description: 'Alumni panel: breaking into tech from a Kenyan university.', date: 'Jun 12', month: 'Jun', day: '12', type: 'Webinar',   approved: true },
  { title: 'Annual alumni homecoming',  description: 'Gathering at Starehe Boys Centre. Networking dinner and tour.', date: 'Jun 20', month: 'Jun', day: '20', type: 'In-person', approved: true },
  { title: 'CV & interview bootcamp',   description: 'Full-day workshop. Alumni mentors give live CV feedback.', date: 'Jul 3',  month: 'Jul', day: '3',  type: 'Workshop',  approved: true },
  { title: 'Finance & investing 101',   description: 'Personal finance, investing and banking careers.', date: 'Jul 14', month: 'Jul', day: '14', type: 'Webinar',   approved: true },
  { title: 'Entrepreneurship summit',   description: 'Alumni entrepreneurs share their journeys.', date: 'Aug 2',  month: 'Aug', day: '2',  type: 'In-person', approved: true },
];

const JOBS = [
  { title: 'Software Engineering Intern',       company: 'Safaricom',        location: 'Nairobi', type: 'Internship', field: 'Technology',  deadline: 'Jun 20', active: true },
  { title: 'Graduate Analyst — Digital Banking',company: 'KCB Bank',         location: 'Nairobi', type: 'Full-time',  field: 'Finance',     deadline: 'Jun 30', active: true },
  { title: 'Junior Civil Engineer',             company: 'KENHA',            location: 'Nairobi', type: 'Full-time',  field: 'Engineering', deadline: 'Jul 5',  active: true },
  { title: 'Editorial Intern',                  company: 'Nation Media Group',location: 'Nairobi', type: 'Internship', field: 'Media',       deadline: 'Jun 15', active: true },
  { title: 'Research Assistant',                company: 'Strathmore University', location: 'Nairobi', type: 'Contract', field: 'Academia',  deadline: 'Jul 10', active: true },
  { title: 'Backend Developer',                 company: 'Andela',           location: 'Remote',  type: 'Full-time',  field: 'Technology',  deadline: 'Jun 25', active: true },
];

const SCHOLARSHIPS = [
  { title: 'Kenya Education Fund — STEM Scholarship', amount: 'KES 150,000/yr', deadline: 'Jun 30, 2025', field: 'Sciences',       open: true },
  { title: 'Mastercard Foundation Scholars Programme', amount: 'Full scholarship', deadline: 'Jul 15, 2025', field: 'All streams',  open: true },
  { title: 'Aga Khan Foundation Bursary',              amount: 'KES 80,000/yr',  deadline: 'Aug 1, 2025',  field: 'Arts & Commerce', open: true },
  { title: 'British Council Kenya — Study in UK Grant', amount: 'GBP 5,000',     deadline: 'Sep 10, 2025', field: 'All streams',   open: true },
];

const RESOURCES = [
  { title: 'CV writing guide for Kenyan students',         type: 'Guide',     reads: 1200, approved: true },
  { title: 'University application checklist 2025',        type: 'Checklist', reads: 874,  approved: true },
  { title: 'Breaking into investment banking in Kenya',    type: 'Article',   reads: 2100, approved: true },
  { title: 'Roadmap: becoming a software engineer',        type: 'Roadmap',   reads: 3400, approved: true },
  { title: 'Medicine vs. nursing: a guide for Form 4',     type: 'Guide',     reads: 956,  approved: true },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing seed data
    await Promise.all([
      Event.deleteMany({}),
      Job.deleteMany({}),
      Scholarship.deleteMany({}),
      Resource.deleteMany({}),
    ]);
    console.log('Cleared existing seed data');

    await Event.insertMany(EVENTS);
    console.log(`Seeded ${EVENTS.length} events`);

    await Job.insertMany(JOBS);
    console.log(`Seeded ${JOBS.length} jobs`);

    await Scholarship.insertMany(SCHOLARSHIPS);
    console.log(`Seeded ${SCHOLARSHIPS.length} scholarships`);

    await Resource.insertMany(RESOURCES);
    console.log(`Seeded ${RESOURCES.length} resources`);

    console.log('\n✅ Seed complete');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
