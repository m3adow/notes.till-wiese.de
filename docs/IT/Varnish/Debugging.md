---
share: true
---

## Checking cache hits/misses

* Use `varnishlog -g request -q 'ReqURL ~ "^/some/path/"'` to filter
* Check Requests for `VCL_call` with `MISS`, `PASS` or `HIT`
* Normally, an unpaged cache will be either be `MISS`ed or `PASS`ed, the next request should `HIT`
*  If Varnish is clustered, the request may be `PASS`ed to the responsible instance, so control all instances
