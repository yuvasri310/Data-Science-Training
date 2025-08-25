import os
import pandas as pd
from azure.storage.blob import BlobServiceClient

def process_sales_data(input_file, raw_output, processed_output):
    # Step 1: Load CSV
    df = pd.read_csv(input_file)

    # Save raw data unchanged
    df.to_csv(raw_output, index=False)

    # Step 2: Remove duplicate rows based on order_id
    if "order_id" in df.columns:
        df = df.drop_duplicates(subset=["order_id"])

    # Step 3: Handle missing values
    if "region" in df.columns:
        df["region"] = df["region"].fillna("Unknown")
    if "revenue" in df.columns:
        df["revenue"] = df["revenue"].fillna(0)

    # Step 4: Add profit_margin column
    if "revenue" in df.columns and "cost" in df.columns:
        df["profit_margin"] = (df["revenue"] - df["cost"]) / df["revenue"].replace(0, 1)

    # Step 5: Customer segmentation
    if "revenue" in df.columns:
        def categorize_customer(revenue):
            if revenue > 100000:
                return "Platinum"
            elif 50000 < revenue <= 100000:
                return "Gold"
            else:
                return "Standard"

        df["customer_segment"] = df["revenue"].apply(categorize_customer)

    # Save processed dataset
    df.to_csv(processed_output, index=False)

def upload_to_blob(local_file, blob_name):
    account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
    account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
    container_name = os.getenv("AZURE_CONTAINER_NAME")

    if not all([account_name, account_key, container_name]):
        raise ValueError("Azure storage environment variables are not set!")

    blob_service_client = BlobServiceClient(
        account_url=f"https://{account_name}.blob.core.windows.net/",
        credential=account_key
    )

    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)

    with open(local_file, "rb") as data:
        blob_client.upload_blob(data, overwrite=True)
    print(f"Uploaded {local_file} to Blob Storage as {blob_name}")

if __name__ == "__main__":
    input_file = "data/sales_data.csv"
    raw_output = "data/raw_sales_data.csv"
    processed_output = "data/processed_sales_data.csv"

    # Process & enrich data
    process_sales_data(input_file, raw_output, processed_output)

    # Upload both raw & processed files to Blob
    upload_to_blob(raw_output, "raw_sales_data.csv")
    upload_to_blob(processed_output, "processed_sales_data.csv")
