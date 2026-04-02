# ADR-004: Use Express 5

## Status

Accepted

Date: 2026-04-02

## Context

Express 4 was the de-facto Node.js web framework for over a decade. Express 5 had been in development for several years and entered Release Candidate status. The key improvements relevant to this project were:

- Async error propagation: in Express 4, unhandled promise rejections in route handlers silently hang or crash the process; Express 5 forwards them to error-handling middleware automatically
- Dropped legacy path-matching syntax that was a source of subtle routing bugs
- Cleaner API surface for the patterns this project uses (router, middleware, error handlers)

The project targets a modern stack as part of a cross-language comparison, making a conservative choice (staying on Express 4) less appropriate than adopting the next stable version.

## Decision

We will use Express 5.

- `express` is pinned to `^5.x` in `package.json`
- Route handlers use `async/await` directly, relying on Express 5's automatic async error forwarding
- No `express-async-errors` patch or manual `try/catch` wrapping in middleware chains is needed for error propagation

## Consequences

### Positive

- Async errors in route handlers are automatically forwarded to error middleware — no silent hangs
- Path matching is more predictable and consistent
- The project stays on the current Express major version as it stabilises

### Negative

- Express 5 was in RC at the time of adoption, meaning breaking changes were possible before the final release
- Some community middleware and tutorials still target Express 4; occasional API differences require attention

### Neutral

- Express 5's core API is largely compatible with Express 4 for the patterns used here; migration from 4 to 5 was low-effort
