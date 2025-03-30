import xarray as xr

# Path to the NetCDF file
file_path = "era5_summer_tmax_miami.nc"

# Open the dataset with the netCDF4 engine
ds = xr.open_dataset(file_path, engine="netcdf4")

# Print the dataset to see its contents
print(ds)
