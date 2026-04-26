const BranchTable = ({ data }) => {
  return (
    <div className="section">
      <h2>Branch Wise Placement</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Students Placed</th>
            <th>Average CTC</th>
            <th>Highest CTC</th>
          </tr>
        </thead>
        <tbody>
          {data.map((branch, index) => (
            <tr key={index}>
              <td>{branch.name}</td>
              <td>{branch.placed}</td>
              <td>{branch.avg} LPA</td>
              <td>{branch.max} LPA</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BranchTable;