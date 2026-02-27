import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    linkedin: { type: String, required: true, trim: true },
    hrName: { type: String, required: true, trim: true },
    hrEmail: { type: String, required: true, trim: true },
    hrPhone: { type: String, required: true, trim: true },
    street: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
}, { timestamps: true });

// Hash password before saving
companySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
companySchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Company', companySchema);
