import { motion } from "framer-motion";
import "./jobroles.css";

const JobRolesGraph = ({ data }) => {

  // fallback safety
  const jobData = data || [];

  // total students
  const totalStudents = jobData.reduce(
    (acc, curr) => acc + (curr.count || 0),
    0
  );

  return (
    <div className="job-roles-left-wrapper">

      <div className="jobroles-section">

        <div className="arc-viz">

          <div className="bg-glow-light"></div>

          <motion.div 
            className="glass-hub-light"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
          >
            <div className="hub-inner">
              <span className="hub-tag">Career Paths</span>
              <h2 className="hub-title">Job Roles</h2>

              <div className="hub-total-wrap">
                <span className="hub-count">{totalStudents}</span>
                <span className="hub-sub">Students</span>
              </div>
            </div>
          </motion.div>

          {jobData.map((item, index) => {
            const angle =
              (180 + (index * (180 / (jobData.length - 1 || 1)))) *
              (Math.PI / 180);

            const radius = 220;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={index}
                className="role-anchor"
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                whileInView={{ x: x, y: y, scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 12,
                  delay: index * 0.1
                }}
              >
                <div
                  className="role-line-light"
                  style={{
                    background: `linear-gradient(to top, #dfe4ea, ${item.color || "#0984e3"})`
                  }}
                ></div>

                <motion.div
                  className="role-card-light"
                  whileHover={{ y: -10, scale: 1.05 }}
                  style={{ borderTopColor: item.color || "#0984e3" }}
                >
                  <div className="card-top">
                    <span className="card-number">{item.count}</span>
                  </div>

                  <div className="card-label">{item.role}</div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* RIGHT → TEXT */}
        <motion.div
          className="jobroles-highlight"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-title">Placement Insight</h4>
          <p>
            The strong participation of recruiters reflects the institute’s growing 
            industry engagement and the continued confidence of organizations in its graduates.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default JobRolesGraph;