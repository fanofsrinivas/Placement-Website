import { motion } from "framer-motion";
import "./companies.css";

const CompaniesChart = ({ data }) => {

  // 🔹 Safe data
  const overview = data?.overview || {};

  // ✅ Backend value (correct)
  const totalCompanies = overview.companiesVisited || 0;

  // 🔥 FIXED ZIGZAG GRAPH (CONSTANT FOR ALL YEARS)
const graphPoints = "0,85 60,60 120,78 180,55 240,65 300,15";

  return (
    <div className="companies-right-wrapper">

      {/* 🔹 Card */}
      <motion.div 
        className="companies-card"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

        {/* Header */}
        <div className="card-header">
          <span className="live-indicator">
            <span className="dot"></span> Live Stats
          </span>
          <h3>Industry Reach</h3>
        </div>

        {/* 🔹 Graph */}
        <div className="graph-container">
          <svg viewBox ="0 0 300 100 "preserveAspectRatio = "none"className = "trend-svg">

            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0984e3" stopOpacity="0" />
                <stop offset="100%" stopColor="#0984e3" stopOpacity="1" />
              </linearGradient>
            </defs>

            <motion.polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              points={graphPoints}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* 🔹 Footer */}
        <div className="stats-footer">
          <motion.div 
            className="count-group"
            initial={{ scale: 0.5 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <span className="big-number">{totalCompanies}+</span>
            <span className="count-label">Companies Visited</span>
          </motion.div>

          <p className="sub-text">
            Strong recruiter participation this year
          </p>
        </div>

      </motion.div>

      {/* 🔹 Insight */}
      <motion.div
        className="companies-highlight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="text-title">Placement Insight</h4>
        <p>
          The strong participation of recruiters reflects the institute’s growing 
          industry engagement and continued confidence in its graduates.
        </p>
      </motion.div>

    </div>
  );
};

export default CompaniesChart;