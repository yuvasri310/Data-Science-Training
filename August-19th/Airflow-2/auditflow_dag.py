from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago
import json
import random
import datetime
# Default arguments
default_args = {
    'owner': 'yuvasri',
    'email': ['audit-alert@example.com'],
    'email_on_failure': True,
    'retries': 1,
    'retry_delay': datetime.timedelta(minutes=2)
}

# Python functions


# 1. Simulate data pull (from API/DB)
def pull_data(**context):
    # Simulated dummy data
    data = {
        "record_id": 123,
        "value": random.randint(50, 150),  # random value
        "timestamp": str(datetime.datetime.utcnow())
    }
    context['ti'].xcom_push(key="audit_data", value=data)


# 2. Business rule validation
def validate_rule(**context):
    data = context['ti'].xcom_pull(key="audit_data", task_ids="pull_data")
    if not data:
        raise ValueError("No data pulled!")

    # Rule: value must be <= 100
    audit_result = {
        "record_id": data['record_id'],
        "is_valid": data['value'] <= 100,
        "value_checked": data['value'],
        "timestamp": data['timestamp']
    }

    # Save result to file
    with open("/tmp/audit_result.json", "w") as f:
        json.dump(audit_result, f)

    if not audit_result["is_valid"]:
        raise ValueError(f"Audit failed: Value {data['value']} exceeds threshold!")


# 3. Logging audit result
def log_results():
    with open("/tmp/audit_result.json", "r") as f:
        result = json.load(f)
    status = "SUCCESS" if result["is_valid"] else "FAILURE"
    print(f"[Audit Log] Record {result['record_id']} validation {status}. "
          f"Value={result['value_checked']}, Timestamp={result['timestamp']}")

# DAG definition
with DAG(
        dag_id="data_audit_dag",
        default_args=default_args,
        schedule_interval="@hourly",
        start_date=days_ago(1),
        catchup=False,
        tags=["audit", "example"]
) as dag:
    # Stage 1: Data pull
    pull_data_task = PythonOperator(
        task_id="pull_data",
        python_callable=pull_data,
        provide_context=True
    )

    # Stage 2: Rule validation
    validate_task = PythonOperator(
        task_id="validate_rule",
        python_callable=validate_rule,
        provide_context=True
    )

    # Stage 3: Log results
    log_task = PythonOperator(
        task_id="log_results",
        python_callable=log_results
    )

    # Stage 4: Final status update (using BashOperator)
    final_status = BashOperator(
        task_id="final_status_update",
        bash_command="echo '[Audit Status] Data audit pipeline completed at $(date)'"
    )

    # Task dependencies
    pull_data_task >> validate_task >> log_task >> final_status
