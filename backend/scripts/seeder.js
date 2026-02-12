// scripts/seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';

// Load Models
import User from '../models/userModel.js';
import Club from '../models/clubModel.js';
import Event from '../models/eventModel.js'; // <-- ADDED EVENT MODEL

// Load DB connection
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedData = async () => {
  // Define all user roles
  const usersToCreate = [
    {
      name: 'Admin User',
      email: 'admin@college.edu',
      password: await hashPassword('password123'),
      role: 'SuperAdmin',
    },
    {
      name: 'Priya Sharma (President)',
      email: 'priya.sharma@college.edu',
      password: await hashPassword('password123'),
      role: 'ClubPresident',
    },
    {
      name: 'Dr. Rajesh Kumar (Faculty)',
      email: 'rajesh.kumar@college.edu',
      password: await hashPassword('password123'),
      role: 'FacultyHead',
      department: 'Computer Science',
    },
    {
      name: 'Dr. Anjali Mehta (VC)',
      email: 'anjali.mehta@college.edu',
      password: await hashPassword('password123'),
      role: 'VC',
      department: 'Academics',
    },
    {
      name: 'Dr. Vikram Singh (HOD)',
      email: 'vikram.singh@college.edu',
      password: await hashPassword('password123'),
      role: 'HOD',
      department: 'Computer Science',
    },
    {
      name: 'Sunita Rao (Accountant)',
      email: 'sunita.rao@college.edu',
      password: await hashPassword('password123'),
      role: 'Accounts',
    },
    {
      name: 'Amit Desai (Venue Manager)',
      email: 'amit.desai@college.edu',
      password: await hashPassword('password123'),
      role: 'RoomAllotter',
    },
  ];
  
  const createdUsers = await User.insertMany(usersToCreate);
  
  const presidentUser = createdUsers.find(user => user.role === 'ClubPresident');
  const facultyUser = createdUsers.find(user => user.role === 'FacultyHead');
  
  const sampleClub = {
    name: 'AI & Robotics Club',
    department: 'Computer Science',
    presidentId: presidentUser._id,
    facultyHeadId: facultyUser._id,
  };
  
  const createdClub = await Club.create(sampleClub);

  presidentUser.assignedClubId = createdClub._id;
  facultyUser.assignedClubId = createdClub._id;
  await presidentUser.save();
  await facultyUser.save();
};

const importData = async () => {
  try {
    // Clear all existing data first
    await Event.deleteMany(); // <-- ADDED THIS LINE
    await User.deleteMany();
    await Club.deleteMany();
    
    // Insert new data
    await seedData();

    console.log('Data Imported! (All Roles & Clubs)'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all collections
    await Event.deleteMany(); // <-- ADDED THIS LINE
    await User.deleteMany();
    await Club.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}