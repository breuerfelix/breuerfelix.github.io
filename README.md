# my personal website

## development

Use Ruby 4.0 and Bundler 4. `.ruby-version` pins Ruby for CI and version managers;
`Gemfile.lock` pins Bundler and gems. `nix-shell` reads the Ruby series from
`.ruby-version`; its patch release follows your nixpkgs. Use a Ruby version manager
when you need the exact CI patch release. Bundler installs its locked version
automatically when you run `bundle install`.

```bash
nix-shell
bundle install
JEKYLL_ENV=production bundle exec jekyll build
bundle exec jekyll serve --drafts --incremental
```

See [development checks](docs/development.md) for browser and Lighthouse setup.

## publishing

GitHub Actions builds Jekyll 4.4.1 and deploys `_site` on pushes to `master`. Pull requests run the same build checks without deploying.

## TODO

- maybe add a gap after every 5 posts
- lightmode for syntax highlighting
