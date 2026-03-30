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

  process.exit(0);
}

seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
