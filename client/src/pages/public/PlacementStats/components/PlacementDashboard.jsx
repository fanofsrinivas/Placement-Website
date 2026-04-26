import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PlacementDashboard.css";

const PlacementDashboard = ({ data }) => {

  const placementData = data?.branchData || {};

  const programs = Object.keys(placementData);

  const [activeTab, setActiveTab] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (programs.length > 0) {
      setActiveTab(programs[0]);
    }
  }, [placementData]);

  useEffect(() => {
    if (placementData[activeTab]) {
      setSelected(placementData[activeTab][0]);
    }
  }, [activeTab, placementData]);


  if (!selected) return null;


  const maxPlaced = Math.max(
    ...(placementData[activeTab]?.map(item => item.placed) || [1])
  );

  return (
    <div className="insights-wrapper">
      <h1 className="insights-title">Campus Placement Insights</h1>

      <div className="tab-navigation">
        {programs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="display-card-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.sName + activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="stat-card-main"
          >
            <div className="card-header">
              <div className="header-info">
                <span className="category-tag">{activeTab} PROGRAM</span>
                <h2>{selected.fName}</h2>
              </div>

              <div className="gender-summary">
                <div className="gender-card boys">
                  <div className="icon-box">♂</div>
                  <div className="gender-text">
                    <span className="label">Boys </span>
                    <span className="value">{selected.boys}</span>
                  </div>
                </div>

                <div className="gender-card girls">
                  <div className="icon-box">♀</div>
                  <div className="gender-text">
                    <span className="label">Girls </span>
                    <span className="value">{selected.girls}</span>
                  </div>
                </div>
              </div>

              <div className="placed-badge-box">
                <div className="placed-count">{selected.placed}</div>
                <div className="placed-label">Students Placed</div>
              </div>
            </div>

            {/* 🔹 Metrics */}
            <div className="metrics-grid">
              <div className="metric-item highlight">
                <span>Highest</span>
                <strong>{selected.max} <small>LPA</small></strong>
              </div>
              <div className="metric-item">
                <span>Average</span>
                <strong>{selected.avg} <small>LPA</small></strong>
              </div>
              <div className="metric-item">
                <span>Median</span>
                <strong>{selected.median} <small>LPA</small></strong>
              </div>
              <div className="metric-item">
                <span>Lowest</span>
                <strong>{selected.min} <small>LPA</small></strong>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🔹 Bar Chart */}
    <div className="chart-view-section">
      <div className="bar-chart-container">

        
          {placementData[activeTab]?.map((item, i) => (
            <div
              key={item.sName}
              className={`bar-group-item ${
                selected?.sName === item.sName ? "active" : ""
              }`}
              onClick={() => setSelected(item)}
            >
              <div className="bar-percentage">{item.perc}%</div>

              <div className="bar-track-line">
                <motion.div
                  className="bar-fill-element"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.perc}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>

              <span className="bar-short-name">{item.sName}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PlacementDashboard;