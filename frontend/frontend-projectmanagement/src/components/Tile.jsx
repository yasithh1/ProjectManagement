import React from 'react';
import '../style/Tile.css';

function Tile({ tile, onClick }) {
    return (
        <div className="Tile" onClick={onClick} role="button" tabIndex={0} style={{backgroundColor: tile.color}}>
            <div className="Tile-icon">
                <span className="material-icons">{tile.icon}</span>
            </div>
            <div className="Tile-info">
                <h3>{tile.name}</h3>
            </div>
        </div>
    );
}

export default Tile;
