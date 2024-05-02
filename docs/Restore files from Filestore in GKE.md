---
share: true
---


As there's no way to restore single files or folders, you first have to restore your backup to a new Filestore instance and copy the files manually. I'll use `/filestore_restore` as share name and `192.0.2.69` as the instances IPv4 address. Furthermore I'll use the folder `important-folder` as the example restore.

Then, you have to create a PV and a PVC to consume the share:

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: filestore-restore-nfs
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadOnlyMany
  nfs:
    path: /filestore_restore
    server: 192.0.2.69
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: filestore-restore-nfs
spec:
  accessModes:
    - ReadOnlyMany
  resources:
    requests:
      storage: 1Gi
  storageClassName: ""
  volumeName: filestore-restore-nfs
```

Afterwards, you can create a Pod which mounts this volume (or edit an existing Deployment to directly copy from backup to the original share). E.g. like this:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: filestore-restore
spec:
  containers:
    - name: debian
      image: debian:latest
      volumeMounts:
        - name: filestore-restore
          mountPath: /tmp/restore
      args:
        - -c
        - sleep 10000h
      command:
        - /bin/sh
  volumes:
    - name: filestore-restore
      persistentVolumeClaim:
        claimName: filestore-restore-nfs
```

Then you can either use `kubectl cp` for easy copying or `kubectl exec` with `tar` to preserve permissions, symlinks, etc. I prefer to use `tar` as that's safest:

```bash
kubectl exec filestore-restore -- tar cf - /tmp/restore/important-folder | kubectl exec original-pod -- tar xf - -C /original/data/path
```

If everything has been restored as expected, don't forget to delete PV, PVC, Pod and the filestore instance the backup was restored to.