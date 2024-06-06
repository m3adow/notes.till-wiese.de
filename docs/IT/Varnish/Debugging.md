---
share: true
---

## Checking cache hits/misses

* Use `varnishlog -g request -q 'ReqURL ~ "^/some/path/"'` to filter
* Check Requests for `VCL_call` with `MISS`, `PASS` or `HIT`
* Normally, an unpaged cache will be either be `MISS`ed or `PASS`ed, the next request should `HIT`
* If Varnish is clustered, the request may be `PASS`ed to the responsible instance, so control all instances

## Useful Prometheus queries

*Probably only applicable for Varnish Plus*

* `varnish_msestore_g_alloc_bytes`: In-memory cache size
* `rate(varnish_mse_n_lru_nuked[5m])`: Eviction rate for cached objects in MSE -> Too many (case-by-case defintion) may hint to the MSE cache being too small
