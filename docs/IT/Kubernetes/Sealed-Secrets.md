---
share: true
---

* Set namespace of the Sealed Secrets Controller with env var `SEALED_SECRETS_CONTROLLER_NAMESPACE`
* Get pubkey for offline sealing:

```bash
kubeseal --fetch-cert > sealed-secrets-pubkey.pem
```

* To encrypt a value:

```bash
kubeseal --raw --from-file /dev/stdin --scope strict --namespace ${TARGET_NAMESPACE} --name ${SEALED_SECRET_NAME} --cert ~/sealed-secrets-pubkey.pem --kubeconfig /dev/null
```
