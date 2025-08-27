import pandas as pd

# Load raw data
orders = pd.read_csv("ordersdata.csv")
inventory = pd.read_csv("inventorydata.csv")

# Track cleaning stats
log_data = []

# Orders cleaning
orders_nulls = orders.isnull().sum().sum()
orders_dupes = orders.duplicated().sum()
orders_clean = orders.drop_duplicates().dropna()
log_data.append(("Orders", "missing_values", orders_nulls))
log_data.append(("Orders", "duplicates_removed", orders_dupes))

# Inventory cleaning
inventory_nulls = inventory.isnull().sum().sum()
inventory_dupes = inventory.duplicated().sum()
inventory_clean = inventory.drop_duplicates().dropna()
log_data.append(("Inventory", "missing_values", inventory_nulls))
log_data.append(("Inventory", "duplicates_removed", inventory_dupes))

# Save cleaned files
orders_clean.to_csv("orders_clean.csv", index=False)
inventory_clean.to_csv("inventory_clean.csv", index=False)

# Save log file
with open("cleaning_log.txt", "w") as f:
    f.write("=== Data Cleaning Log ===\n\n")
    for dataset, issue, count in log_data:
        f.write(f"{dataset:<12} | {issue:<20} | {count}\n")

# Example queries
print("=== Orders by Region ===")
print(orders_clean.groupby("region")["order_id"].count())

print("\n=== Inventory Status ===")
print(inventory_clean.groupby("warehouse")["quantity"].sum())

print("\nPipeline Execution Completed Successfully")


