---
share: true
---

Very useful if Nextcloud is running as snap or having limited FS access for other reasons. Taking OneDrive as example.

*Created out of memory, so may be spotty.*

## Create encrypted mount

1. To encrypt the storage, follow the rclone documentation:

    * <https://rclone.org/onedrive/>
    * <https://rclone.org/crypt/>

2. Create a [secure SFTP user](https://unix.stackexchange.com/a/542507):
    1. Prepare jail dir

        ```bash
        mkdir -p /srv/jail/nextcloud-mounts/home
        chown root:root /srv/jail/nextcloud-mounts
        chmod 755 /srv/jail/nextcloud-mounts
        ```

    2. Create user

        ```bash
        useradd -s /sbin/nologin -U -M \
            -c "User to mount rclone drives for Nextcloud" \
            -d /srv/jail/nextcloud-mounts/home \
            nextcloud-mounts
        ```

    3. Fix permissions and add symlinks

        ```bash
        chown nextcloud-mounts: /srv/jail/nextcloud-mounts/home
        chmod 750 /srv/jail/nextcloud-mounts/home
        cd /srv/jail/nextcloud-mounts/
        ln -s . jail
        ln -s . nextcloud-mounts
        ```

    4. Add match block for that user to the end of the `/etc/ssh/sshd_config/`, (`/etc/ssh/sshd_config.d/` didn't work, didn't bother to check why), may need to [add `Match All`](https://unix.stackexchange.com/a/303982) at the end of the block:

        ```
        Match User nextcloud-mounts
            ChrootDirectory /home/nextcloud-mounts
            ForceCommand internal-sftp
            AllowTcpForwarding no
            PermitTunnel no
            AllowAgentForwarding no
            X11Forwarding no
        Match All
        ```

    5. Restart ssh

        ```bash
        systemctl restart ssh
        ```

3. Create a systemd unit file for the `rclone mount` command (adapted from [here](https://www.jamescoyle.net/how-to/3116-rclone-systemd-startup-mount-script)), e.g. `/etc/systemd/system/nextcloud-mount-encrypted.service`

    ```systemd
    [Unit]
    Description=Mount encrypted OneDrive (rclone)
    AssertPathIsDirectory=/srv/jail/nextcloud-mounts/home/onedrive-encrypted
    After=network.target

    [Service]
    Type=simple
    ExecStart=/usr/bin/rclone mount \
        --allow-other \
        --buffer-size=250M \
        --cache-chunk-path=/tmp/rclone/chunks \
        --cache-db-path=/tmp/rclone/db \
        --cache-dir=/tmp/rclone/vfs \
        --cache-info-age=30m \
        --cache-tmp-upload-path=/tmp/rclone/onedrive-encrypted \
        --cache-workers=8 \
        --cache-writes \
        --checkers=16 \
        --dir-cache-time=30m \
        --drive-use-trash \
        --gid=1001 \ # GID of nextcloud-mounts user
        --no-modtime \
        --stats=0 \
        --uid=1001 \ # UID of nextcloud-mounts user
        --vfs-cache-mode=full \
        --vfs-disk-space-total-size=1G \
        --vfs-cache-max-size=1G \
        onedrive-encrypted:/rclone /srv/jail/nextcloud-mounts/home/onedrive-encrypted
    ExecStop=/bin/fusermount -u /srv/jail/nextcloud-mounts/home/onedrive-encrypted
    Restart=always
    RestartSec=10
    # rclone serve may exit with 143, see: https://forum.rclone.org/t/cant-gracefully-close-rclone-mount/31490/21
    SuccessExitStatus=143

    [Install]
    WantedBy=default.target
    ```

4. Start and enable the service

    ```bash
    systemctl daemon-reload \
        && systemctl start nextcloud-mount-encrypted.service \
        && systemctl enable nextcloud-mount-encrypted.service
    ```

5. Create a SSH key for Nextcloud

    ```bash
    ssh-keygen -t rsa -b 2048 -N '' -C "Nextcloud external storage SFTP key" -f ~/.ssh/nextcloud-mount-encrypted.rsa
    ```

6. Add to `authorized_keys` of `nextcloud-mounts` user (`.ssh` dir may require creation and `chmod`ing)

## Add mount to Nextcloud
1. Add ["External Storage Support" Addon](https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/external_storage_configuration_gui.html)
2. Add [SFTP backend](https://docs.nextcloud.com/server/latest/admin_manual/configuration_files/external_storage/sftp.html)

    * **Authentication:** RSA private key
    * **Host:** `localhost`
    * **Root:** `/srv/jail/nextcloud-mounts/home/onedrive-encrypted`
    * **Username:** `nextcloud-mounts`
    * **Private Key:** The key we created before
