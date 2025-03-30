import xarray as xr

# Path to the GRIB file
grib_file_path = "data.grib"

try:
    # Open the GRIB file using xarray
    print(f"Opening GRIB file: {grib_file_path}")
    ds = xr.open_dataset(grib_file_path, engine="cfgrib")

    # Display dataset information
    print("Dataset loaded successfully!")
    print(ds)

    # Example: Extract a specific variable (e.g., 't2m' for 2m temperature)
    if "t2m" in ds.variables:
        t2m = ds["t2m"]
        print("2m Temperature Data:")
        print(t2m)

        # Example: Calculate the mean temperature
        mean_temp = t2m.mean().item()
        print(f"Mean 2m Temperature: {mean_temp:.2f} K")

        # Save the extracted variable to a NetCDF file (optional)
        output_file = "extracted_t2m.nc"
        t2m.to_netcdf(output_file)
        print(f"Extracted 2m temperature saved to {output_file}")
    else:
        print("⚠️ 't2m' variable not found in the GRIB file. Check the dataset variables.")

except Exception as e:
    print(f"⚠️ Error processing GRIB file: {e}")