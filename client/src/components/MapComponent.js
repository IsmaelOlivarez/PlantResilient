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
  const [reloadKey, setReloadKey] = useState(0); // Add a reload key to trigger re-render
  const [mode, setMode] = useState(2); // Track the current mode
  const [pollution, setPollution] = useState(true); // Keep track of the pollution state

  const hardinessMap = {
    "5b": "#5ec9e0",
    "6a": "#56bb48",
    "6b": "#78c756",
    "7a": "#abd669",
    "7b": "#cddb70",
    "8a": "#eeda85",
    "8b": "#ebcb57",
    "9a": "#dbb64f",
    "9b": "#f5b678",
    "10a": "#eb9d3d",
    "10b": "#e67937",
    "11a": "#e65733",
    "11b": "#e88564",
    "12a": "#d4594f",
    "12b": "#b62929"
  };

  const handleToggle = (isToggled) => {
    setZoomLevel(isToggled ? 10 : 7);  // Toggle between zoom levels 7 and 10

    // Change the reloadKey to force a re-render and reload the colors
    setReloadKey(prevKey => prevKey + 1);
  };

  // Add a function to handle the mode change
  const handleModeChange = () => {
    const newMode = mode === 2 ? 0 : mode + 1; // Toggle between 0, 1, 2 for the mode
    setMode(newMode); // Update mode
    setReloadKey(prevKey => prevKey + 1); // Trigger a re-render to reload the data
  };

  // Add a function to toggle pollution state
  const handlePollutionToggle = () => {
    setPollution(!pollution); // Toggle the pollution state
    setReloadKey(prevKey => prevKey + 1); // Trigger a re-render to reload the data
  };

  // Get mode description based on pollution and mode
  const getModeDescription = () => {
    if (!pollution) {
      switch (mode) {
        case 0:
          return 'Early Low -> 2010 - 2039';
        case 1:
          return 'Mid Low -> 2040 - 2069';
        case 2:
          return 'High Low -> 2070 - 2099';
        default:
          return '';
      }
    } else {
      switch (mode) {
        case 0:
          return 'Early High -> 2010 - 2039';
        case 1:
          return 'Mid High -> 2040 - 2069';
        case 2:
          return 'Late High -> 2070 - 2099';
        default:
          return '';
      }
    }
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

  const getStyle = (feature) => {
    // Default color
    const color = 'gray';
    
    return {
      color: 'red', // Border color
      weight: 0,
      opacity: 0.0,
      fillColor: color, // Default fill color (we'll update this asynchronously)
      fillOpacity: 0.7
    };
  };

  const onEachFeature = async (feature, layer) => {
    const zipCode = feature.properties.ZCTA5CE10;
    let color = 'gray';  // Default color in case of failure

    try {
      let response;
      if (pollution) {
        switch (mode) {
          case 0:
            response = await fetch(`/api/earlyHigh/${zipCode}`);
            break;
          case 1:
            response = await fetch(`/api/midHigh/${zipCode}`);
            break;
          case 2:
            response = await fetch(`/api/lateHigh/${zipCode}`);
            break;
          default:
            mode = 0;
            response = await fetch(`/api/earlyHigh/${zipCode}`);
        }
      } else {
        switch (mode) {
          case 0:
            response = await fetch(`/api/earlyLow/${zipCode}`);
            break;
          case 1:
            response = await fetch(`/api/midLow/${zipCode}`);
            break;
          case 2:
            response = await fetch(`/api/lateLow/${zipCode}`);
            break;
          default:
            mode = 0;
            response = await fetch(`/api/earlyLow/${zipCode}`);
        }
      }

      if (response.ok) {
        const data = await response.json();
        const zone = data.zone;
        console.log("Fetched Zone:", zone);
        color = hardinessMap[zone] || 'gray'; // Use the corresponding color for the zone
      }
    } catch (error) {
      console.error("Error fetching zone data:", error);
    }

    // Now, apply the dynamically fetched color using setStyle
    layer.setStyle({
      color: color, // Border color
      weight: 1,
      opacity: 0.7,
      fillColor: color,  // Set dynamic fill color
      fillOpacity: 0.7
    });

    // Event listeners for mouse interactions
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
        // Reapply the dynamic style when mouse leaves
        layer.setStyle({
          color: color, // Border color
          weight: 1,
          opacity: 0.7,
          fillColor: color, // Reapply the fetched color
          fillOpacity: 0.7
        });
      },
      click: (e) => {
        alert(`You clicked on zip code: ${feature.properties.ZCTA5CE10}`);
      }
    });

    // Optionally, bind a popup with the zip code
    layer.bindPopup(`Zip Code: ${feature.properties.ZCTA5CE10}`);
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
            {geojsonData && (
              <GeoJSON 
                data={geojsonData} 
                onEachFeature={onEachFeature} 
                style={getStyle} 
                key={reloadKey} // Add the reloadKey here
              />
            )}
            <MapUpdater zoom={zoomLevel} />
          </MapContainer>
        </div>

        {/* ToggleSwitch, Mode button, and Pollution toggle button */}
        <div>
          <ToggleSwitch onToggle={handleToggle} />
          
          {/* Mode Change Button */}
          <button onClick={handleModeChange}>
            Change Mode
          </button>

          {/* Pollution Toggle Button */}
          <button onClick={handlePollutionToggle}>
            Toggle Pollution: {pollution ? 'High' : 'Low'}
          </button>

          {/* Display current mode description */}
          <div>
            {getModeDescription()}
          </div>
        </div>
      </section>
    </div>
  );
};


export default MapComponent;
