# ADR-010: Use tsx instead of ts-node

## Status

Accepted

Date: 2026-04-02

## Context

Running TypeScript directly in development (without a separate compile step) requires a TypeScript executor. The two main options at the time of this decision were:

- **ts-node**: the established option, but requires `--esm` or `--loader` flags for native ESM support, which were experimental in older Node.js versions and added startup overhead
- **tsx**: a newer executor built on esbuild that handles ESM natively, requires no flags, and starts faster

The project uses native ESM (see ADR-003), which made ts-node's ESM support the key differentiator. tsx had no experimental flags requirement and provided noticeably faster cold-start times in development.

## Decision

We will use `tsx` as the TypeScript executor for development and scripts.

- `tsx` is listed as a dev dependency
- `package.json` scripts use `tsx` for `dev` (via nodemon) and any direct TypeScript execution
- No `--esm`, `--loader`, or experimental flags are needed

## Consequences

### Positive

- Faster TypeScript execution in development — no compilation step, esbuild transpilation is near-instant
- Native ESM support without experimental flags
- Simpler script invocations: `tsx src/server.ts` rather than `node --loader ts-node/esm src/server.ts`

### Negative

- tsx transpiles but does not type-check; type errors are only caught by running `tsc --noEmit` separately
- Smaller community and fewer plugins compared to ts-node
- Adds a dependency that is distinct from the TypeScript compiler, meaning two tools must be kept in sync with the TypeScript version

### Neutral

- The repository name contains `ts-node` for historical reasons but this is purely cosmetic
- tsx is used only in development and CI pre-commit; the production build uses `tsc` and runs compiled JavaScript
