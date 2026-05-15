export const FEED = [
  { id: 1, init: 'AO', avc: 'teal', name: 'Amara Odhiambo', role: 'Software Engineer @ Safaricom', time: '2h ago', text: 'Just wrapped up a mentorship session with three Form 4 students interested in tech. Proud of how much they have grown! Reach out if you want to connect.', type: 'update', likes: 14, liked: false, comments: 3 },
  { id: 2, init: 'BM', avc: 'blue', name: 'Brian Mwangi', role: 'Investment Analyst @ KCB', time: '5h ago', text: 'KCB is hiring interns for their digital banking team. Preference for Starehe alumni. DM me for a referral letter.', type: 'job', likes: 31, liked: false, comments: 7 },
  { id: 3, init: 'GN', avc: 'coral', name: 'Grace Njeri', role: 'Lecturer @ University of Nairobi', time: '1d ago', text: 'Published my first academic paper on STEM education in Kenyan secondary schools. Happy to share the draft with anyone interested in education research.', type: 'achievement', likes: 52, liked: false, comments: 12 },
  { id: 4, init: 'DN', avc: 'purple', name: 'Daniel Njoroge', role: 'Advocate @ High Court', time: '2d ago', text: 'Reminder: the Kenya Law Society is accepting applications for the 2025 junior advocates programme. Deadline is June 30. I can review your application.', type: 'alert', likes: 28, liked: false, comments: 5 },
  { id: 5, init: 'EW', avc: 'amber', name: 'Esther Wanjiku', role: 'Civil Engineer @ KENHA', time: '3d ago', text: 'Attended the East Africa Infrastructure Summit in Kigali. Fascinating conversations on sustainable construction. Our old Starehe engineering club days prepared me more than I realised.', type: 'update', likes: 19, liked: false, comments: 4 },
]

export const ALUMNI = [
  { init: 'AO', avc: 'teal',   name: 'Amara Odhiambo', role: 'Software Engineer',   co: 'Safaricom',          house: 'Kahawa', year: '2018', loc: 'Nairobi', field: 'Technology' },
  { init: 'BM', avc: 'blue',   name: 'Brian Mwangi',    role: 'Investment Analyst',  co: 'KCB Bank',           house: 'Thika',  year: '2016', loc: 'Nairobi', field: 'Finance' },
  { init: 'CK', avc: 'coral',  name: 'Cynthia Kamau',   role: 'Medical Doctor',      co: 'Kenyatta Hospital',  house: 'Nairobi',year: '2014', loc: 'Nairobi', field: 'Medicine' },
  { init: 'DN', avc: 'purple', name: 'Daniel Njoroge',  role: 'Advocate',            co: 'High Court',         house: 'Mara',   year: '2015', loc: 'Nairobi', field: 'Law' },
  { init: 'EW', avc: 'amber',  name: 'Esther Wanjiku',  role: 'Civil Engineer',      co: 'KENHA',              house: 'Athi',   year: '2019', loc: 'Nairobi', field: 'Engineering' },
  { init: 'FO', avc: 'blue',   name: 'Felix Otieno',    role: 'Entrepreneur',        co: 'Self-employed',      house: 'Ruiru',  year: '2012', loc: 'Kisumu',  field: 'Entrepreneurship' },
  { init: 'GN', avc: 'coral',  name: 'Grace Njeri',     role: 'Lecturer',            co: 'Univ. of Nairobi',   house: 'Kahawa', year: '2013', loc: 'Nairobi', field: 'Education' },
  { init: 'HK', avc: 'purple', name: 'Hassan Kimani',   role: 'Data Scientist',      co: 'M-Pesa Africa',      house: 'Thika',  year: '2017', loc: 'London',  field: 'Technology' },
  { init: 'IW', avc: 'teal',   name: 'Irene Wangari',   role: 'Public Health Officer',co: 'WHO Kenya',         house: 'Mara',   year: '2016', loc: 'Geneva',  field: 'Medicine' },
  { init: 'JO', avc: 'amber',  name: 'James Oduya',     role: 'Architect',           co: 'Studio Dunga',       house: 'Athi',   year: '2015', loc: 'Nairobi', field: 'Engineering' },
]

