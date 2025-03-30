import cdsapi
import os
import zipfile

# Initialize the CDS API client
c = cdsapi.Client()

# Define the request parameters
request = {
    "product_type": "reanalysis",
    "variable": "2m_temperature",
    "year": "2024",
    "month": ["06", "07", "08"],
    "day": [str(i).zfill(2) for i in range(1, 32)],  # Days 01 to 31
    "time": ["12:00"],  # One time step per day
    "format": "grib",  # Request GRIB format
    "area": [30, -90, 25, -80],  # Bounding box: North, West, South, East
}

# Output file name
output_file = "era5_land_2m_temperature.grib"

try:
    # Submit the request and download the data
    print("Submitting request to CDS API...")
    c.retrieve("reanalysis-era5-land", request, output_file)
    print(f"Data downloaded and saved to {output_file}")

    # Check if the downloaded file is a ZIP archive
    if zipfile.is_zipfile(output_file):
        print("The downloaded file is a ZIP archive. Extracting contents...")
        with zipfile.ZipFile(output_file, "r") as zip_ref:
            zip_ref.extractall(".")  # Extract to the current directory
            extracted_files = zip_ref.namelist()
            print(f"Extracted files: {extracted_files}")

        # Update the output file to the extracted GRIB file
        output_file = extracted_files[0]  # Assuming the GRIB file is the first file in the ZIP
        print(f"Updated output file to: {output_file}")

    # Verify the GRIB file
    if os.path.exists(output_file):
        file_size = os.path.getsize(output_file)
        print(f"Downloaded file size: {file_size / 1024:.2f} KB")
        if file_size < 500 * 1024:  # Check if the file is smaller than 500 KB
            raise ValueError("The downloaded file is too small and may be corrupted.")
    else:
        raise FileNotFoundError(f"The file {output_file} was not found after download.")

except zipfile.BadZipFile:
    print("⚠️ Error: The downloaded file is not a valid ZIP archive.")
except ValueError as ve:
    print(f"⚠️ Error: {ve}")
except FileNotFoundError as fnf_error:
    print(f"⚠️ Error: {fnf_error}")
except Exception as e:
    print(f"⚠️ An unexpected error occurred: {e}")