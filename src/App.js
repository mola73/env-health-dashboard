import React from 'react'
import MapComponent from './Map'

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style = {{
       position: 'absolute',
       fontColor: 'black',
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: 'white',
        padding: '20px',
        margin: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        visibility:'hidden'
      }} >
        <div style= {{color:'black'}}>
        <h1 style={{ color: 'black'}}>Enviromental Hazards and Health Disparities</h1>
        <p>British Columbia Health Geography Analysis</p>
      </div>
      </header>
      <MapComponent/>
    </div>
  );
}

export default App;
