---
share: true
---

If you already have one domain (e.g. `adminswerk.de`) and Github tells you that the enforcement of HTTPS is `Unavailable for your site because your domain is not properly configured to support HTTPS`, try these steps:

Remove the CNAME to the second domain (e.g. `notes.till-wiese.de`) to the first one and use the proper A/AAAA-records from [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) instead. A retriggered DNS check should succeed and you should be able to check the "Enforce HTTPS" option. Afterwards, change the domain back to a CNAME, as Github will eventually report problems.