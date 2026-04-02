# ADR-007: Node-cache with 1-hour TTL

## Status

Accepted

Date: 2026-04-02

## Context

The player dataset is small and changes infrequently. Without caching, every request to list all players or look up a single player hits SQLite. For a PoC this is acceptable, but demonstrating a caching layer is part of the project's educational goal.

Requirements:

- Simple to set up with no external infrastructure (no Redis, no Memcached)
- Lives in the service layer — the database layer should have no cache awareness
- TTL-based expiry is sufficient given the low mutation frequency

## Decision

We will use `node-cache` as an in-memory cache with a 1-hour TTL, owned entirely by `PlayerService`.

- `PlayerService` holds the sole `NodeCache` instance
- Cache keys: `'retrieveAll'`, `` `player_${id}` ``, `` `player_squad_${squadNumber}` ``
- All mutating operations (`createAsync`, `updateAsync`, `deleteAsync`) call `this.cache.flushAll()` — no targeted invalidation
- `PlayerDatabase` has no knowledge of the cache

## Consequences

### Positive

- No external infrastructure required
- Repeated reads are served from memory without hitting SQLite
- Cache ownership is clearly bounded to the service layer
- Simple to reason about: any write flushes everything

### Negative

- In-memory cache is lost on process restart — no persistence or warm-up
- `flushAll()` on every mutation is coarse-grained; a high write rate would negate the cache benefit
- Not suitable for multi-instance deployments where caches would be independent per process

### Neutral

- The 1-hour TTL is appropriate for a demo dataset that rarely changes; a production deployment would tune this based on actual mutation frequency
- Replacing `node-cache` with Redis would require only a change to the `PlayerService` constructor and cache calls — nothing outside the service layer would change
