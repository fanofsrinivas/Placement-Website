import "./filter.css";

const FilterSection = ({ year, setYear }) => {
  return (
    <div className="filter-wrapper">
      <div className="filter-card">

        <label className="filter-label">
          Select Academic Year
        </label>

        <select
          className="filter-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          <option value={2024}>2024-25</option>
          <option value={2023}>2023-24</option>
        </select>

      </div>
    </div>
  );
};

export default FilterSection;