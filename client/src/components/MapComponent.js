// MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './ToggleSwitch.css'; // External CSS for styling

const ToggleSwitch = ({ onToggle }) => {
  const [isToggled, setIsToggled] = useState(false); // Initialize state

  // Toggle state handler
  const toggleHandler = () => {
    setIsToggled(!isToggled); // Change the state
    onToggle(!isToggled); // Pass the new state to the parent if needed
  };

  return (
    <div className="toggle-container">
      <button className={`toggle-button ${isToggled ? 'on' : 'off'}`} onClick={toggleHandler}>
        <span className={`lever ${isToggled ? 'toggled' : ''}`}></span>
      </button>
    </div>
  );
};

const MapComponent = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  const [zoomLevel, setZoomLevel] = useState(5);

  const handleToggle = (isToggled) => {
    setZoomLevel(isToggled ? 10 : 5);
  };

  useEffect(() => {
    // Array of URLs of the GeoJSON files you want to fetch
    const geojsonFiles = [
      '/fl_florida_zip_codes_geo.min.json',   // Example file 1
      '/sc_south_carolina_zip_codes_geo.min.json',
      '/ga_georgia_zip_codes_geo.min.json',
      '/la_louisiana_zip_codes_geo.min.json',
      '/ms_mississippi_zip_codes_geo.min.json',
      '/nc_north_carolina_zip_codes_geo.min.json',
      '/tn_tennessee_zip_codes_geo.min.json',
      '/ky_kentucky_zip_codes_geo.min.json',
      '/va_virginia_zip_codes_geo.min.json',
      '/wv_west_virginia_zip_codes_geo.min.json',
      '/al_alabama_zip_codes_geo.min.json',
      '/dc_district_of_columbia_zip_codes_geo.min.json',
      '/ar_arkansas_zip_codes_geo.min.json'
    ];

    const fetchGeojsonData = async () => {
      try {
        // Fetch all GeoJSON files concurrently
        const responses = await Promise.all(
          geojsonFiles.map(url => fetch(url).then(response => response.json()))
        );
        
        // Combine all GeoJSON data into one array
        setGeojsonData(responses);
      } catch (error) {
        console.error("Error fetching GeoJSON files:", error);
      }
    };

    fetchGeojsonData();
  }, []);  

  const onEachFeature = (feature, layer) => {
    // Set interactivity for each zip code area
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: 'blue',
          fillColor: 'yellow',
          fillOpacity: 0.5,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'blue',
          fillColor: 'gray',
          fillOpacity: 0.2,
        });
      },
      click: (e) => {
        alert(`You clicked on zip code: ${feature.properties.zipcode}`);
      },
    });

    // Optionally, bind popup or tooltip with data
    layer.bindPopup(`Zip Code: ${feature.properties.zipcode}`);
  };

  const geoJsonStyle = {
    color: 'blue', // Set color to red
    weight: 1,        // Set the weight of the lines
    opacity: 0.7,      // Set opacity
    fillColor: 'gray',
    fillOpacity: .2
  };

  const toggleZoom = () => {
    setZoomLevel(zoomLevel === 5 ? 10 : 5); // Toggle between zoom levels 5 and 10
  };

  return (
    <div>
      {/* Lever toggle button */}
      

    <section style={{ position: 'absolute', width: '100%' }}>
      <div style={{ height: '750px', width: '750px', position: 'relative', margin: '0 auto', marginLeft: 80, }}>
        <MapContainer center={[33.5, -83.5]} zoom={5} style={{ height: '100%', width: '100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {geojsonData && <GeoJSON data={geojsonData} onEachFeature={onEachFeature} style={geoJsonStyle} />}
        </MapContainer>
      </div>
      <ToggleSwitch onToggle={handleToggle} />
    </section>
    </div>
  );
};

export default MapComponent;

