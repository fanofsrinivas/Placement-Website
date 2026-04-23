const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.email);
  } else {
    const admin = await User.create({
      email: 'admin@nitw.ac.in',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
      isEmailVerified: true,
    });
    console.log('Admin created:', admin.email);
  }

  const existingTpo = await User.findOne({ role: 'tpo' });
  if (existingTpo) {
    console.log('TPO already exists:', existingTpo.email);
  } else {
    await User.create({
      email: 'tpo@nitw.ac.in',
      password: 'Tpo@1234',
      role: 'tpo',
      isVerified: true,
      isEmailVerified: true,
    });
    console.log('TPO created: tpo@nitw.ac.in');
  }

  const existingCoord = await User.findOne({ role: 'coordinator' });
  if (existingCoord) {
    console.log('Coordinator already exists:', existingCoord.email);
  } else {
    await User.create({
      email: 'coordinator@nitw.ac.in',
      password: 'Coord@1234',
      role: 'coordinator',
      isVerified: true,
      isEmailVerified: true,
      studentProfile: {
        firstName: 'Student',
        lastName: 'Coordinator',
        branch: 'Computer Science and Engineering',
        degree: 'B.Tech',
      },
    });
    console.log('Coordinator created: coordinator@nitw.ac.in');
  }

  // Seed one faculty coordinator per department
  const departmentFaculty = [
    { dept: 'Civil Engineering', code: 'CE', firstName: 'Civil', lastName: 'Faculty' },
    { dept: 'Electrical Engineering', code: 'EE', firstName: 'Electrical', lastName: 'Faculty' },
    { dept: 'Mechanical Engineering', code: 'ME', firstName: 'Mechanical', lastName: 'Faculty' },
    { dept: 'Electronics and Communication Engineering', code: 'ECE', firstName: 'ECE', lastName: 'Faculty' },
    { dept: 'Metallurgical and Materials Engineering', code: 'MME', firstName: 'Metallurgical', lastName: 'Faculty' },
    { dept: 'Chemical Engineering', code: 'CHE', firstName: 'Chemical', lastName: 'Faculty' },
    { dept: 'Computer Science and Engineering', code: 'CSE', firstName: 'CSE', lastName: 'Faculty' },
    { dept: 'Biotechnology', code: 'BT', firstName: 'Biotech', lastName: 'Faculty' },
    { dept: 'Electronics and Communication Engineering (VLSI Design and Technology)', code: 'VLSI', firstName: 'VLSI', lastName: 'Faculty' },
    { dept: 'Mathematics and Computing', code: 'MNC', firstName: 'MnC', lastName: 'Faculty' },
    { dept: 'Computer Science and Engineering (Artificial Intelligence & Data Science)', code: 'AIDS', firstName: 'AIDS', lastName: 'Faculty' },
    { dept: 'Integrated M.Sc. Mathematics', code: 'MSCM', firstName: 'MSc Math', lastName: 'Faculty' },
    { dept: 'Integrated M.Sc. Physics', code: 'MSCP', firstName: 'MSc Physics', lastName: 'Faculty' },
    { dept: 'Integrated M.Sc. Chemistry', code: 'MSCC', firstName: 'MSc Chemistry', lastName: 'Faculty' },
    { dept: 'Dual Degree - Chemical Engineering', code: 'DDCHE', firstName: 'DD Chemical', lastName: 'Faculty' },
    { dept: 'Dual Degree - Metallurgical and Materials Engineering', code: 'DDMME', firstName: 'DD Metallurgical', lastName: 'Faculty' },
  ];

  let facultyCreated = 0;
  let facultySkipped = 0;
  for (const fac of departmentFaculty) {
    const email = `faculty.${fac.code.toLowerCase()}@nitw.ac.in`;
    const existing = await User.findOne({ email });
    if (existing) {
      facultySkipped++;
      continue;
    }
    await User.create({
      email,
      password: 'Faculty@1234',
      role: 'faculty',
      isVerified: true,
      isEmailVerified: true,
      facultyProfile: {
        firstName: fac.firstName,
        lastName: fac.lastName,
        employeeId: `FAC-${fac.code}`,
        designation: 'Professor',
        departments: [fac.dept],
      },
    });
    facultyCreated++;
  }
  console.log(`Faculty: ${facultyCreated} created, ${facultySkipped} already existed (1 per department)`);

  process.exit(0);
}

seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
