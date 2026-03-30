const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  const user = await User.findOne({ email: 'admin@nitw.ac.in' });
  if (!user) {
    console.log('User not found');
    process.exit(0);
  }

  console.log('User role:', user.role);
  console.log('Hashed Password:', user.password);

  const isMatch = await user.comparePassword('Admin@123');
  console.log('Password Match:', isMatch);

  process.exit(0);
}

checkLogin().catch(e => {
  console.error(e);
  process.exit(1);
});
