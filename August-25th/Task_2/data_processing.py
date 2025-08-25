import pandas as pd

def clean_sales_data(input_file, raw_output, clean_output):
    df = pd.read_csv(input_file)

    # Save raw data (without modifications)
    df.to_csv(raw_output, index=False)

    # --- Cleaning process ---
    # 1. Drop rows with missing values
    df_clean = df.dropna()

    # 2. Convert date columns to YYYY-MM-DD format
    for col in df_clean.select_dtypes(include=['object', 'datetime']):
        try:
            df_clean[col] = pd.to_datetime(
                df_clean[col], errors='coerce'
            ).dt.strftime('%Y-%m-%d')
        except Exception:
            continue

    # 3. Normalize column names (lowercase)
    df_clean.columns = [col.lower() for col in df_clean.columns]
    df_clean.to_csv(clean_output, index=False)

if __name__ == "__main__":
    clean_sales_data(
        input_file="data/raw_sales_data.csv",
        raw_output="data/raw_sales_data.csv",
        clean_output="data/clean_sales_data.csv"
    )
