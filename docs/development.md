# Development

Use Ruby from `.ruby-version` and Bundler from `Gemfile.lock`.

```sh
nix-shell
bundle install
JEKYLL_ENV=production bundle exec jekyll build --trace
bundle exec jekyll serve --livereload
```

## Article metadata

Use `last_modified_at` for a recorded article update. This single field drives
JSON-LD, the visible update label, RSS entry updates, and sitemap modification dates.
Preserve the timestamp and timezone when editing metadata. Leave the field absent
when no update date is known; do not introduce aliases for older field names.
