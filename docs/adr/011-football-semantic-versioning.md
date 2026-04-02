# ADR-011: Football-themed semantic versioning

## Status

Accepted

Date: 2026-04-02

## Context

This project is one of six cross-language REST API implementations, all managing football player data. Standard semantic version tags (`v1.0.0`, `v1.1.0`) are correct but forgettable — they carry no indication of which repository or domain they belong to, and offer no easy way to talk about releases in conversation.

Several popular projects use codenames (Ubuntu's animal names, Android's desserts, macOS landmarks) to make releases memorable and ordered. A football-themed naming scheme fits the domain of the project and can be applied consistently across all six language repositories.

## Decision

We will append an alphabetically ordered football terminology codename to every release tag.

- Release tags follow the pattern `vMAJOR.MINOR.PATCH-term` (e.g. `v1.0.0-assist`)
- Terms are drawn from a curated list of football/soccer terminology, one per letter A–Z
- Terms are assigned in alphabetical order across releases, independent of the semantic version number
- The full list is maintained in `CHANGELOG.md`

## Consequences

### Positive

- Releases are memorable and easy to reference in conversation ("the `corner` release")
- The alphabetical ordering provides an unambiguous release sequence that is easy to verify at a glance
- The naming scheme reinforces the football domain theme across all six language repositories
- The list covers 26 releases (A–Z), which is sufficient for the expected lifetime of the project

### Negative

- The term list must be maintained and agreed upon; adding new terms mid-alphabet would break the ordering convention
- Contributors unfamiliar with the convention need to look up the next term before cutting a release
- The scheme adds no information beyond a sequence number — it is purely cosmetic

### Neutral

- If the project exceeds 26 releases, the naming scheme would need to be extended or recycled; this is an unlikely constraint given the project's scope
