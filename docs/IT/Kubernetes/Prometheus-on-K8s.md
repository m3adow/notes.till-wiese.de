---
share: true
---

*For topics more tailored to Prometheus than Kubernetes, check in the IT/Prometheus folder*

## Get all available metrics

*(<https://stackoverflow.com/questions/65765293/prometheus-get-list-of-all-metrics-and-descriptions>)*

Go to Prometheus -> Status -> Targets and search for the required endpoint

For cadvisor metrics it's easier to use the K8s API:

```bash
kubectl get --raw "/api/v1/nodes/$(kubectl get node -o name | head -1 | cut -d '/' -f2)/proxy/metrics/cadvisor"
```

## ServiceMonitor or Podmonitor?

Most of the times, a ServiceMonitor will be the right choice. Also, see here: <https://github.com/prometheus-operator/prometheus-operator/issues/3119>