export const JOBS = [
  { id: 1, co: 'Safaricom',       init: 'SF', avc: 'teal',   title: 'Software Engineering Intern',      type: 'Internship', loc: 'Nairobi', field: 'Technology',    deadline: 'Jun 20', alumni: 'Amara Odhiambo' },
  { id: 2, co: 'KCB Bank',        init: 'KB', avc: 'blue',   title: 'Graduate Analyst — Digital Banking',type: 'Full-time',  loc: 'Nairobi', field: 'Finance',       deadline: 'Jun 30', alumni: 'Brian Mwangi' },
  { id: 3, co: 'KENHA',           init: 'KH', avc: 'amber',  title: 'Junior Civil Engineer',            type: 'Full-time',  loc: 'Nairobi', field: 'Engineering',   deadline: 'Jul 5',  alumni: 'Esther Wanjiku' },
  { id: 4, co: 'NMG',             init: 'NM', avc: 'purple', title: 'Editorial Intern',                 type: 'Internship', loc: 'Nairobi', field: 'Media',         deadline: 'Jun 15', alumni: 'Grace Njeri' },
  { id: 5, co: 'Strathmore Univ.',init: 'SU', avc: 'coral',  title: 'Research Assistant',               type: 'Contract',   loc: 'Nairobi', field: 'Academia',      deadline: 'Jul 10', alumni: 'Grace Njeri' },
  { id: 6, co: 'Andela',          init: 'AN', avc: 'teal',   title: 'Backend Developer',                type: 'Full-time',  loc: 'Remote',  field: 'Technology',    deadline: 'Jun 25', alumni: null },
]

export const EVENTS = [
  { id: 1, mon: 'Jun', day: '12', title: 'Tech careers webinar',      desc: 'Alumni panel: breaking into tech from a Kenyan university.',       type: 'Webinar',   rsvp: false },
  { id: 2, mon: 'Jun', day: '20', title: 'Annual alumni homecoming',  desc: 'Gathering at Starehe Boys Centre. Networking dinner and tour.',    type: 'In-person', rsvp: false },
  { id: 3, mon: 'Jul', day: '3',  title: 'CV & interview bootcamp',   desc: 'Full-day workshop. Alumni mentors give live CV feedback.',         type: 'Workshop',  rsvp: false },
  { id: 4, mon: 'Jul', day: '14', title: 'Finance & investing 101',   desc: 'Brian Mwangi on personal finance, investing and banking careers.', type: 'Webinar',   rsvp: false },
  { id: 5, mon: 'Aug', day: '2',  title: 'Entrepreneurship summit',   desc: 'Felix Otieno and four alumni entrepreneurs share their journeys.', type: 'In-person', rsvp: false },
]

export const RESOURCES = [
  { id: 1, icon: 'FileText',  bg: '#E1F5EE', ic: '#085041', title: 'CV writing guide for Kenyan students',        type: 'Guide',     author: 'Career team',    reads: '1.2k' },
  { id: 2, icon: 'GraduationCap', bg: '#E6F1FB', ic: '#042C53', title: 'University application checklist 2025',  type: 'Checklist', author: 'Grace Njeri',    reads: '874' },
  { id: 3, icon: 'TrendingUp',bg: '#FAEEDA', ic: '#412402', title: 'Breaking into investment banking in Kenya',   type: 'Article',   author: 'Brian Mwangi',   reads: '2.1k' },
  { id: 4, icon: 'Code2',     bg: '#EEEDFE', ic: '#26215C', title: 'Roadmap: becoming a software engineer',       type: 'Roadmap',   author: 'Amara Odhiambo', reads: '3.4k' },
  { id: 5, icon: 'Heart',     bg: '#FAECE7', ic: '#4A1B0C', title: 'Medicine vs. nursing: a guide for Form 4',   type: 'Guide',     author: 'Cynthia Kamau',  reads: '956' },
]

export const SCHOLARSHIPS = [
  { id: 1, title: 'Kenya Education Fund — STEM Scholarship', amount: 'KES 150,000/yr', deadline: 'Jun 30, 2025', field: 'Sciences',      open: true },
  { id: 2, title: 'Mastercard Foundation Scholars Programme', amount: 'Full scholarship', deadline: 'Jul 15, 2025', field: 'All streams',  open: true },
  { id: 3, title: 'Aga Khan Foundation Bursary',              amount: 'KES 80,000/yr',  deadline: 'Aug 1, 2025',  field: 'Arts & Commerce', open: true },
  { id: 4, title: 'British Council Kenya — Study in UK Grant',amount: 'GBP 5,000',      deadline: 'Sep 10, 2025', field: 'All streams',   open: true },
]

export const LEADERBOARD = [
  { init: 'AO', avc: 'teal',   name: 'Amara Odhiambo', house: 'Kahawa', pts: 920, sessions: 18 },
  { init: 'GN', avc: 'coral',  name: 'Grace Njeri',    house: 'Kahawa', pts: 870, sessions: 16 },
  { init: 'BM', avc: 'blue',   name: 'Brian Mwangi',   house: 'Thika',  pts: 810, sessions: 14 },
  { init: 'CK', avc: 'coral',  name: 'Cynthia Kamau',  house: 'Nairobi',pts: 760, sessions: 13 },
  { init: 'EW', avc: 'amber',  name: 'Esther Wanjiku', house: 'Athi',   pts: 700, sessions: 11 },
]

