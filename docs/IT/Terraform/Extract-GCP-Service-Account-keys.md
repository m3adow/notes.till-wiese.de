---
share: true
---

When creating a GCP Service Account key, it may be a bit difficult to get the acutal key, as the module does not export outputs. It doesn't support imports to create keys and then import them into the state file afterwards either.

One easy way is to use a  temporary `null_resource`, when applying locally:

```hcl
resource "google_service_account" "my_service_account" {
  project      = module.project.project_id
  account_id   = "my-service-account"
  display_name = "A Test Service Account"
}

resource "google_service_account_key" "my_service_account_key" {
  service_account_id = google_service_account.my_service_account.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

resource "null_resource" "copy_key_file" {
  provisioner "local-exec" {
    command = "echo '${google_service_account_key.my_service_account_key.private_key}' > /home/m3adow/tmp/my_service_account_key.private"
  }
  depends_on = [google_service_account_key.my_service_account_key]
}
```

Apply to get the Base64 encoded key in `/home/m3adow/tmp/my_service_account_key.private`. Then remove the `null_resource` and apply again, to get it out of your state.