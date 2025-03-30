import cdsapi
import xarray as xr

dataset = "reanalysis-era5-land"
request = {
    "variable": ["2m_temperature"],
    "year": "2023",
    "month": "01",
    "day": ["01"],
    "time": ["00:00"],
    "data_format": "grib",
    "download_format": "zip"
}

client = cdsapi.Client()
client.retrieve(dataset, request).download()

# Load the .grib file
grib_file_path = 'data.grib'  # Replace with the actual file path
ds = xr.open_dataset(grib_file_path, engine='cfgrib')

# Display the contents of the dataset
print("START OF CONTENTS IN DATASET")
print(ds)
print("END OF CONTENTS IN DATASET")

temp_data = ds["t2m"]

print(temp_data)

print("PRINT TIME COORD:")

print(ds.coords)

print(ds.coords['time'].values) # Displays time i guess

#print(temp_data)

# Filter data by time and location
#temp_data = ds.sel(valid_time="2022-12-31T00:00:00.000000000")
print("TEMP DATA")

#temp_data = ds["t2m"].sel(time="2023-08-26T00:00:00")
#temp_data = ds.sel(valid_time="2023-08-26T00:00:00")

#print(ds.coords['time'].values)
#print(ds.coords['valid_time'].values)



#print(temp_data)
