# Development

Use Ruby from `.ruby-version` and Bundler from `Gemfile.lock`.

```sh
nix-shell
bundle install
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec jekyll serve --livereload
```

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

Node.js 24 or newer is used only for browser tests, not to build the site.

```sh
npm ci
npx playwright install chromium webkit
JEKYLL_ENV=production bundle exec jekyll build --trace
npm run check:site
npm test
```

Tests cover Chromium and WebKit at desktop and mobile widths. A temporary site
contains the regression article, with real MathJax 3.2.2 assets supplied by the
locked development dependency. External analytics, comments, and embed services
are mocked; integration messages and URL parameters are checked. Fixtures, test
dependencies, reports, and development scripts are excluded from published output.
The workflow runs the same checks before uploading the production artifact.

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
