---
share: true
---

Docker with WifionICE (ICE Wifi):

Dockers default network conflicts with the IP range for the Wifi, resulting in routing problems. Thusly, reconfiguring the Docker Daemon (`/etc/docker/daemon.json`) solves this:

```json
{
  "bip": "172.42.1.1/24",
  "fixed-cidr": "172.42.1.0/25",
  "default-address-pools" : [
  {
    "base" : "172.31.0.0/16",
    "size" : 25
  }]
}
```

Not really sure if the `bip` and `fixed-cidr` are still needed (those are from an older workaround).
