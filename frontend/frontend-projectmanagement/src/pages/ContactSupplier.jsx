import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/ContactSupplier.css';
import ContactFormModal from '../components/ContactFormModal';

const ContactSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState('');
  const [selectedSupplierProductName, setSelectedSupplierProductName] = useState('');
  const [requests, setRequests] = useState([]); // State to hold requests
  const [employeeDetails, setEmployeeDetails] = useState({}); // State to hold employee details

  useEffect(() => {
    // Fetch suppliers data from Spring Boot backend
    axios.get('http://localhost:8080/api/supplier/suppliers')
      .then(response => {
        setSuppliers(response.data);  // Set the fetched data
      })
      .catch(error => {
        console.error('There was an error fetching the supplier data!', error);
      });

    const empId = localStorage.getItem('empId'); // Get empId from local storage
    if (empId) {
      axios.get(`http://localhost:8081/api/employee/${empId}`)
        .then(response => {
          setEmployeeDetails(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the employee details!', error);
        });

      // Fetch requests for the employee
      axios.get(`http://localhost:8081/api10/employee/${empId}`)
        .then(response => {
          setRequests(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the requests!', error);
        });
    }
  }, []);

  const handleContactSupplier = (supplierEmail, supplierProductName) => {
    setSelectedSupplierEmail(supplierEmail);
    setSelectedSupplierProductName(supplierProductName);
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const getStatusColor = (status) => {
    return status === 'Rejected' ? 'red' : status === 'Accepted' ? 'green' : 'black';
  };

  return (
    <div className="contact-supplier-page">
      <div className="contact-supplier-header">
        <h2>Contact Supplier</h2>
        <p>Manage all your supplier contacts here.</p>
      </div>

      <div className="suppliers-list">
        <h3>Suppliers</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Product Name</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.firstName} {supplier.lastName}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phoneNumber}</td>
                <td>{supplier.productName}</td>
                <td>
                  <button onClick={() => handleContactSupplier(supplier.email, supplier.productName)}>
                    Contact
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Requests */}
      <div className="requests-list">
        <h3>Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.productName}</td>
                <td>{request.supplierEmail}</td>
                <td style={{ color: getStatusColor(request.status) }}>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        supplierEmail={selectedSupplierEmail}
        supplierProductName={selectedSupplierProductName}
      />
    </div>
  );
};

export default ContactSupplier;
