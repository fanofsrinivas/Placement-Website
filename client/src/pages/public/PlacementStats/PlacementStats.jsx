import { useEffect, useState } from "react";
import { api } from "../../../context/AuthContext";

import HeaderSection from "./components/HeaderSection";
import OverviewCards from "./components/OverviewCards";
import SalaryDistribution from "./components/SalaryDistribution";
import PlacementDashboard from "./components/PlacementDashboard";
import JobRolesGraph from "./components/JobRolesGraph";
import CompaniesChart from "./components/CompaniesChart";
import FilterSection from "./components/FilterSection";
import ReportDownload from "./components/ReportDownload";

import "./styles.css";



const PlacementStats = () => {
  const [year, setYear] = useState(2024);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacementData = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/public/placement-stats/${year}`);
        setData(res.data);

      } catch (error) {
        console.error("Error fetching placement data:", error);

        // fallback (until backend data added)
        setData({
          year,
          overview: {},
          companies: [],
          jobRoles: [],
          salaryDistribution: []
        });

      } finally {
        setLoading(false);
      }
    };

    fetchPlacementData();
  }, [year]);

  if (loading) {
    return (
      <div className="placement-container">
        <p style={{ textAlign: "center" }}>Loading placement data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="placement-container">
        <p style={{ textAlign: "center" }}>No placement data available</p>
      </div>
    );
  }

  return (
    <div className="placement-container">

      
      {FilterSection && (
        <FilterSection year={year} setYear={setYear} />
      )}

      <HeaderSection data={data} />

      <OverviewCards data={data.overview} />

      <JobRolesGraph data={data.jobRoles} />

      <CompaniesChart data={data} />

      <SalaryDistribution data={data.salaryDistribution} />

      <PlacementDashboard data={data} />

      <ReportDownload pdfUrl={data.reportPdfUrl} year={`${year}-${year + 1}`}/>
    </div>
  );
};


export default PlacementStats;