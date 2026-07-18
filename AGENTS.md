# AGENTS.md

Guidance for AI coding agents working on flobro-website. Human docs live in README.md
and CONTRIBUTING.md; this file is for you.

## Project

The flobro.app website: static HTML/CSS/JS, no build step, hosted on GitHub Pages.

index.html, privacy.html and code-signing.html contain English inline; i18n/*.json hold the translations; nl/, es/, de/, fr/ and pt-br/ are pre-rendered pages generated with `npm run i18n` (scripts/generate-locale-pages.mjs) and must be regenerated after every content or translation change; css/style.css and js/main.js are the only assets besides fonts/ and assets/.

## Setup

Run `npm install` once to activate git hooks and dev tooling. No build step exists on purpose.

## Commands

- Run locally: `python3 -m http.server 8000 (or any static server) from the repo root; open http://localhost:8000`
- Build: `none, deploys as-is via GitHub Pages`
- Lint: `npm run lint` (Biome). Auto-fix: `npm run lint:fix`
- Tests: npm run lint, then manual: language select on / and /nl/, hero window drag/easter eggs, privacy page

## Code style

- Biome is the formatter and linter: 2-space indent, single quotes, semicolons, line width 100. Do not hand-format against it.
- Plain JavaScript only, no frameworks and no build step. Keep it that way.
- All user-facing strings must exist in BOTH English and Dutch. English is the source language.

## Commits and PRs

- Conventional Commits are enforced by a commit-msg hook: `<type>(<scope>): <description>` with types build/chore/ci/docs/feat/fix/perf/refactor/revert/style/test.
- The changelog is generated from commits (commitizen + Keep a Changelog). Write commit descriptions that read well as release notes.
- Never commit secrets. Analytics keys are public-by-design PostHog project keys, but Apple signing secrets live only in GitHub Actions secrets.

## Boundaries

- Do not add cookies, fingerprinting or any tracking beyond the existing hostname-only PostHog events; the privacy page (flobro.app/privacy.html) is a promise, not decoration.
- Do not add dependencies without a very good reason; the project's identity is being lightweight.
