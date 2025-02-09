const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve static files (React build output)
app.use(express.static(path.join(__dirname, '../client/build'))); // Adjusted to serve from the client build directory

// API endpoint to serve GeoJSON data
app.get('/api/geojson-data', (req, res) => {
  // The GeoJSON files are now located in the /geojson folder
  const geojsonFiles = [
    'fl_florida_zip_codes_geo.min.json',
    'sc_south_carolina_zip_codes_geo.min.json',
    'ga_georgia_zip_codes_geo.min.json',
    'ms_mississippi_zip_codes_geo.min.json',
    'al_alabama_zip_codes_geo.min.json'
  ];

  // Read all GeoJSON files from the geojson folder
  const geojsonData = geojsonFiles.map(filePath => {
    // Correctly resolve the file path to the geojson folder
    const absolutePath = path.join(__dirname, '../geojson', filePath); // Adjusted path to point to /geojson folder
    return fs.readFileSync(absolutePath, 'utf8'); // Read file synchronously
  });

  // Combine the GeoJSON files into a single array of objects
  const combinedGeojson = geojsonData.map(data => JSON.parse(data));

  // Send the combined GeoJSON data to the client
  res.json(combinedGeojson);
});

// Fallback route for React app (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));  // Serve React app
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

