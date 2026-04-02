# ADR-008: Use Pino for structured logging

## Status

Accepted

Date: 2026-04-02

## Context

`console.log` is the default logging mechanism in Node.js but produces unstructured text that is difficult to parse, filter, or aggregate in any log management system. A production-grade API should emit structured (JSON) logs that can be consumed by tools like Datadog, Loki, or CloudWatch.

Options considered:

- **console.log**: zero setup, but unstructured and unsuitable for production
- **Winston**: flexible and widely used, but heavier and more complex to configure
- **Morgan**: HTTP request logger only; not a general-purpose logger
- **Pino**: fastest Node.js logger with native JSON output, low overhead, and first-class async transport support

The project targets a modern, production-grade stack for educational purposes. Demonstrating structured logging with correlation IDs is a meaningful part of that goal.

## Decision

We will use Pino as the sole logging mechanism throughout the project. `console.log` is banned.

- Pino is configured in `src/utils/logger.ts` and imported wherever logging is needed
- All log calls use structured fields: `logger.info({ playerId: id, action: 'getPlayer' }, 'Fetching player')`
- Request correlation IDs are attached to each request via middleware and included in all log entries for that request
- `console.log`, `console.error`, and similar are disallowed (enforced by ESLint)

## Consequences

### Positive

- JSON log output is ready for ingestion by any log aggregation pipeline without further parsing
- Correlation IDs make it possible to trace all log entries for a single request
- Pino's performance overhead is minimal compared to alternatives
- Consistent log structure across all layers makes filtering and alerting straightforward

### Negative

- Raw Pino output is less readable in a terminal than plain text; `pino-pretty` is needed for development-friendly output
- Structured logging requires discipline: every log call must include relevant context fields rather than interpolated strings
- Teams unfamiliar with structured logging have a small learning curve

### Neutral

- Pino's transport system allows log destinations (stdout, file, external service) to be changed without modifying application code
