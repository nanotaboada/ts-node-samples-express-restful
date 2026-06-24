# ADR-013: Use Full-Replace PUT as the Partial Update Strategy

## Status

Accepted

Date: 2026-06-10

## Context

HTTP defines PUT (full replacement) and PATCH (partial update). Both are
standard; the choice affects API surface complexity, client requirements,
and server-side validation. For a resource as small as a player object,
the tradeoff between the two methods is relevant.

## Decision

We use PUT for all player update operations (`PUT /players/squadNumber/:n`).
The request body must contain the full player representation; the server
replaces the stored resource entirely. No PATCH endpoint is provided at
this time. A PATCH implementation is tracked in the project backlog and
remains under active consideration.

## Consequences

### Positive

- Simpler server-side implementation — single validation path, no
  partial-update merge logic
- PUT semantics are idempotent and well-understood
- Consistent with all sibling repos in the cross-language comparison set

### Negative

- Clients must send the full resource even for single-field changes;
  fine-grained updates require a GET + full PUT round-trip
- PATCH remains in the backlog — if implemented, this ADR will be
  superseded

### Neutral

- Standard REST semantics; no ambiguity about the update contract for
  current consumers
