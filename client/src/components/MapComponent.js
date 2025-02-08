// MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    // Replace with the actual URL or path to your GeoJSON data
    const fetchGeojsonData = async () => {
      const response = await fetch('/fl_florida_zip_codes_geo.min.json');
      const data = await response.json();
      setGeojsonData(data);
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
          color: 'black',
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

  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geojsonData && <GeoJSON data={geojsonData} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

