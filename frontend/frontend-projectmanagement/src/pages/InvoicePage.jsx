import React, { useState } from 'react';
import axios from 'axios';
import '../style/InvoicePage.css';

const InvoicePage = () => {
  const [customerName, setCustomerName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);

  const handleGenerateInvoice = async () => {
    if (!customerName || !item || !quantity || !price || isNaN(price)) {
      alert('Please fill in all fields with valid data.');
      return;
    }

    const invoiceDetails = {
      customerName,
      item,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price)
    };

    try {
      const response = await axios.post('http://localhost:8080/api/invoice/generate', invoiceDetails, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      setInvoiceData(fileURL);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('There was an error generating the invoice. Please try again.');
    }
  };

  return (
    <div className="invoice-container">
      <h2>Generate Invoice</h2>
      <form>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            id="customerName"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="item">Item</label>
          <input
            type="text"
            id="item"
            placeholder="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
        </div>
        <button type="button" onClick={handleGenerateInvoice}>
          Generate
        </button>
      </form>
      {invoiceData && (
        <div className="success-message">
          <h3>Invoice Generated</h3>
          <iframe src={invoiceData} width="100%" height="600px" title="Generated Invoice"></iframe>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
