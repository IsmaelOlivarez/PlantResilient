import xarray as xr

# Open the dataset
ds = xr.open_dataset('/Users/eleanorlewis/Desktop/Plant Resilient/PlantResilient/data.grib', engine='cfgrib')

# Access the temperature data
temperature_data = ds['t2m']

# Print the temperature data
print(temperature_data)
