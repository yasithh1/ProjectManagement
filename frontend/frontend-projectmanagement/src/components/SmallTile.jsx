import React from 'react';
import '../style/SmallTile.css'; // Import the smaller tile CSS

function SmallTile({ tile, onClick }) {
  return (
    <div
      className="SmallTile"
      onClick={onClick}
      role="button"
      tabIndex={0}
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

export default SmallTile;
