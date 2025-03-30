import cdsapi
import os
import zipfile
import xarray as xr

# Initialize the API client
c = cdsapi.Client()

# Define file paths
zip_file_path = "era5_summer_tmax_miami.zip"
grib_file_path = "data.grib"  # The file inside the zip archive

# Define the request parameters
request = {
    "variable": "2m_temperature",
    "year": "2023",
    "month": ["06", "07", "08"],
    "day": [str(i).zfill(2) for i in range(1, 32)],
    "time": ["12:00"],
    "format": "netcdf4",  # Ensure netCDF4 format
    "area": [30, -90, 25, -80],
}

# Send the request to the API
print("Sending request:", request)
result = c.retrieve("reanalysis-era5-land", request, zip_file_path)

# Check if the file is downloaded and is a zip file
if os.path.exists(zip_file_path):
    print(f"Downloaded data as zip file: {zip_file_path}")
    
    # Unzip the file if it's a zip archive
    if zipfile.is_zipfile(zip_file_path):
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            # Extract all the files in the zip archive
            zip_ref.extractall(".")  # Extract to the current directory
            print(f"Extracted files: {zip_ref.namelist()}")
        
        # Check if the expected GRIB file is present
        if grib_file_path in zip_ref.namelist():
            print(f"GRIB file {grib_file_path} extracted successfully.")
            
            # Read the GRIB file with xarray
            try:
                ds = xr.open_dataset(grib_file_path, engine="cfgrib")
                print(ds)
            except Exception as e:
                print(f"Error opening GRIB file: {e}")
        else:
            print(f"⚠️ Expected GRIB file {grib_file_path} not found in the zip archive.")
    else:
        print("⚠️ Error: The downloaded file is not a zip archive.")
else:
    print("⚠️ Download failed, file not found!")

# Verify the file size after extraction
if os.path.exists(grib_file_path):
    size = os.path.getsize(grib_file_path)
    print(f"File size: {size / 1024:.2f} KB")
    if size < 500 * 1024:  # Expect at least 500 KB for valid data
        print("⚠️ Warning: File may be incomplete. Check API response.")
else:
    print("⚠️ GRIB file not found after extraction!")
