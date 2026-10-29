# my personal website

## development

Use Ruby 3.4.9 and Bundler. `nix-shell` supplies Ruby 3.4; Bundler installs the Jekyll version in `Gemfile.lock`.

```bash
nix-shell
bundle install
JEKYLL_ENV=production bundle exec jekyll build
bundle exec jekyll serve --drafts --incremental
```

## publishing

GitHub Actions builds Jekyll 4.4.1 and deploys `_site` on pushes to `master`. Pull requests run the same build checks without deploying.

## TODO

- maybe add a gap after every 5 posts
- lightmode for syntax highlighting
