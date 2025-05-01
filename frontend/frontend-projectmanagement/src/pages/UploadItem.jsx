import React, { useState } from 'react';
import '../style/UploadItem.css';
import axios from 'axios';

const UploadItem = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !productName || !quantity || !category) {
      console.log('Please fill all the fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('productName', productName);
    formData.append('quantity', quantity);
    formData.append('category', category);

    try {
      const response = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully.');

      // Clear the input fields after upload
      setFile(null);
      setProductName('');
      setQuantity('');
      setCategory('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div className="upload-item-container">
      <h2>Upload Item Image</h2>
      <input type="file" onChange={handleFileChange} />
      <input 
        type="text" 
        placeholder="Product Name" 
        value={productName} 
        onChange={(e) => setProductName(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Quantity" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Category Type" 
        value={category} 
        onChange={(e) => setCategory(e.target.value)} 
      />
      <button onClick={handleUpload}>Upload</button>
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
};

export default UploadItem;
