import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';

function ProjectResources() {
  const [invoices, setInvoices] = useState([]);
  const [vendorInvoices, setVendorInvoices] = useState([]);
  const empId = localStorage.getItem('empId'); // get empId from local storage

  useEffect(() => {
    if (empId) {
      fetchInvoicesByCustomerName(empId); // Existing feature
      fetchInvoicesByEmployer(empId); // New feature
    }
  }, [empId]);

  const fetchInvoicesByCustomerName = async (customerName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/invoice/by-customer?customerName=${customerName}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        console.error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchInvoicesByEmployer = async (employer) => {
    try {
      const response = await fetch(`http://localhost:8081/api/labor-invoice/invoices/${employer}`); // Ensure the URL is correct
      if (response.ok) {
        const data = await response.json();
        setVendorInvoices(data);
      } else {
        console.error('Failed to fetch vendor invoices');
      }
    } catch (error) {
      console.error('Error fetching vendor invoices:', error);
    }
  };

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const viewInvoice = (pdfBase64) => {
    const pdfData = base64ToArrayBuffer(pdfBase64);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const downloadInvoice = (pdfBase64, customerName, item) => {
    const pdfData = base64ToArrayBuffer(pdfBase64);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    saveAs(blob, `${customerName}_${item}.pdf`);
  };

  const downloadVendorInvoice = (pdfBase64, employer, date) => {
    const pdfData = base64ToArrayBuffer(pdfBase64);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    saveAs(blob, `${employer}_${date}.pdf`);
  };

  return (
    <div>
      <h2>Supplier Invoices</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.customerName}</td>
              <td>{invoice.item}</td>
              <td>{invoice.quantity}</td>
              <td>{invoice.price}</td>
              <td>
                <button onClick={() => viewInvoice(invoice.pdfData)}>View</button>
                <button onClick={() => downloadInvoice(invoice.pdfData, invoice.customerName, invoice.item)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Vendor Invoices</h2>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Employer</th>
            <th>Date</th>
            <th>Project ID</th> {/* Add Project ID header */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendorInvoices.map((invoice) => (
            <tr key={invoice.vinvoiceId}>
              <td>{invoice.employer}</td>
              <td>{invoice.date}</td>
              <td>{invoice.projectId}</td> {/* Display Project ID */}
              <td>
                <button onClick={() => viewInvoice(invoice.pdf)}>View</button>
                <button onClick={() => downloadVendorInvoice(invoice.pdf, invoice.employer, invoice.date)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectResources;
