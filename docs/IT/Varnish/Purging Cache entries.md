---
share: true
---

To quickly purge a lot of Varnish cache entries, using `varnishadm` is a good choice.

E.g. If there's a file `tmp/categories` with one cache entry per line, like this:

```
categories/a
categories/b
categories/c
```

a shell one-liner does wonders:

```bash
set -x; while read CATEGORY; do varnishadm ban "req.http.host == www.example.org && req.url == /${CATEGORY}"; sleep .1; done < /tmp/categories; set +x
```

*The sleep is just for cosmetic reasons, remove if it's A LOT of entries.*
