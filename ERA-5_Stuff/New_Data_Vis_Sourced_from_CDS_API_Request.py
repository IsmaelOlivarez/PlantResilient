import xarray as xr
import matplotlib.pyplot as plt

# Path to the GRIB file downloaded from the new API request
grib_file_path = "era5_land_2m_temperature.grib"

try:
    # Open the GRIB file using xarray
    print(f"Opening GRIB file: {grib_file_path}")
    ds = xr.open_dataset(grib_file_path, engine="cfgrib", backend_kwargs={"indexpath": "./era5_index"})

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
        plt.figure(figsize=(10, 6))
        tmax.plot(cmap="coolwarm")
        plt.title("Maximum 2m Temperature (Celsius)")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        plt.show()

    else:
        print("⚠️ 't2m' variable not found in the GRIB file. Check the dataset variables.")

except EOFError as eof_error:
    print(f"⚠️ Error: The GRIB file appears to be incomplete or corrupted: {eof_error}")
except FileNotFoundError as fnf_error:
    print(f"⚠️ Error: The GRIB file was not found: {fnf_error}")
except Exception as e:
    print(f"⚠️ Error processing GRIB file: {e}")