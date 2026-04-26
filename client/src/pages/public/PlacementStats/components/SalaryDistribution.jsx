import { motion } from "framer-motion";
import "./salary.css";

const SalaryDistribution = ({ data }) => {

  // fallback safety
  const salaryData = data || [];

  const totalStudents = salaryData.reduce(
    (acc, curr) => acc + (curr.count || 0),
    0
  );

  return (
    <section className="salary-right-wrapper">

      <div className="salary-container">

        {/* Center Circle */}
        <motion.div 
          className="center-hub"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <div className="hub-text">
            <span className="hub-title">Salary Distribution</span>
            <div className="hub-divider"></div>

            <span className="hub-number">{totalStudents}</span>
            <span className="hub-label">Total Students</span>
          </div>
        </motion.div>

        {/* Nodes */}
        {salaryData.map((item, index) => {

          const angle =
            (index * (360 / (salaryData.length || 1)) * Math.PI) / 180;

          const distance = 170;

          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          return (
            <motion.div
              key={index}
              className="salary-node"
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              whileInView={{ x, y, scale: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 70,
                damping: 14,
                delay: index * 0.05
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div
                className="node-circle"
                style={{ borderColor: item.color || "#0984e3" }}
              >
                <span
                  className="node-val"
                  style={{ color: item.color || "#0984e3" }}
                >
                  {item.count}
                </span>
              </div>

              <div className="node-text">{item.label}</div>
            </motion.div>
          );
        })}

      </div>

      {/* Insight */}
      <motion.div
        className="salary-highlight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="highlight-title">Placement Insight</h4>
        <p>
          The salary distribution highlights a strong presence of high-paying roles,
          reflecting the institute’s industry alignment and student performance across domains.
        </p>
      </motion.div>

    </section>
  );
};

export default SalaryDistribution;