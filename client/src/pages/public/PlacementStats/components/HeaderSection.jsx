import { motion } from "framer-motion";

const HeaderSection = ({ data }) => {

  // extract year safely
  const year = data?.year || 2024;

  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 style={{ fontSize: "48px", textAlign: "center" }}>
        Placement Statistics
      </h1>

      {/* Dynamic Year */}
      <h2 style={{ textAlign: "center", color: "#6b7475" }}>
        Academic Year {year}-{year + 1}
      </h2>

      <p className="header-description">
        The National Institute of Technology Warangal has consistently maintained a strong placement record,
        reflecting the institute’s academic excellence and industry-oriented curriculum. Each year, 
        the institute attracts a diverse pool of recruiters from leading global and national 
        organizations across many sectors.

        The placement season for the academic year {year}-{year + 1} witnessed significant 
        participation from top recruiters, offering competitive compensation packages and 
        diverse career opportunities to students.
      </p>

    </motion.div>
  );
};

export default HeaderSection;