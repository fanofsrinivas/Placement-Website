const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const BRANCH_MAP = {
    'CSE': 'Computer Science and Engineering',
    'ECE': 'Electronics and Communication Engineering',
    'EEE': 'Electrical Engineering',
    'EE': 'Electrical Engineering',
    'ME': 'Mechanical Engineering',
    'CE': 'Civil Engineering',
    'CHE': 'Chemical Engineering',
    'MME': 'Metallurgical and Materials Engineering',
    'BT': 'Biotechnology',
    'MSE': 'Metallurgical and Materials Engineering',
    'PHY': 'Integrated M.Sc. Physics',
    'CHEM': 'Integrated M.Sc. Chemistry',
    'MATH': 'Mathematics and Computing',
    'MnC': 'Mathematics and Computing',
    'CSE-AIML': 'Computer Science and Engineering (Artificial Intelligence & Data Science)',
    'ECE-VLSI': 'Electronics and Communication Engineering (VLSI Design and Technology)',
};

async function migrateBranches() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    let skipped = 0;

    for (const [oldCode, newName] of Object.entries(BRANCH_MAP)) {
        const result = await User.updateMany(
            { 'studentProfile.branch': oldCode },
            { $set: { 'studentProfile.branch': newName } }
        );
        if (result.modifiedCount > 0) {
            console.log(`  ${oldCode} → ${newName}: ${result.modifiedCount} records updated`);
            updated += result.modifiedCount;
        } else {
            skipped++;
        }
    }

    console.log(`\nMigration complete: ${updated} records updated, ${skipped} codes had no matches.`);
    process.exit(0);
}

migrateBranches().catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
});
