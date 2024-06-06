---
share: true
---

* Set namespace of the Sealed Secrets Controller with env var `SEALED_SECRETS_CONTROLLER_NAMESPACE`
* Get pubkey for offline sealing:

  ```bash
kubeseal --fetch-cert > sealed-secrets-pubkey.pem
  ```

* To encrypt a value from STDIN:

  ```bash
kubeseal --raw --from-file /dev/stdin --scope strict --namespace ${TARGET_NAMESPACE} --name ${SEALED_SECRET_NAME} --cert ~/sealed-secrets-pubkey.pem --kubeconfig /dev/null
  ```

  or (this example uses an offline key):

  ```bash
echo -n "SECRETAPIKEY" | kubectl create secret generic ${SEALED_SECRET_NAME} --dry-run=client --from-file=CF_API_TOKEN=/dev/stdin -o json | kubeseal --scope strict --namespace ${TARGET_NAMESPACE} --cert ${SEALED_SECRETS_OFFLINE_KEY_PATH}$ -o yaml
  ```

* An easy way to collect multiple secrets to seal them is via plain text secret (`stringData`):

  ```yaml
apiVersion: v1
stringData:
  password: Nucular-the-word-is-nucular
  username: homer.simpson
kind: Secret
   ```
