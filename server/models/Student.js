import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile:     { type: String, required: true, trim: true },
  dob:        { type: String, required: true },
  degree:     { type: String, required: true },
  branch:     { type: String, required: true },
  password:   { type: String, required: true, select: false },
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Student', studentSchema);
