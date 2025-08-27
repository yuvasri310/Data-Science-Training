import pandas as pd
import numpy as np
import os

# ---------- Step 1: Load Data ----------
orders_file = "orders.csv"
customers_file = "customers.csv"

if not os.path.exists(orders_file) or not os.path.exists(customers_file):
    raise FileNotFoundError("CSV files not found. Please check paths in pipeline.")

orders_df = pd.read_csv(orders_file)
customers_df = pd.read_csv(customers_file)

# ---------- Step 2: Data Cleaning ----------
orders_df['order_date'] = pd.to_datetime(orders_df['order_date'])
orders_df['delivery_date'] = pd.to_datetime(orders_df['delivery_date'])

# Calculate delay days
orders_df['delay_days'] = (orders_df['delivery_date'] - orders_df['order_date']).dt.days
orders_df['is_delayed'] = np.where(orders_df['delay_days'] > 5, 1, 0)  # delayed if >5 days

# ---------- Step 3: Join with Customers ----------
merged_df = orders_df.merge(customers_df, on="customer_id", how="left")

# ---------- Step 4: Summaries ----------
delay_by_customer = merged_df.groupby("customer_name")['is_delayed'].sum().sort_values(ascending=False)
delay_by_region = merged_df.groupby("region")['is_delayed'].sum().sort_values(ascending=False)

# ---------- Step 5: Save Log ----------
with open("delay_summary.log", "w") as log_file:
    log_file.write("===== Delay Summary Report =====\n\n")
    log_file.write("Top Customers with Delays:\n")
    log_file.write(delay_by_customer.to_string())
    log_file.write("\n\nDelays by Region:\n")
    log_file.write(delay_by_region.to_string())
    log_file.write("\n\nPipeline executed successfully\n")

print("Pipeline executed successfully. Delay summary saved to delay_summary.log")
