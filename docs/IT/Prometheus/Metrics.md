
---
share: true
---

## Check available Metrics with specific label

To check all available Metrics with a specific label use th PromQL Query `{__name__=~".+", LABELHERE="VALUEHERE"}`, e.g.:

```promql
{__name__=~".+", namespace="critical-prod-deployment"}
```

