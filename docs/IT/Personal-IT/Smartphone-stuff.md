---
share: true
---


## Backup

Stuff I need to backup when doing dangerous stuff on my phone like updates, new ROM flashes or repairs

* Neostore Backup
* WhatsApp Backup to Google Drive
* Signal Backup
* Aegis Backup
* Threema Backup
* Podcast Addict Backup
* FolderSync full sync
* DCIM Ordner sichern
* Pictures Ordner sichern
* Magisk Module sichern

## Fairphone 4 Update & Root

To update a rooted Fairphone:

*Hint: Only restore after the procedure, the device will be wiped again, if you relock the bootloader.*

1. Make your backups, your device will probably be wiped
2. [Download](https://support.fairphone.com/hc/en-us/articles/18896094650513-Installing-Fairphone-OS-Manually#01HB8ZZ1BMMQNSNMFT3YXDBXA0) desired update and install it. The bootloader has to be unlocked if it was (re)locked before. If fastboot doesn't find your device, try another USB port (direct mainboard ports worked best for me) and try another cable.
3. Root via [this instruction](https://forum.fairphone.com/t/fp4-root-access-is-possible-maybe-a-bit-risky/76839/43) ([Waybackmachine](http://web.archive.org/web/20230608183842/https://forum.fairphone.com/t/fp4-root-access-is-possible-maybe-a-bit-risky/76839/43)) rooten.
4. [Relock **critical**](https://support.fairphone.com/hc/en-us/articles/10492476238865), but **DO NOT RELOCK THE BOOTLOADER**, as it will most likely brick the phone.
5. If you want to relock the bootloader, run `fastboot flashing get_unlock_ability` before. You should only relock, if it returns `1`.
