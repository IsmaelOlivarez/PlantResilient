from pygbif import occurrences
import pandas as pd

# Define the species you want to search for
species_name = "Quercus virginiana"  # Replace with your desired species name

# Query GBIF for occurrence data
occurrences_data = occurrences.search(scientificName=species_name, limit=1000)

# Extract lat, lon, and date
records = []
for rec in occurrences_data["results"]:
    if "decimalLatitude" in rec and "decimalLongitude" in rec:
        records.append({
            "latitude": rec["decimalLatitude"],
            "longitude": rec["decimalLongitude"],
            "date": rec.get("eventDate", "Unknown")
        })

# Convert to a DataFrame
pd.set_option("display.max_rows",1000)
df = pd.DataFrame(records)
print(df)  # Show the first few records
