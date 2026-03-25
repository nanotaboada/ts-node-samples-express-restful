Run the pre-commit checklist for this project:

1. Remind me to update `CHANGELOG.md` `[Unreleased]` section (Added / Changed / Fixed / Removed) — I must do this manually.
2. Run `npm run lint` — ESLint must pass.
3. Run `npx tsc --noEmit` — TypeScript must compile clean.
4. Run `npm run coverage` — all tests must pass, coverage maintained.
5. Ask me: were any endpoints added or changed? If yes, run `npm run swagger:docs` to regenerate `swagger.json`.
6. Run `npm run lint:commit` — Conventional Commits validation.

Run steps 2–4 and 6 (ask about step 5), report the results clearly, then propose a branch name and commit message for my approval using the format `type(scope): description (#issue)` (max 80 chars; types: `feat` `fix` `chore` `docs` `test` `refactor` `ci` `perf`). Do not create the branch or commit until I explicitly confirm.
