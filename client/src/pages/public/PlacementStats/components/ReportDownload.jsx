import { motion } from "framer-motion";
import "./ReportDownload.css";

const ReportDownload = ({ pdfUrl, year = "2024-25" }) => {
  return (
    <div className="report-wrapper">

      <div className="report-header">
        <h1>Statistics Record: {year}</h1>
        <div className="underline"></div>
        <p>
          Explore the complete placement report for the academic session {year}. 
          <br/> You can view or download the detailed placement statistics.
        </p>
      </div>

      <motion.div
        className="report-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <div className="report-icon">
          📄
        </div>

        {/* Content */}
        <div className="report-content">
          <h3>Placement Report: {year}</h3>
          <p>Placement Report for the placement session {year}.</p>

          <div className="report-buttons">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn view"
            >
              🔗 View PDF
            </a>

            <a
              href={pdfUrl}
              download
              className="btn download"
            >
              ⬇ Download / Open
            </a>

          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default ReportDownload;