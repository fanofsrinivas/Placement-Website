import CountUp from "react-countup";
import { motion } from "framer-motion";

const OverviewCards = ({ data }) => {

  // fallback safety
  const overview = data || {};

  // dynamically build stats array
  const stats = [
    {
      title: "Highest CTC",
      value: overview.highestPackage || 0,
      suffix: " LPA",
    },
    {
      title: "Average CTC",
      value: overview.averagePackage || 0,
      suffix: " LPA",
    },
    {
      title: "Median CTC",
      value: overview.medianPackage || 0,
      suffix: " LPA",
    },
    {
      title: "Placement %",
      value: overview.PlacementPercentage || 0,
      suffix: "%",
    },
    {
      title: "Total Placed",
      value: overview.totalPlaced || 0,
      suffix: "👨‍🎓",
    },
  ];

  return (
    <div className="section">
      <div
        style={{
          display: "flex",
          gap: "25px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stats.map((item, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            style={{ width: "220px", textAlign: "center" }}
          >
            <h3>{item.title}</h3>

            <h2 style={{ color: "#00e0ff" }}>
              <CountUp
                end={Number(item.value)}
                duration={2}
                decimals={item.suffix === " LPA" ? 2 : 0}
              />
              {item.suffix}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;