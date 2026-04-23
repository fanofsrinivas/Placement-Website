const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        // Common fields
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            minlength: [8, 'Password must be at least 8 characters'],
        },
        role: {
            type: String,
            enum: ['student', 'company', 'admin', 'tpo', 'coordinator', 'faculty'],
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            code: String,
            expiresAt: Date,
            purpose: { type: String, enum: ['email_verify', 'login', 'password_reset'], default: 'email_verify' },
        },

        // Student-specific fields
        studentProfile: {
            firstName: String,
            lastName: String,
            rollNumber: String,
            branch: {
                type: String,
                enum: [
                    'Civil Engineering',
                    'Electrical Engineering',
                    'Mechanical Engineering',
                    'Electronics and Communication Engineering',
                    'Metallurgical and Materials Engineering',
                    'Chemical Engineering',
                    'Computer Science and Engineering',
                    'Biotechnology',
                    'Electronics and Communication Engineering (VLSI Design and Technology)',
                    'Mathematics and Computing',
                    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
                    'Integrated M.Sc. Mathematics',
                    'Integrated M.Sc. Physics',
                    'Integrated M.Sc. Chemistry',
                    'Dual Degree - Chemical Engineering',
                    'Dual Degree - Metallurgical and Materials Engineering',
                    'Other',
                ],
            },
            degree: {
                type: String,
                enum: ['B.Tech', 'M.Tech', 'MSc', 'MCA', 'PhD', 'Dual Degree', 'Integrated MSc'],
            },
            cgpa: {
                type: Number,
                min: [0, 'CGPA cannot be below 0'],
                max: [10, 'CGPA cannot exceed 10'],
            },
            activeBacklogs: { type: Number, default: 0 },
            tenthPercentage: Number,
            twelfthPercentage: Number,
            resumeUrl: String,
            resumePublicId: String,
            phone: String,
            gender: {
                type: String,
                enum: ['Male', 'Female', 'Other'],
            },
            dateOfBirth: Date,
            passingYear: Number,
            skills: [String],
            marksheetUrl: String,
            profileCompleted: {
                type: Number,
                default: 0, // percentage 0-100
            },
            isPlaced: { type: Boolean, default: false },
            placedCompany: String,
            placedPackage: Number,
        },

        // Company-specific fields
        companyProfile: {
            companyName: String,
            website: String,
            linkedIn: String,
            industry: String,
            description: String,
            logoUrl: String,
            logoPublicId: String,
            hrName: String,
            hrPhone: String,
            companySize: {
                type: String,
                enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'],
            },
            headquarters: String,
        },

        // Coordinator-specific fields
        coordinatorProfile: {
            departments: [{
                type: String,
                enum: [
                    'Civil Engineering',
                    'Electrical Engineering',
                    'Mechanical Engineering',
                    'Electronics and Communication Engineering',
                    'Metallurgical and Materials Engineering',
                    'Chemical Engineering',
                    'Computer Science and Engineering',
                    'Biotechnology',
                    'Electronics and Communication Engineering (VLSI Design and Technology)',
                    'Mathematics and Computing',
                    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
                    'Integrated M.Sc. Mathematics',
                    'Integrated M.Sc. Physics',
                    'Integrated M.Sc. Chemistry',
                    'Dual Degree - Chemical Engineering',
                    'Dual Degree - Metallurgical and Materials Engineering',
                    'Other',
                ],
            }],
        },

        // Faculty (Department Coordinator) specific fields
        facultyProfile: {
            firstName: String,
            lastName: String,
            employeeId: String,
            designation: {
                type: String,
                enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'HoD', 'Other'],
            },
            phone: String,
            departments: [{
                type: String,
                enum: [
                    'Civil Engineering',
                    'Electrical Engineering',
                    'Mechanical Engineering',
                    'Electronics and Communication Engineering',
                    'Metallurgical and Materials Engineering',
                    'Chemical Engineering',
                    'Computer Science and Engineering',
                    'Biotechnology',
                    'Electronics and Communication Engineering (VLSI Design and Technology)',
                    'Mathematics and Computing',
                    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
                    'Integrated M.Sc. Mathematics',
                    'Integrated M.Sc. Physics',
                    'Integrated M.Sc. Chemistry',
                    'Dual Degree - Chemical Engineering',
                    'Dual Degree - Metallurgical and Materials Engineering',
                    'Other',
                ],
            }],
        },
    },
    { timestamps: true }
);

// NITW email validation for students
userSchema.path('email').validate(function (value) {
    if (this.role === 'student') {
        return /@(student\.)?nitw\.ac\.in$/i.test(value);
    }
    return true;
}, 'Only official NIT Warangal email IDs (@nitw.ac.in) are allowed for students.');

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion for students
userSchema.methods.calculateProfileCompletion = function () {
    if (this.role !== 'student') return 100;
    const fields = [
        'firstName', 'lastName', 'rollNumber', 'branch', 'degree',
        'cgpa', 'phone', 'gender', 'dateOfBirth', 'passingYear', 'resumeUrl',
    ];
    const filled = fields.filter((f) => this.studentProfile && this.studentProfile[f]);
    const pct = Math.round((filled.length / fields.length) * 100);
    this.studentProfile.profileCompleted = pct;
    return pct;
};

module.exports = mongoose.model('User', userSchema);