export const HOUSE_LEADERBOARD = [
  { house: 'Kahawa', pts: 3420, color: '#1D9E75' },
  { house: 'Thika',  pts: 2980, color: '#378ADD' },
  { house: 'Nairobi',pts: 2750, color: '#7F77DD' },
  { house: 'Athi',   pts: 2410, color: '#EF9F27' },
  { house: 'Mara',   pts: 2200, color: '#D85A30' },
  { house: 'Ruiru',  pts: 1980, color: '#D4537E' },
]

export const BADGES = [
  { icon: 'Heart',        name: 'First connection',    earned: true  },
  { icon: 'MessageCircle',name: '5 sessions',          earned: true  },
  { icon: 'Star',         name: 'Top mentor',          earned: false },
  { icon: 'Home',         name: 'House pride',         earned: true  },
  { icon: 'Briefcase',    name: 'Job posted',          earned: false },
  { icon: 'Calendar',     name: 'Event host',          earned: false },
  { icon: 'Trophy',       name: 'Leaderboard top 3',   earned: false },
  { icon: 'BookOpen',     name: 'Resource author',     earned: false },
]

export const MAP_DOTS = [
  { x: 52, y: 58, label: 'Nairobi',     count: 61, color: '#1D9E75' },
  { x: 49, y: 52, label: 'Kisumu',      count: 8,  color: '#378ADD' },
  { x: 58, y: 55, label: 'Mombasa',     count: 5,  color: '#378ADD' },
  { x: 30, y: 20, label: 'London',      count: 12, color: '#7F77DD' },
  { x: 20, y: 22, label: 'New York',    count: 7,  color: '#7F77DD' },
  { x: 38, y: 24, label: 'Geneva',      count: 4,  color: '#7F77DD' },
  { x: 65, y: 55, label: 'Dar es Salaam', count: 3, color: '#EF9F27' },
  { x: 62, y: 48, label: 'Kampala',     count: 5,  color: '#EF9F27' },
]

export const MATCHING_ALUMNI = [
  { id: 1, name: 'Amara Odhiambo', role: 'Software Engineer @ Safaricom', house: 'Kahawa', stream: 'Sciences', clubs: ['Coding', 'Chess'],    goals: ['Corporate career', 'Entrepreneurship'], industry: 'Technology',    gradYear: '2018', availability: 'Monthly check-ins', mentmode: 'Remote (online)',    init: 'AO', avc: 'teal' },
  { id: 2, name: 'Brian Mwangi',   role: 'Investment Analyst @ KCB',      house: 'Thika',  stream: 'Commerce', clubs: ['Debate', 'Chess'],    goals: ['Corporate career'],                     industry: 'Finance',       gradYear: '2016', availability: 'Monthly check-ins', mentmode: 'In-person (Nairobi)', init: 'BM', avc: 'blue' },
  { id: 3, name: 'Cynthia Kamau',  role: 'Medical Doctor @ KNH',          house: 'Nairobi',stream: 'Sciences', clubs: ['Scouts', 'Football'], goals: ['Academia / research'],                  industry: 'Medicine',      gradYear: '2014', availability: 'Ad hoc / as needed',mentmode: 'Either',             init: 'CK', avc: 'coral' },
  { id: 4, name: 'Daniel Njoroge', role: 'Advocate @ High Court',         house: 'Mara',   stream: 'Arts',     clubs: ['Debate', 'Drama'],    goals: ['Public service'],                       industry: 'Law',           gradYear: '2015', availability: 'Weekly check-ins',  mentmode: 'Either',             init: 'DN', avc: 'purple' },
  { id: 5, name: 'Esther Wanjiku', role: 'Civil Engineer @ KENHA',        house: 'Athi',   stream: 'Sciences', clubs: ['Coding','Environmental'],goals: ['Public service'],                    industry: 'Engineering',   gradYear: '2019', availability: 'Monthly check-ins', mentmode: 'In-person (Nairobi)', init: 'EW', avc: 'amber' },
  { id: 6, name: 'Felix Otieno',   role: 'Entrepreneur & Founder',        house: 'Ruiru',  stream: 'Commerce', clubs: ['Football', 'Music'],  goals: ['Entrepreneurship', 'Corporate career'], industry: 'Entrepreneurship',gradYear:'2012', availability: 'Ad hoc / as needed',mentmode: 'Remote (online)',    init: 'FO', avc: 'blue' },
  { id: 7, name: 'Grace Njeri',    role: 'Lecturer @ Univ. of Nairobi',   house: 'Kahawa', stream: 'Arts',     clubs: ['Drama','Photography'],goals: ['Academia / research', 'Creative arts'], industry: 'Education',     gradYear: '2013', availability: 'Weekly check-ins',  mentmode: 'Either',             init: 'GN', avc: 'coral' },
]
