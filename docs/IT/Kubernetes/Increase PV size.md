---
share: true
---

Resizing PVs with "normal" PVCs should be no problem, see [the Kubernetes documentation](https://kubernetes.io/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/)

## VolumeClaimTemplates

It's differently with `StatefulSets` having `VolumeClaimTemplates` though.

*Instruction taken from: <https://serverfault.com/a/989665>*

1.  `kubectl edit pvc <name>` for each PVC in the StatefulSet, to increase its capacity.
2.  `kubectl delete sts --cascade=orphan <name>` to delete the StatefulSet and leave its pods.
3.  `kubectl apply -f <name>` to recreate the StatefulSet.
4.  *(May be optional, check the PVC in the running pod)*`kubectl rollout restart sts <name>` to restart the pods, one at a time. During restart, the pod's PVC will be resized.

If you want to monitor what's happening, run two more shell windows with these commands, before any of the commands above:

*   `kubectl get pod -w`
*   `kubectl get pvc -w`

## Prometheus

For the Prometheus CDR (`prometheuses.monitoring.coreos.com`), it's slightly different.

1. Increase `spec.storage.volumeClaimTemplate.spec.resources.requests.storage` to the desired size
2. Manually increase PVC size
3. ???
4. Profit

The Prometheus Operator does all the other stuff like recreating the StatefulSet and restarting the Pods by itself.

## Other

<https://kubernetes.io/blog/2018/07/12/resizing-persistent-volumes-using-kubernetes/>
