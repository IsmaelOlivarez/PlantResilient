import cdsapi

c = cdsapi.Client()

file_path = "era5_summer_tmax_miami.nc"

result = c.retrieve(
    "reanalysis-era5-land",
    {
        "variable": "2m_temperature",
        "year": "2023",
        "month": ["06", "07", "08"],
        "day": [str(i).zfill(2) for i in range(1, 32)],
        "time": ["12:00"],
        "format": "netcdf",
        "area": [30, -90, 25, -80],
    },
    file_path,
)

# Print API response details
print(result)
