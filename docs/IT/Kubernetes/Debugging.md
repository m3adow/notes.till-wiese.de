---
share: true
---

## Get Events only from a specific object

```bash
kubectl get event --namespace abc-namespace --field-selector involvedObject.name=my-pod-zl6m6
```

(source: https://stackoverflow.com/questions/51931113/kubectl-get-events-only-for-a-pod)

---

## Debug with ephemeral container

```bash
kc debug -it pod-to-debug --image=busybox --target=container-in-pod
```

---

## Delete unhealthy pods older than 1 day

From the whole cluster:

```bash
while read NAMESPACE POD; do kc delete po -n "$NAMESPACE" "$POD"; done <<< $(kubectl get po -A --no-headers | grep -vE "Running|Completed" | grep -P '\dd\d+h$'| awk '{print $1, $2}')
```

---

## Check if a ServiceAccount can do stuff

```bash
kubectl auth can-i list deployments --as=system:serviceaccount:devops-tools:api-service-account
```

---

## Offline decrypt Sealed Secret

This obviously needs the sealed secrets private key(s).

1. Fetch the sealed secret in yaml format:

```bash
  kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml >main.key
  kubectl get secret -n kube-system sealed-secrets-key -o yaml >> main.key
```

3. Extract the private keys list into a single file: `kubectl get secret -n kube-system -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml >master.key`
4. Unseal the sealed secret with kubeseal: `kubeseal --recovery-unseal --recovery-private-key master.key <mysecret.yaml`

## List processes without `ps`

_(Also see: https://stackoverflow.com/q/32913424)_

```bash
for prc in /proc/*/cmdline; { (printf "$prc "; cat -A "$prc") | sed 's/\^@/ /g;s|/proc/||;s|/cmdline||'; echo; }
```

## Find OOMKilled Pods in Prometheus

_(requires kube_state_metrics)_

```promql
kube_pod_container_status_last_terminated_reason{reason="OOMKilled"}
```

Note: Having no metrics here doesn't necessarily mean there weren't OOMKills.

# Keep Namespace in "Terminating" phase

Create a job which has a long `terminationGracePeriodSeconds` in the namespace

```bash
kc create ns till-termination-test; kc create job prevent-termination -n till-termination-test --image=alpine --dry-run=client -o json -- sleep infinity | jq '.spec.template.spec.terminationGracePeriodSeconds = 999' | kc apply --dry-run=server -f-
```
