// Mapping between abbreviated branch codes and full branch names
// Used to ensure backward compatibility when checking eligibility

const BRANCH_ABBREV_TO_FULL = {
    'CSE': 'Computer Science and Engineering',
    'ECE': 'Electronics and Communication Engineering',
    'EEE': 'Electrical Engineering',
    'ME': 'Mechanical Engineering',
    'CE': 'Civil Engineering',
    'CHE': 'Chemical Engineering',
    'MME': 'Metallurgical and Materials Engineering',
    'BT': 'Biotechnology',
    'PHY': 'Integrated M.Sc. Physics',
    'CHEM': 'Integrated M.Sc. Chemistry',
    'MATH': 'Mathematics and Computing',
    'MSE': 'Metallurgical and Materials Engineering',
};

const BRANCH_FULL_TO_ABBREV = {};
for (const [abbrev, full] of Object.entries(BRANCH_ABBREV_TO_FULL)) {
    BRANCH_FULL_TO_ABBREV[full] = abbrev;
}

/**
 * Check if a student's branch matches any of the job's eligible branches.
 * Handles both abbreviated and full-name formats for backward compatibility.
 */
function branchMatches(studentBranch, eligibleBranches) {
    if (!eligibleBranches || eligibleBranches.length === 0) return true;
    if (!studentBranch) return false;

    // Direct match
    if (eligibleBranches.includes(studentBranch)) return true;

    // Try matching abbreviation -> full name
    const studentFull = BRANCH_ABBREV_TO_FULL[studentBranch];
    if (studentFull && eligibleBranches.includes(studentFull)) return true;

    // Try matching full name -> abbreviation
    const studentAbbrev = BRANCH_FULL_TO_ABBREV[studentBranch];
    if (studentAbbrev && eligibleBranches.includes(studentAbbrev)) return true;

    // Try expanding all eligible branches and matching
    const expandedEligible = eligibleBranches.map(b => BRANCH_ABBREV_TO_FULL[b] || b);
    if (expandedEligible.includes(studentBranch)) return true;

    const expandedEligibleAbbrev = eligibleBranches.map(b => BRANCH_FULL_TO_ABBREV[b] || b);
    if (expandedEligibleAbbrev.includes(studentBranch)) return true;

    return false;
}

module.exports = { BRANCH_ABBREV_TO_FULL, BRANCH_FULL_TO_ABBREV, branchMatches };
