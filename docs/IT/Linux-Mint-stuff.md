---
share: true
---


## Shutdown Button missing

The source may be a previously interrupted update. If you had to run `sudo dpkg --configure -a` after your next system start, it probably was. Try removing the temporary blocker file: `sudo rm /etc/polkit-1/localauthority/90-mandatory.d/99-mintupdate-temporary.pkla
`
