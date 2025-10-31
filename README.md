# my personal website

## development

```bash
nix-shell
bundle install
bundle exec jekyll serve --drafts --incremental
```

## SEO

This site uses jekyll-seo-tag for titles, descriptions, canonical URLs, Open Graph/Twitter cards, and JSON-LD. It also includes:

- robots.txt with a link to the sitemap
- jekyll-sitemap and jekyll-feed
- Breadcrumb JSON-LD on posts

Authoring tips:

- Set a good description in the front matter: `description: ...`
- Optionally set a social preview image per page/post: `image: /path/to/img.jpg`
- Tags help discoverability: `tags: [tag1, tag2]`

Generated SEO tags live in `_includes/header.html`. Site-wide defaults are in `_config.yml` (title, description, image/logo, social links, twitter username).

## TODO

- maybe add a gap after every 5 posts
- lightmode for syntax highlighting
