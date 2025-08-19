from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from datetime import datetime
import logging

# Logging setup
logger = logging.getLogger("airflow.task")

# Step 1: Extract function
def extract_data(**context):
    data = "user_id,username\n1,alice\n2,bob\n3,charlie"
    context['ti'].xcom_push(key='raw_data', value=data)
    logger.info("Data extracted and pushed to XCom")

# Step 2: Transform function
def transform_data(**context):
    raw_data = context['ti'].xcom_pull(key='raw_data')
    lines = raw_data.split("\n")
    header = lines[0]
    transformed = [header.upper()] + [line.upper() for line in lines[1:]]
    context['ti'].xcom_push(key='transformed_data', value="\n".join(transformed))
    logger.info("Data transformed successfully")

# Step 3: Load function
def load_data(**context):
    transformed_data = context['ti'].xcom_pull(key='transformed_data')
    logger.info("Loading data into destination (simulated)...")
    logger.info(f"Final Loaded Data:\n{transformed_data}")

# DAG definition
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 8, 1),
    'retries': 1
}

with DAG(
    dag_id='etl_pipeline_dag',
    default_args=default_args,
    description='Simple ETL Pipeline DAG using Airflow',
    schedule_interval=None,  # manually triggerable
    catchup=False,
) as dag:

    # Extract Task
    extract_task = PythonOperator(
        task_id='extract_task',
        python_callable=extract_data,
        provide_context=True
    )

    # Transform Task
    transform_task = PythonOperator(
        task_id='transform_task',
        python_callable=transform_data,
        provide_context=True
    )

    # Load Task 
    load_task = PythonOperator(
        task_id='load_task',
        python_callable=load_data,
        provide_context=True
    )

    echo_task = BashOperator(
        task_id='bash_log',
        bash_command='echo "ETL pipeline completed successfully!"'
    )

    # Task chaining
    extract_task >> transform_task >> load_task >> echo_task
