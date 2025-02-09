const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
console.log('Mongo URI:', process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve static files (React build output)
app.use(express.static(path.join(__dirname, '../client/build'))); // Adjusted to serve from the client build directory

const mongoURI = process.env.MONGODB_URI;


// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://ismaelolivarez05:vURxIlNbjL8gHyV6@plantresilient1.hqmlc.mongodb.net/zipZones?retryWrites=true&w=majority&appName=plantresilient1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error: ', err));

// Example route to check if server is running
app.get('/', (req, res) => {
    res.send('Hello, MongoDB!');
});

const hardinessSchema = new mongoose.Schema({
    zipCode: { type: String, required: true },
    zone: { type: String, required: true }
});

const zoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
  });
  
  const Zone = mongoose.model('Zone', zoneSchema);

const earlyLowSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'earlyLow' }); // Specify the collection name
const earlyHighSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'earlyHigh' }); // Specify the collection name
const midLowSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'midLow' }); // Specify the collection name
const midHighSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'midHigh' }); // Specify the collection name
const lateLowSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'lateLow' }); // Specify the collection name
const lateHighSchema = new mongoose.Schema({
    zipcode: { type: String, required: true },
    zone: { type: String, required: true }
}, { collection: 'lateHigh' }); // Specify the collection name

const EarlyLow = mongoose.model('EarlyLow', earlyLowSchema); // Model for the 'earlyHigh' collection
const EarlyHigh = mongoose.model('EarlyHigh', earlyHighSchema); // Model for the 'earlyHigh' collection
const MidLow = mongoose.model('MidLow', midLowSchema); // Model for the 'earlyHigh' collection
const MidHigh = mongoose.model('MidHigh', midHighSchema); // Model for the 'earlyHigh' collection
const LateLow = mongoose.model('LateLow', lateLowSchema); // Model for the 'earlyHigh' collection
const LateHigh = mongoose.model('LateHigh', lateHighSchema); // Model for the 'earlyHigh' collection




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
app.get('/api/earlyLow/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await EarlyLow.findOne({ zipcode: zipCodeString }); // CHANGE

        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/earlyHigh/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await EarlyHigh.findOne({ zipcode: zipCodeString }); // CHANGE

        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/midLow/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await MidLow.findOne({ zipcode: zipCodeString }); // CHANGE

        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/midHigh/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await MidHigh.findOne({ zipcode: zipCodeString }); // CHANGE

        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/lateLow/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await LateLow.findOne({ zipcode: zipCodeString }); // CHANGE
        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/lateHigh/:zipcode', async (req, res) => { // CHANGE
    const { zipcode } = req.params;  // Get the zipcode from params
    const zipCodeString = String(zipcode);  // Ensure it's treated as a string
    
    try {
        // Query the 'earlyHigh' collection using the 'EarlyHigh' model
        const result = await LateHigh.findOne({ zipcode: zipCodeString }); // CHANGE
        if (!result) {
            return res.status(404).json({ message: 'Zipcode not found' });
        }

        res.json({ zone: result.zone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Fallback route for React app (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));  // Serve React app
});



  


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

