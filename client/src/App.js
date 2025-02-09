// src/App.js
import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <section style={{height:'100%', width:'100%', backgroundcolor: '#f9f0cc'}}>
    <div className="App">
      <h1>Climate-Ready Planting: Interactive Map of Future Hardiness Zones</h1>
      <MapComponent />
    </div>
    </section>
  );
}

export default App;
