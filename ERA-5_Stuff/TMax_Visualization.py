import xarray as xr
import matplotlib.pyplot as plt

# Path to the GRIB file
grib_file_path = "data.grib"

try:
    # Open the GRIB file using xarray
    print(f"Opening GRIB file: {grib_file_path}")
    ds = xr.open_dataset(grib_file_path, engine="cfgrib")

    # Display dataset information
    print("Dataset loaded successfully!")
    print(ds)

    # Example: Extract the 2m temperature variable ('t2m')
    if "t2m" in ds.variables:
        t2m = ds["t2m"]
        print("2m Temperature Data:")
        print(t2m)

        # Convert temperature from Kelvin to Celsius
        t2m_celsius = t2m - 273.15
        print("2m Temperature Data (Celsius):")
        print(t2m_celsius)

        # Example: Calculate the maximum temperature over all time and locations
        tmax = t2m_celsius.max(dim="time")  # Calculate the max temperature over time
        print("Maximum Temperature (Celsius):")
        print(tmax)

        # Save the extracted tmax to a NetCDF file (optional)
        output_file = "extracted_tmax_celsius.nc"
        tmax.to_netcdf(output_file)
        print(f"Extracted maximum temperature (Celsius) saved to {output_file}")

        # Plot the maximum temperature as a heatmap
        plt.figure(figsize=(100, 60))
        tmax.plot(cmap="coolwarm")
        plt.title("Maximum 2m Temperature (Celsius)")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        plt.show()

    else:
        print("⚠️ 't2m' variable not found in the GRIB file. Check the dataset variables.")

except Exception as e:
    print(f"⚠️ Error processing GRIB file: {e}")

print("All Maximum Temperature Values (Celsius):")
print(tmax.values)