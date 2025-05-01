import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../style/Map.css';

function Map() {
  const [markerDetails, setMarkerDetails] = useState(null);
  const [markerType, setMarkerType] = useState(''); // Marker type (outlet or proposal)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // Control side panel visibility
  const [locationId, setLocationId] = useState(''); // State for location ID input
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const sriLankaBounds = [
        [5.87, 79.65],
        [9.83, 81.95],
      ];

      const newMap = L.map('map', {
        maxBounds: sriLankaBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 7,
        maxZoom: 16,
      }).setView([7.8731, 80.7718], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(newMap);

      mapRef.current = newMap;
    }
  }, []);

  const fetchDataAndAddMarkers = async (url, type) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();

      const map = mapRef.current;
      if (map) {
        map.eachLayer((layer) => {
          if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
          }
        });

        const dataArray = Array.isArray(data) ? data : [data];

        dataArray.forEach(item => {
          const { latitude, longitude, district } = item.location || {};
          const details = item;

          if (latitude && longitude && district) {
            const markerColor = type === 'outlet'
              ? (details.profitStatus === 'Profitable' ? 'green' : details.profitStatus === 'medium' ? 'blue' : 'red')
              : 'purple';

            const customMarker = L.circleMarker([latitude, longitude], {
              color: markerColor,
              radius: 10,
              fillOpacity: 0.8,
            }).addTo(map)
              .bindPopup(`<b>${details.outletname || details.type}</b><br>${district}`);

            customMarker.on('click', () => {
              setMarkerDetails({
                ...details,
                latitude,
                longitude,
              });
              setMarkerType(type); // Set the marker type when clicked
              setIsSidePanelOpen(true); // Open the side panel
              map.flyTo([latitude, longitude], 15, { duration: 1 });
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again.');
    }
  };

  const fetchLocationById = async () => {
    const url = `http://localhost:8081/api3/find/${locationId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      const { latitude, longitude, district } = data.location || {};
      const details = data;

      if (latitude && longitude && district) {
        const map = mapRef.current;
        if (map) {
          map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
              map.removeLayer(layer);
            }
          });

          const markerColor = 'purple'; // Color for this marker type

          const customMarker = L.circleMarker([latitude, longitude], {
            color: markerColor,
            radius: 10,
            fillOpacity: 0.8,
          }).addTo(map)
            .bindPopup(`<b>${details.outletname || details.type}</b><br>${district}`);

          customMarker.on('click', () => {
            setMarkerDetails({
              ...details,
              latitude,
              longitude,
            });
            setMarkerType(''); // Set marker type if needed
            setIsSidePanelOpen(true); // Open the side panel
            map.flyTo([latitude, longitude], 15, { duration: 1 });
          });

          // Simulate marker click to open side panel immediately
          customMarker.fire('click');
        }
      } else {
        alert('Location details not found.');
      }
    } catch (error) {
      console.error('Error fetching location by ID:', error);
      alert('Failed to fetch location. Please try again.');
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([7.8731, 80.7718], 7, { duration: 1 });
    }
    setMarkerDetails(null);
    setMarkerType(''); // Reset marker type
    setIsSidePanelOpen(false); // Close the side panel when zooming out
  };

  return (
    <div className="map-container">
      <div className="tile-container">
        <SmallTile tile={{ name: 'Proposals', icon: 'lightbulb', color: '#FFD700' }} 
                   onClick={() => fetchDataAndAddMarkers('http://localhost:8081/api3/propose', 'proposal')} />
        <SmallTile tile={{ name: 'Outlets', icon: 'store', color: '#ADD8E6' }} 
                   onClick={() => fetchDataAndAddMarkers('http://localhost:8081/api3/outlet', 'outlet')} />
      </div>
      <div className={`map-wrapper ${isSidePanelOpen ? 'shrink' : ''}`}>
        <div id="map"></div>
        
        {/* Side Panel */}
        {isSidePanelOpen && (
          <div className="side-panel">
            <button onClick={handleZoomOut} className="zoom-out-btn">Zoom Out</button>
            <h2>{markerDetails.outletname || 'Proposal Details'}</h2>
            
            <p>Province: {markerDetails.location.province}</p>
            <p>District: {markerDetails.location.district}</p>
            {markerType === 'outlet' && (
              <>
                <p>Profit Status: {markerDetails.profitStatus || 'No profit status available'}</p>
                <p>Rent or Purchased: {markerDetails.rentPurchased || 'No profit status available'}</p>
              </>
            )}
            {markerType === 'proposal' && (
              <>
                <p>Proposal Details: {markerDetails.details || 'No additional details'}</p>
                <p>date: {markerDetails.date || 'No additional details'}</p>
                <p>Proposed By: {markerDetails.proposedBy || 'No additional details'}</p>
              </>
            )}
          </div>
        )}
      </div>
      <div className="location-input-container">
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Enter Location ID"
        />
        <button onClick={fetchLocationById}>Find Location</button>
      </div>
    </div>
  );
}

function SmallTile({ tile, onClick }) {
  return (
    <div 
      className="SmallTile" 
      onClick={onClick} 
      role="button" 
      tabIndex={0} 
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      style={{ backgroundColor: tile.color }}
    >
      <div className="SmallTile-icon">
        <span className="material-icons">{tile.icon}</span>
      </div>
      <div className="SmallTile-info">
        <h4>{tile.name}</h4>
      </div>
    </div>
  );
}

export default Map;
