# Development

Use Ruby 4.0 from `.ruby-version` and Bundler 4 from `Gemfile.lock`. CI and Ruby
version managers use the exact Ruby pin. `nix-shell` derives the Ruby series from
that same file, with the patch release supplied by your nixpkgs. Update nixpkgs if
the selected Ruby package is unavailable. `bundle install` automatically installs
the Bundler version recorded in the lockfile; no separate Bundler pin is needed.

```sh
nix-shell
bundle install
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec jekyll serve --livereload
```

Ruby 4 provides HTML escaping through `cgi/escape`. The generated-site checker
requires that API directly and does not need the full `cgi` gem.

## Article metadata

Every page, post, and draft must have an explicit plain-text `description` in front matter.
That same text is used in HTML/social metadata, JSON-LD, and the search index.
A missing description is a source error caught by the site checks; it is not replaced
with a site tagline or generated excerpt.

Use `last_modified_at` for a recorded article update. This single field drives
JSON-LD, the visible update label, RSS entry updates, and sitemap modification dates.
Preserve the timestamp and timezone when editing metadata. Leave the field absent
when no update date is known; do not introduce aliases for older field names.

## Regression checks

Node.js 26 or newer is used for browser and Lighthouse checks, not to build the site.
CI uses Node.js 26. Regression fixtures use its native Temporal API for timestamps.

```sh
npm ci
npx playwright install chromium webkit
JEKYLL_ENV=production bundle exec jekyll build --trace
npm run check:site
npm test
```

Tests cover Chromium and WebKit at desktop and mobile widths. A temporary site
contains an article fixture. Tests mock external analytics, comments, and embeds;
integration messages and URL parameters are checked. Fixtures, test
dependencies, reports, and development scripts are excluded from published output.
The workflow runs the same checks before uploading the production artifact.

## Lighthouse score checks

After installing the dependencies and browsers above, run:

```sh
npm run lighthouse
npm run check:site -- .lighthouse-site
```

This builds the production site into `.lighthouse-site/`, independently of a
running Jekyll preview, and audits five representative pages: the home page,
archive, two articles (including a gallery), and games, in mobile and desktop
profiles. Each URL runs five times. The default minimum median is **100** for
performance, accessibility, best practices, and SEO. A median of 99 fails a 100-point gate.
Thresholds and URLs live in `lighthouserc.cjs`.

Music is excluded from Lighthouse because its automatic Mixcloud players trigger
third-party cookie audits. Games remains included, with one explicit exception:
its best-practices median must be **96 or higher** because of itch.io cookie
warnings. Its other categories still require 100. Browser regression tests still
cover both pages, including embed sizing and theme synchronization.

Lighthouse CI and Playwright's Chromium are locked in `package-lock.json`.
The audited OS color preference is fixed to light on every host; browser regression
tests separately cover OS and saved light/dark preferences and theme synchronization.
These checks use the actual production output and real external services, without
the browser test mocks. Lighthouse CI's static server uses generated `.html` paths;
canonical URLs stay unchanged. These checks measure a local server, not deployed CDN/TLS
behavior or field Core Web Vitals. Hardware, network, and third-party responses
can still affect scores; compare the same profile and inspect failing audits.

HTML and JSON reports for every run, plus assertion results, are saved under
`lighthouse-reports/mobile/` and `lighthouse-reports/desktop/`, even when a score
fails. CI retains these as a `lighthouse-reports` artifact for 14 days and blocks
deployment on failure. Nothing is uploaded to Lighthouse's public storage.
Reports and audit dependencies are excluded from the published site.

CI uses `npm run lighthouse:check` to audit the production `_site` already built
and checked earlier in the job. Use `npm run lighthouse` locally to build fresh
output before measuring.

## Browser styles and publishing

The supported UI is tested against current Chromium and WebKit. Standard CSS
properties replace obsolete IE, Opera, and prefixed duplicates. Safari-specific
text sizing, font smoothing, image dragging, and search decorations remain because
they still express active behavior rather than an alternative legacy code path.
Only site content and runtime assets are published: Nix, Renovate, Node/test files,
project documentation, and agent instructions are excluded from the site artifact.

The heading-anchor include is locally adapted for accessible link names. The old
compression layout and Simple-Jekyll-Search library have been removed; no legacy
implementations run alongside the current code.
