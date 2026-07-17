# Releasing flobro-website

Developer documentation. The website has no build step and no release pipeline: **every push to `main` deploys** via GitHub Pages to https://flobro.app within a minute or two. There is no tag, no draft and no human gate, so treat a push to `main` as a production deploy.

## Deploy steps

1. Make the change. House rules:
   - every user-facing string exists in English (inline in the HTML) **and** in both `i18n/en.json` and `i18n/nl.json`;
   - no em dashes in copy;
   - no third-party fonts, no cookies, no tracking beyond the documented PostHog events.
2. Lint: `npm run lint` (Biome; needs a platform-matching `node_modules`).
3. Commit as a Conventional Commit (`cz commit`) and push `main`.
4. Verify on https://flobro.app after the Pages build (check the language toggle if you touched i18n).

`cz bump` exists here too and maintains CHANGELOG.md plus a tag, but it is bookkeeping only; tags do not trigger anything for the website.

## Things that update themselves (do not edit by hand)

- **Download buttons** resolve the latest installers client-side from the GitHub API (`js/main.js`); a new app release shows up automatically (visitors may see a cached result for up to one hour).
- The **"Add to Chrome" button** (`id="ext-store"`) points at the stable store listing URL; extension updates never require a site change.

## Fixed references (edit when reality changes)

- Mollie payment link (also in `flobro-app/src/settings.js` and `.github/FUNDING.yml` in three repos): swap when the Flobro Mollie profile is verified.
- `code-signing.html` and its i18n strings: update when Windows signing (SignPath) becomes real.
- Footer links: privacy, code signing policy, documentation wiki, source, bug tracker, legacy Chrome App.

## Troubleshooting

- **Change not visible**: check the Pages build under the repo's Actions tab ("pages build and deployment"), then hard-refresh (the site sets long cache headers via GitHub Pages defaults).
- **HTTPS certificate issues after Pages settings changes**: re-check Enforce HTTPS in Settings, Pages; a publishing-source change can trigger a certificate reissue that temporarily disables it.
