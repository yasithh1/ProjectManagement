import React, { useState, useEffect } from 'react';

function LaborInvoice() {
  const [requestId, setRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const empId = localStorage.getItem('empId');

  useEffect(() => {
    // Clean up the URL object on component unmount
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleGenerateInvoice = async () => {
    try {
      setErrorMessage('');
      const response = await fetch(`http://localhost:8081/api/labor-invoice/${requestId}/generate?empId=${empId}`);
      if (response.ok) {
        const blob = await response.blob();
        setPdfBlob(blob);
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
      } else {
        console.error('Failed to generate invoice');
        setErrorMessage('Failed to generate invoice.');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      setErrorMessage('Error generating invoice.');
    }
  };

  const handleDownloadInvoice = async () => {
    if (!pdfBlob) {
      setErrorMessage('No invoice generated to download.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', pdfBlob);
    formData.append('requestId', requestId);
    formData.append('empId', empId);

    try {
      const response = await fetch('http://localhost:8081/api/labor-invoice/save', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `labor-invoice-${requestId}.pdf`;
        a.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100); // Revoke after a short delay
        setErrorMessage('');
      } else {
        console.error('Failed to save invoice');
        setErrorMessage('Failed to save invoice.');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      setErrorMessage('Error saving invoice.');
    }
  };

  return (
    <div>
      <h1>Generate Labor Invoice</h1>
      <label>
        Request ID:
        <input
          type="number"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          placeholder="Enter request ID"
        />
      </label>
      <button onClick={handleGenerateInvoice}>Generate Invoice</button>
      <button onClick={handleDownloadInvoice}>Save and Download Invoice</button>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Invoice PDF Viewer"
        />
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default LaborInvoice;
