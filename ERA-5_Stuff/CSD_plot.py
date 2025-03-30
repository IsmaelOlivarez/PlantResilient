import matplotlib.pyplot as plt

# Select a specific time slice (e.g., the first time step)
t2m_slice = t2m.isel(time=0)

# Plot the data
plt.figure(figsize=(10, 6))
t2m_slice.plot(cmap="coolwarm")
plt.title("2m Temperature (First Time Step)")
plt.show()