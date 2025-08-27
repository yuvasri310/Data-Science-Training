import pandas as pd

# Load raw data
orders = pd.read_csv("ordersdata.csv")
inventory = pd.read_csv("inventorydata.csv")

# Clean data (remove duplicates, nulls)
orders_clean = orders.drop_duplicates().dropna()
inventory_clean = inventory.drop_duplicates().dropna()

# Save cleaned files
orders_clean.to_csv("orders_clean.csv", index=False)
inventory_clean.to_csv("inventory_clean.csv", index=False)

# Example queries
print("=== Orders by Region ===")
print(orders_clean.groupby("region")["order_id"].count())

print("\n=== Inventory Status ===")
print(inventory_clean.groupby("warehouse")["quantity"].sum())

print("\nPipeline Execution Completed Successfully")
