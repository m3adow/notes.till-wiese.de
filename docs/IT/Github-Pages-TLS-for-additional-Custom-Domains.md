---
share: true
---

1. Set a CNAME to your `github.io` address, `m3adow.github.io` in my case: `notes.till-wiese.de.    3600    CNAME    m3adow.github.io.`
2. Set a CAA record for Let's Encrypt `CAA 0 issue letsencrypt.org m3adow.github.io IN 3600`
3. *(Potentially not required)* Set a CNAME for `www.yoursubdomain.yourdomain.com`: `www.notes.till-wiese.de.    3600    CNAME    m3adow.github.io.`

---

**This is very likely deprecated**

If you already have one domain (e.g. `adminswerk.de`) and Github tells you that the enforcement of HTTPS is `Unavailable for your site because your domain is not properly configured to support HTTPS`, try these steps:

Remove the CNAME to the second domain (e.g. `notes.till-wiese.de`) to the first one and use the proper A/AAAA-records from [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) instead. A retriggered DNS check should succeed and you should be able to check the "Enforce HTTPS" option. Afterwards, change the domain back to a CNAME, as Github will eventually report problems.

*This may lead to problems in SSL certificate renewal.*