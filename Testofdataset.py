import xarray as xr
import os

# Path to your GRIB file
grib_file_path = "data.grib"  # Replace with the correct file path

# Check if the file exists before proceeding
if os.path.exists(grib_file_path):
    try:
        # Open the GRIB file with xarray using cfgrib engine
        ds = xr.open_dataset(grib_file_path, engine="cfgrib")
        
        # Print the dataset to inspect it
        print(ds)

        # You can also access specific variables like temperature (t2m)
        print(ds['t2m'])  # Access the 't2m' (temperature) variable in the dataset
        
    except Exception as e:
        print(f"Error opening GRIB file: {e}")
else:
    print(f"Error: The file {grib_file_path} does not exist.")
