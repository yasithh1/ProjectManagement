import React, { useState, useEffect } from 'react';

const LaborReport = () => {
  const [requestId, setRequestId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [date, setDate] = useState('');
  const [empName, setEmpName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const empId = localStorage.getItem('empId');

  useEffect(() => {
    // Fetch employee name from empId if needed
    const fetchEmpName = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/employee/${empId}`);
        if (response.ok) {
          const data = await response.json();
          setEmpName(data.firstName + ' ' + data.lastName);
        } else {
          console.error('Failed to fetch employee details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmpName();
  }, [empId]);

  const handleFetchDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/labor-report/${requestId}`);
      if (response.ok) {
        const data = await response.json();
        setReceiver(data.receiver);
        setDate(data.date);
      } else {
        console.error('Failed to fetch request details');
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setErrorMessage('');
      const response = await fetch(`http://localhost:8081/api/labor-report/generate?requestId=${requestId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        console.error('Failed to generate report');
        setErrorMessage('Failed to generate report.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setErrorMessage('Error generating report.');
    }
  };

  return (
    <div>
      <h1>Generate Labor Report</h1>
      <div>
        <label>
          Request ID:
          <input
            type="number"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            placeholder="Enter request ID"
          />
        </label>
        <button onClick={handleFetchDetails}>Fetch Details</button>
      </div>
      {receiver && (
        <div>
          <p>Receiver: {receiver}</p>
          <p>Date: {date}</p>
          <p>Printed By: {empName}</p>
        </div>
      )}
      {pdfUrl ? (
        <>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Labor Report PDF"
          />
          <button onClick={() => saveAs(pdfUrl, `labor-report-${requestId}.pdf`)}>Download Report</button>
        </>
      ) : (
        <button onClick={handleGenerateReport}>Generate Report</button>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default LaborReport;
