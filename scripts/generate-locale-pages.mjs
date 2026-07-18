#!/usr/bin/env node
/* Generates the static language pages (/nl/, /es/, /de/, /fr/, /pt-br/) from
 * the English HTML plus the JSON dictionaries in /i18n. Run it manually after
 * changing content or translations, then commit the output:
 *
 *   node scripts/generate-locale-pages.mjs
 *
 * The generated pages are committed so GitHub Pages stays build-free. */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const ORIGIN = 'https://flobro.app';
const LANGS = { nl: 'nl', es: 'es', de: 'de', fr: 'fr', 'pt-br': 'pt-BR' };
const PAGES = ['index.html', 'privacy.html', 'code-signing.html'];

const metaKeys = {
  'index.html': { title: 'meta_title', desc: 'meta_desc' },
  'privacy.html': { title: 'pp_meta_title', desc: 'pp_meta_desc' },
  'code-signing.html': { title: 'cs_meta_title', desc: 'cs_meta_desc' },
};

function pagePath(dir, page) {
  return page === 'index.html' ? `${dir}` : `${dir}${page}`;
}

function hreflangCluster(page) {
  const lines = [];
  lines.push(`  <link rel="canonical" href="__CANONICAL__">`);
  lines.push(`  <link rel="alternate" hreflang="en" href="${ORIGIN}/${pagePath('', page)}">`);
  for (const [dir, code] of Object.entries(LANGS)) {
    lines.push(
      `  <link rel="alternate" hreflang="${code}" href="${ORIGIN}/${pagePath(`${dir}/`, page)}">`,
    );
  }
  lines.push(
    `  <link rel="alternate" hreflang="x-default" href="${ORIGIN}/${pagePath('', page)}">`,
  );
  return lines.join('\n');
}

function escapeText(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function replaceI18n(html, dict) {
  html = html.replace(
    /(<(\w+)\b[^>]*\bdata-i18n="([\w-]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (m, open, _tag, key, _inner, close) =>
      dict[key] !== undefined ? open + escapeText(dict[key]) + close : m,
  );
  html = html.replace(
    /(<(\w+)\b[^>]*\bdata-i18n-html="([\w-]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (m, open, _tag, key, _inner, close) => (dict[key] !== undefined ? open + dict[key] + close : m),
  );
  return html;
}

function buildLd(dict, hreflang, dir) {
  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Flobro',
    operatingSystem: 'macOS, Windows',
    applicationCategory: 'UtilitiesApplication',
    inLanguage: hreflang,
    description: dict.meta_desc,
    url: `${ORIGIN}/${dir}/`,
    downloadUrl: 'https://github.com/flobro/flobro-app/releases/latest',
    license: 'https://opensource.org/license/mit',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    author: { '@type': 'Person', name: 'Martijn Cornips' },
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: hreflang,
    mainEntity: [1, 2, 3, 4].map((n) => ({
      '@type': 'Question',
      name: dict[`faq_q${n}`],
      acceptedAnswer: { '@type': 'Answer', text: dict[`faq_a${n}`] },
    })),
  };
  const wrap = (obj) =>
    `\n  <script type="application/ld+json">\n${JSON.stringify(obj, null, 2)
      .split('\n')
      .map((l) => `  ${l}`)
      .join('\n')}\n  </script>\n  `;
  return { software: wrap(software), faq: wrap(faq) };
}

for (const [dir, hreflang] of Object.entries(LANGS)) {
  const dict = JSON.parse(readFileSync(`i18n/${dir}.json`, 'utf8'));
  mkdirSync(dir, { recursive: true });

  for (const page of PAGES) {
    let html = readFileSync(page, 'utf8');
    const canonical = `${ORIGIN}/${pagePath(`${dir}/`, page)}`;

    html = html.replace('<html lang="en">', `<html lang="${hreflang}">`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${dict[metaKeys[page].title]}</title>`);
    html = html.replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${dict[metaKeys[page].desc]}">`,
    );

    /* canonical + hreflang: strip existing alternates, rebuild the cluster */
    html = html.replace(/^\s*<link rel="alternate" hreflang=[^\n]*\n/gm, '');
    html = html.replace(
      / {2}<link rel="canonical" href="[^"]*">/,
      hreflangCluster(page).replace('__CANONICAL__', canonical),
    );

    /* open graph (home page only carries og tags) */
    html = html.replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${dict.meta_title}">`,
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${dict.og_desc}">`,
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${canonical}">`,
    );

    /* translated text */
    html = replaceI18n(html, dict);

    /* structured data between the ld markers */
    if (page === 'index.html') {
      const ld = buildLd(dict, hreflang, dir);
      html = html.replace(
        /<!-- ld:software:start -->[\s\S]*?<!-- ld:software:end -->/,
        `<!-- ld:software:start -->${ld.software}<!-- ld:software:end -->`,
      );
      html = html.replace(
        /<!-- ld:faq:start -->[\s\S]*?<!-- ld:faq:end -->/,
        `<!-- ld:faq:start -->${ld.faq}<!-- ld:faq:end -->`,
      );
    }

    /* OS-specific download labels */
    html = html.replace('data-mac="Download for Mac"', `data-mac="${dict.dl_mac}"`);
    html = html.replace('data-win="Download for Windows"', `data-win="${dict.dl_win}"`);
    html = html.replace('data-mac="Also on Mac"', `data-mac="${dict.dl_also_mac}"`);
    html = html.replace('data-win="Also on Windows"', `data-win="${dict.dl_also_win}"`);

    /* preselect the language in the switcher */
    html = html.replace(`<option value="${dir}">`, `<option value="${dir}" selected>`);

    /* rewrite relative links and assets for the subdirectory */
    html = html
      .replace(/(href|src)="(css|js|assets|fonts)\//g, '$1="/$2/')
      .replace(/href="privacy\.html"/g, `href="/${dir}/privacy.html"`)
      .replace(/href="code-signing\.html"/g, `href="/${dir}/code-signing.html"`)
      .replace(/href="\/"/g, `href="/${dir}/"`);

    writeFileSync(`${dir}/${page}`, html);
  }
  console.log(`generated ${dir}/ (${PAGES.length} pages)`);
}
