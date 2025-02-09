import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ToggleSwitch.css'; // External CSS for styling

const MapUpdater = ({ zoom }) => {
  const map = useMap(); // Access the Leaflet map instance

  useEffect(() => {
    map.setZoom(zoom);  // Manually set the zoom level
  }, [zoom, map]);  // Effect will run when zoom changes

  return null; // This component doesn't render anything, just modifies the map
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(7);

  const handleToggle = (isToggled) => {
    setZoomLevel(isToggled ? 10 : 7);  // Toggle between zoom levels 7 and 10
  };

  // Fetch GeoJSON data from the server
  useEffect(() => {
    const fetchGeojsonData = async () => {
      try {
        const response = await fetch('/api/geojson-data'); // Fetch data from the API
        const data = await response.json();
        setGeojsonData(data);  // Set the GeoJSON data to state
        setIsLoading(false); // Set loading state to false once data is fetched
      } catch (error) {
        console.error("Error fetching GeoJSON files:", error);
        setIsLoading(false); // Stop loading if an error occurs
      }
    };

    fetchGeojsonData();
  }, []);  

  const onEachFeature = (feature, layer) => {
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
        alert(`You clicked on zip code: ${feature.properties.ZCTA5CE10}`);
      },
    });

    // Optionally, bind popup or tooltip with data
    layer.bindPopup(`Zip Code: ${feature.properties.ZCTA5CE10}`);
  };

  const geoJsonStyle = {
    color: 'blue', 
    weight: 1,
    opacity: 0.7, 
    fillColor: 'gray',
    fillOpacity: .2
  };

  return (
    <div>
      <section style={{ position: 'absolute', width: '100%' }}>
        <div style={{ height: '750px', width: '750px', position: 'relative', margin: '0 auto', marginLeft: 80 }}>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="loading-spinner">
              <span>Loading...</span> {/* You can add a spinner here */}
            </div>
          )}

          {/* Map Container */}
          <MapContainer
            center={[24.5, -81.5]}
            zoom={zoomLevel}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            whenReady={() => setIsLoading(false)} // Set loading to false when map is ready
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geojsonData && <GeoJSON data={geojsonData} onEachFeature={onEachFeature} style={geoJsonStyle} />}
            <MapUpdater zoom={zoomLevel} />
          </MapContainer>

        </div>
        <ToggleSwitch onToggle={handleToggle} />
      </section>
    </div>
  );
};

export default MapComponent;
