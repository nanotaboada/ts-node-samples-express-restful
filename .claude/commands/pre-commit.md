Before running the checklist, run `git fetch origin`. If the current branch is behind `origin/master`, stop and rebase before proceeding.

Run the pre-commit checklist for this project:

1. Update `CHANGELOG.md` `[Unreleased]` section — add an entry under the appropriate subsection (Added / Changed / Fixed / Removed) describing the changes made, referencing the issue number.
2. Run `npm run lint` — ESLint must pass.
3. Run `npx tsc --noEmit` — TypeScript must compile clean.
4. Run `npm run coverage` — all tests must pass, coverage maintained.
5. Ask me: were any endpoints added or changed? If yes, run `npm run swagger:docs` to regenerate `swagger.json`.
6. Run `npm run lint:commit` — Conventional Commits validation.
7. If `coderabbit` CLI is installed, run `coderabbit review --type uncommitted --prompt-only`:
   - If actionable/serious findings are reported, stop and address them before proposing the commit.
   - If only nitpick-level findings, report them and continue to the commit proposal.
   - If `coderabbit` is not installed, skip this step with a note.

Run steps 1–4 and 6 (ask about step 5), then run step 7 (CodeRabbit review) if available, report the results clearly, then propose a branch name and commit message for my approval using the format `type(scope): description (#issue)` (max 80 chars; types: `feat` `fix` `chore` `docs` `test` `refactor` `ci` `perf`). Do not create the branch or commit until I explicitly confirm.
