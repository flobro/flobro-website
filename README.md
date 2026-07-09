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
js/main.js        i18n, download resolution, hero interactions
i18n/*.json       Translations (English, Dutch)
fonts/            Self-hosted Inter (subset, variable)
assets/           Favicons and social images
```

## Translations

English lives in the HTML itself; other languages are JSON files in `i18n/` fetched only when selected. To add a language: copy `i18n/en.json`, translate the values, and add the language code to the toggle logic in `js/main.js`.

## Download links

`js/main.js` asks the GitHub API for the latest release of `flobro/flobro-app` and points the buttons straight at the .dmg and Windows installer. Until a release exists, buttons fall back to the releases page.

## License

MIT
