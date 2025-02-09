//Array of keys
let keys = ["5b", "6a", "6b", "7a", "7b", "8a", "8b", "9a", "9b", "10a", "10b", "11a"];

//Arrayy of hardiness values
let values = ["#5ec9e0", "#56bb48", "#78c756", "#abd669", "#cddb70", "#eeda85", "#ebcb57", "#dbb64f", "#f5b678", "#eb9d3d", "#e67937", "#e65733"]

//Hardiness Map for keys and values
let map = new Map();

// Using loop to insert key-value pairs into the map
for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], values[i]);
}
