from pygbif import occurrences
import pandas as pd

# Define the species you want to search for
species_name = "Hamelia patens"  # Replace with your desired species name

# Initialize records list to store all occurrences
records = []

# Set the number of records per request (maximum GBIF allows per query)
limit = 300  # You can adjust this based on API limits
offset = 0    # Start with the first set of data

# Loop to get all records by changing the offset
while True:
    # Query GBIF for occurrence data with pagination
    occurrences_data = occurrences.search(
        scientificName=species_name,
        limit=limit,
        offset=offset
    )

    # If no results are returned, break the loop
    if not occurrences_data["results"]:
        break

    # Extract latitude, longitude, and date from the results
    for rec in occurrences_data["results"]:
        if "decimalLatitude" in rec and "decimalLongitude" in rec:
            records.append({
                "latitude": rec["decimalLatitude"],
                "longitude": rec["decimalLongitude"],
                "date": rec.get("eventDate", "Unknown")
            })

    # Increase the offset for the next chunk of data
    offset += limit

# Convert to a DataFrame
pd.set_option("display.max_rows", 1000)  # Show more rows in the output
df = pd.DataFrame(records)

# Display the first few records
print(df)