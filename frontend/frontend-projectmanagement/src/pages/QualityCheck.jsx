import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import '../style/QualityCheck.css';

function QualityCheck() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [totalRealBudget, setTotalRealBudget] = useState(0);
  const [adjustedBudget, setAdjustedBudget] = useState(10000000); // Example initial budget

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/projects/all');
        const allProjects = response.data;
        const completedProjects = allProjects.filter(project => project.status === 'Complete');
        setProjects(completedProjects);
        setFilteredProjects(completedProjects);
        const totalBudget = completedProjects.reduce((total, project) => total + project.realBudget, 0);
        setTotalRealBudget(totalBudget);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = () => {
    const filtered = projects.filter(project =>
      project.oProjectId && project.oProjectId.toString().includes(searchTerm)
    );
    setFilteredProjects(filtered);
  };

  const handleDownload = (fileData, fileName) => {
    const blob = new Blob([fileData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBudgetAdjustment = (event) => {
    setAdjustedBudget(event.target.value);
  };

  const doughnutData = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [totalRealBudget, adjustedBudget - totalRealBudget],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const renderBarChart = (project) => {
    const data = {
      labels: ['Expected Budget', 'Real Budget', 'Savings'],
      datasets: [
        {
          label: 'Amount in Rs.',
          data: [project.expectedBudget, project.realBudget, project.expectedBudget - project.realBudget],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        x: { display: false },
        y: { display: false },
      },
      plugins: {
        legend: { display: false },
      },
      elements: {
        point: { radius: 0 },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <div className="quality-check-container">
      <h2>Quality Check</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Project ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="budget-overview">
        <h3>Total Real Budget: Rs. {totalRealBudget}.00</h3>
        <input
          type="number"
          value={adjustedBudget}
          onChange={handleBudgetAdjustment}
          placeholder="Adjust Budget"
        />
        <div className="doughnut-chart">
          <Doughnut data={doughnutData} />
        </div>
      </div>
      {filteredProjects.map((project) => {
        const savings = project.expectedBudget - project.realBudget;
        const savingsPercentage = ((savings / project.expectedBudget) * 100).toFixed(2);

        return (
          <div key={project.oProjectId} className="project-card">
            <h3>{project.projectName} (ID: {project.oProjectId})</h3>
            <p><strong>Supervisor:</strong> {project.supervisor}</p>
            <div className="budget-details">
              <p><strong>Real Budget:</strong> Rs. {project.realBudget}.00</p>
              <div className="line-bar">{renderBarChart(project)}</div>
            </div>
            <div className="budget-details">
              <p><strong>Expected Budget:</strong> Rs. {project.expectedBudget}.00</p>
              <div className="line-bar">{renderBarChart(project)}</div>
            </div>
            <div className="budget-details">
              <p><strong className="highlight">Savings:</strong> Rs. {savings}.00</p>
              <div className="line-bar">{renderBarChart(project)}</div>
            </div>
            <div className="budget-details">
              <p><strong>Savings Percentage:</strong> {savingsPercentage}%</p>
              <div className="line-bar">{renderBarChart(project)}</div>
            </div>
            <p><strong>Expected Time:</strong> {new Date(project.expectedTime).toDateString()}</p>
            <p><strong className="highlight">End Time:</strong> {project.endTime ? new Date(project.endTime).toDateString() : 'N/A'}</p>
            <p><strong>Vendor Invoice:</strong> {project.vendorInvoice ? <button onClick={() => handleDownload(project.vendorInvoice, `vendor-invoice-${project.oProjectId}.pdf`)}>Download</button> : 'N/A'}</p>
            <p><strong>Supplier Invoice:</strong> {project.supplierInvoice ? <button onClick={() => handleDownload(project.supplierInvoice, `supplier-invoice-${project.oProjectId}.pdf`)}>Download</button> : 'N/A'}</p>
            <p><strong>Appendices:</strong> {project.appendices ? <button onClick={() => handleDownload(project.appendices, `appendices-${project.oProjectId}.pdf`)}>Download</button> : 'N/A'}</p>
          </div>
        );
      })}
    </div>
  );
}

export default QualityCheck;
