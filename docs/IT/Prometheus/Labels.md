---
share: true
---

## Meta Labels

### Search

Meta labels can be retrieved in the Prometheus web interface under `/service-discovery` (possibly only via port forward). The search is somewhat unintuitive because it only filters out the service monitors that do not contain the label, but does not somehow display the result (and especially the content of the label).

### Adding

Adding a meta label is relatively easy, it just has to happen in the right section of the configuration, the [Relabeling](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config) with the `relabelings` key:

```yaml
relabelings:
- sourceLabels: [__meta_kubernetes_endpoint_node_name]
  targetLabel: tmp_node_name
```

**Important:** Labels that begin with underscore(s) are discarded after relabeling. If labels are to continue to exist, they should have a "real" name.

## Relabeling

As an introduction or refresher, I find this (these) article(s) worth reading and understandable:

* <https://grafana.com/blog/2022/03/21/how-relabeling-in-prometheus-works/> ([in Wayback Machine](https://web.archive.org/web/20220000000000*/https://grafana.com/blog/2022/03/21/how-relabeling-in-prometheus-works/))

Here is an example of how a label is first renamed and then a temporary label takes its place:

```yaml
metricRelabelings:
# Copy `instance` label to `instance_address`...
- sourceLabels: [instance]
  targetLabel: instance_address
# ...then copy the node name stored in the tmp label to `instance`...
- sourceLabels: [tmp_node_name]
  targetLabel: instance
# ...before removing the tmp label
- regex: ^tmp_node_name$
  action: labeldrop
```
