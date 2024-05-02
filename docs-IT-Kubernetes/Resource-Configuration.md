---
share: true
---

Personal best practice:

* Always set memory request
* Always set memory limit to same amount as memory request
* Always set CPU request
* Don't set CPU limits

## Why memory limit = memory request?

* [Memory can't be reclaimed as easily as CPU shares](https://home.robusta.dev/blog/kubernetes-memory-limit)
* Pods will be scheduled by requests, limits are not taken into account
* Thusly, having a couple of pods with `memory limit > memory request` on one node may starve some of them
* Therefore, setting `limit = request` eases capacity planning

Exception: Shortly lived pods like Cronjob Pods have their memory reclaimed after they are stopped and could therefore have `memory limits > memory requests`. But the issue of memory starvation in case several such pods are scheduled on one node still persists.

## Why no CPU limits?

* [Rarely (if ever) useful, as additionally claimed CPU shares can easily be reclaimed](https://home.robusta.dev/blog/stop-using-cpu-limits)
* [The myth, that Kubernetes system processes are starved without is wrong](https://blog.netdata.cloud/kubernetes-throttling-doesnt-have-to-suck-let-us-help/#cluster-stability)

## Further reads

[Kubernetes OOM and CPU Throttling](https://sysdig.com/blog/troubleshoot-kubernetes-oom/) by Sysdig
