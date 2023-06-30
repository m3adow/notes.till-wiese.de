---
share: true
---

*Intended for one-off backups, e.g. before shutting down applications*

A GCS bucket to store the dump is required.

1. Grant temporary `storage.objectAdmin` permissions to Database Service Account (to create the dump):

    ```bash
    gcloud projects add-iam-policy-binding ${GCP_PROJECT_NAME} --member=${CLOUDSQL_DB_SERVICE_ACCOUNT}$ --role=roles/storage.objectAdmin
    ```   

2. Export the DB:

    ```bash
    gcloud sql export sql ${CLOUDSQL_DB_INSTANCE_NAME} --project=${GCP_PROJECT_NAME} --database=${CLOUDSQL_DB_NAME}$ gs://${GCS_BUCKET_NAME}/${DB_DUMP_BACKUP_NAME.gz
    ```

3. Remove the temporary permissions (Wait for the export to finish if it returned too early):

    ```bash
    gcloud projects remove-iam-policy-binding ${GCP_PROJECT_NAME} --member=${CLOUDSQL_DB_SERVICE_ACCOUNT}$ --role=roles/storage.objectAdmin
    ```
