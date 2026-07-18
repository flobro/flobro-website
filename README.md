<p align="center">
  <img src=".github/promo.png" alt="Flobro, floating browser window" width="700">
</p>

# flobro.app

The public website of [Flobro](https://flobro.app), the floating browser window for Mac and Windows.

Plain static HTML/CSS/JS, no build step. Hosted on GitHub Pages with the `CNAME` in this repo.

```
index.html        Landing page (English inline)
privacy.html      Privacy, in plain words
css/style.css     All styles
js/main.js        Language switcher, download resolution, hero interactions
i18n/*.json       Translations (en, nl, es, de, fr, pt-br)
fonts/            Self-hosted Inter (subset, variable)
assets/           Favicons and social images
```

## Translations

English lives in the HTML itself; every other language is a pre-rendered static page (`/nl/`, `/es/`, ...) generated from the JSON files in `i18n/`. To add a language: copy `i18n/en.json`, translate the values, add the language to `scripts/generate-locale-pages.mjs` and `js/main.js` (LANGS), add an option to the language select in the three root HTML pages, extend `sitemap.xml`, and run `npm run i18n`. The generated pages are committed, so GitHub Pages stays build-free. After changing any inline English content or translation, rerun `npm run i18n` and commit the regenerated pages together with the source change.

## Download links

`js/main.js` asks the GitHub API for the latest release of `flobro/flobro-app` and points the buttons straight at the .dmg and Windows installer. Until a release exists, buttons fall back to the releases page.

## License

MIT
