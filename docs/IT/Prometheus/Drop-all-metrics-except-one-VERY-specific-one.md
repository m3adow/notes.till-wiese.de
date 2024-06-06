---
share: true
---

To drop all metrics except one specific one, use relabeling with `keep` and a chained `regex`. E.g. To keep only the RabbitMQ metrics of the `async.operations.all` queue in all `deployment-XXXX` namespaces when using a Kubernetes `PodMonitoring` CRD:

```yaml
metricRelabeling:
- action: keep
  regex: (deployment-(\d+);rabbitmq_detailed_queue_messages;async\.operations\.all)
  sourceLabels:
    - namespace
    - __name__
    - queue
```

I recommend this blog post: https://heiioncall.com/guides/the-art-of-metric-relabeling-in-prometheus
