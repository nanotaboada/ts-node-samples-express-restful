# ADR-003: Use Native ESM instead of CommonJS

## Status

Accepted

Date: 2026-04-02

## Context

Node.js supported only CommonJS (`require` / `module.exports`) for most of its history. Native ECMAScript Modules (ESM) — using `import` / `export` — became stable in Node.js 12 and are now the standard module format for the JavaScript ecosystem.

At the time this project was set up, the TypeScript + Node.js ESM story had matured:

- TypeScript can emit native ESM via `"module": "NodeNext"` in `tsconfig.json`
- Node.js resolves ESM modules at runtime with no extension inference — `.js` extensions in imports are mandatory
- Many modern packages (including some used here) ship ESM-only builds

The alternative — CommonJS with `ts-node`'s `esm` shim — adds complexity and hides the true runtime behaviour behind a compatibility layer.

## Decision

We will use native ESM throughout the project.

- `"type": "module"` is set in `package.json`, making all `.js` files ESM by default
- `tsconfig.json` uses `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`
- All relative imports include the `.js` extension explicitly (e.g. `import { foo } from './foo.js'`)
- No CommonJS interop shims are used

## Consequences

### Positive

- Module resolution matches what Node.js actually does at runtime — no hidden translation layer
- Compatible with ESM-only packages without workarounds
- Aligns with the direction of the JavaScript ecosystem

### Negative

- Every relative import requires an explicit `.js` extension; omitting it causes a `MODULE_NOT_FOUND` error at runtime even though `tsc` compiles cleanly — a common source of confusion
- Some tooling (older Jest versions, some editors) required additional configuration for ESM support
- Dynamic `require()` is unavailable; top-level `await` must be used deliberately

### Neutral

- The repository name contains `ts-node` for historical reasons but the project now uses `tsx` for execution (see ADR-010)
