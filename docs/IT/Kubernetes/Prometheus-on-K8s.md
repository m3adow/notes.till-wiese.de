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

## Check all available metrics for one label

To check available metrics, e.g. for one namespace

```promql
count by(__name__)({namespace=~"magento-shop-.*"})
```

This also shows the amount of samples collected for each metric.

*[Source](https://stackoverflow.com/a/49151596)*

## ServiceMonitor or Podmonitor?

Most of the times, a ServiceMonitor will be the right choice. Also, see here: <https://github.com/prometheus-operator/prometheus-operator/issues/3119>

## Prometheus Operator - Remove config-reloader limits

It's possible to remove limits by setting the `--config-reloader-cpu-limit`/`--config-reloader-memory-limit` arg (see PRs [#2560](https://github.com/prometheus-operator/prometheus-operator/pull/2560) and [1139](https://github.com/prometheus-operator/kube-prometheus/issues/1139)).

For the `kube-prometheus-stack` Helm Chart, the value `prometheusOperator.prometheusConfigReloader.resources.limits.cpu` (or `.memory`) has to be set to `0`.
