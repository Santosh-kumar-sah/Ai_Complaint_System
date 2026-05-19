// server/seed.js | Seed script for demo data | Author: SmartComplain | Date: 2026-05-19
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

dotenv.config();

const users = [
  { name: 'Admin User', email: 'admin@smartcomplain.com', password: 'Admin@123', role: 'admin' },
  { name: 'Rahul Kumar', email: 'user@smartcomplain.com', password: 'User@123', role: 'user' }
];

const complaints = [
  { title: 'Water Pipeline Burst', category: 'Water Supply', location: 'Ghaziabad', status: 'Pending', description: 'Main water pipeline has burst near sector 5 market causing flooding on roads and water wastage.' },
  { title: 'Street Light Not Working', category: 'Electricity', location: 'Noida', status: 'In Progress', description: 'All street lights in Block C have been non-functional for the past 2 weeks causing safety issues at night.' },
  { title: 'Garbage Not Collected', category: 'Sanitation', location: 'Delhi', status: 'Resolved', description: 'Garbage has not been collected from our colony for 10 days leading to unhygienic conditions.' },
  { title: 'Pothole on Main Road', category: 'Roads', location: 'Meerut', status: 'Pending', description: 'Large pothole on the main highway near bus stand causing accidents and traffic jams daily.' },
  { title: 'Theft in Residential Area', category: 'Public Safety', location: 'Ghaziabad', status: 'In Progress', description: 'Multiple thefts reported in Vasundhara sector 12 over last month with no police patrol visible.' },
  { title: 'Hospital Staff Negligence', category: 'Healthcare', location: 'Lucknow', status: 'Pending', description: 'Government hospital staff are rude and negligent towards patients causing serious health risks.' },
  { title: 'School Building Damaged', category: 'Education', location: 'Agra', status: 'Pending', description: 'Government primary school roof is damaged and leaking during rains putting children at risk.' },
  { title: 'Open Drainage Overflow', category: 'Sanitation', location: 'Noida', status: 'Rejected', description: 'Open drainage near residential area is overflowing causing foul smell and mosquito breeding.' }
];

const run = async () => {
  try {
    await connectDB();
    await Promise.all([User.deleteMany({}), Complaint.deleteMany({})]);

    const [admin, regular] = await User.create(users);
    const seededComplaints = complaints.map((complaint, index) => ({
      ...complaint,
      user: index % 2 === 0 ? admin._id : regular._id,
      name: index % 2 === 0 ? admin.name : regular.name,
      email: index % 2 === 0 ? admin.email : regular.email
    }));

    await Complaint.insertMany(seededComplaints);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

run();