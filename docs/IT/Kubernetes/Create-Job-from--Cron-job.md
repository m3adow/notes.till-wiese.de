---
share: true
---

```bash
# Also works for job/<job-name>
kubectl create job --from=cronjob/<cronjob-name> <job-name>
```

## Create Job with generated Name

*e.g. to prevent naming conflicts*

```bash
kc create job --from=cronjob/generate-queue --dry-run=client generate-queue-manual -o json | jq 'del(.metadata.name) | .metadata += {"generateName":"generate-queue-manual-"}' | kc create --dry-run=server -f-
```
