require 'json'
require 'cgi'
require 'digest'
require 'rexml/document'
require 'rexml/xpath'

abort 'usage: ruby scripts/check_site.rb [site-directory]' if ARGV.length > 1
site = ARGV.empty? ? File.expand_path('../_site', __dir__) : File.expand_path(ARGV.fetch(0))
baseline = JSON.parse(File.read(File.expand_path('../tests/fixtures/urls.json', __dir__)))
baseline.fetch('html_paths').each { |path| abort "missing page: #{path}" unless File.size?(File.join(site, path)) }
%w[assets/css/style.css assets/js/main.js assets/js/lightbox.js assets/js/search.js feed.xml sitemap.xml redirects.json].each do |path|
  abort "missing output: #{path}" unless File.size?(File.join(site, path))
end
abort 'redirect mappings changed' unless JSON.parse(File.read(File.join(site, 'redirects.json'))) == baseline.fetch('redirects')
search = JSON.parse(File.read(File.join(site, 'assets/search.json')))
search.each do |post|
  %w[title description tags url date].each do |field|
    abort "invalid search #{field}" unless post.fetch(field).is_a?(String) && !post.fetch(field).empty?
  end
end
posts = {}
Dir.glob(File.join(site, '**/*.html')).each do |path|
  html = File.read(path)
  relative_path = path.delete_prefix(site + '/')
  if baseline.fetch('canonicals').key?(relative_path)
    canonicals = html.scan(/<link\b([^>]+)>/).filter_map do |attributes|
      attrs = attributes.first.scan(/([\w:-]+)="([^"]*)"/).to_h
      CGI.unescapeHTML(attrs.fetch('href')) if attrs['rel'] == 'canonical'
    end
    abort "canonical changed: #{relative_path}" unless canonicals == [baseline.fetch('canonicals').fetch(relative_path)]
  end
  html.scan(%r{<script\b[^>]*application/ld\+json[^>]*>(.*?)</script>}m).each do |match|
    data = JSON.parse(match.first)
    description = data.fetch('description')
    abort "missing description: #{path}" unless description.is_a?(String) && !description.empty?
    metadata = {}
    html.scan(/<meta\b([^>]+)>/).each do |attributes|
      attrs = attributes.first.scan(/([\w:-]+)="([^"]*)"/).to_h
      key = attrs['name'] || attrs['property']
      metadata[key] = CGI.unescapeHTML(attrs.fetch('content')) if key && attrs.key?('content')
    end
    %w[description og:description twitter:description].each do |key|
      abort "description mismatch: #{path} #{key}" unless metadata.fetch(key) == description
    end
    abort "incorrect site name: #{path}" unless metadata.fetch('og:site_name') == 'breuer.dev'
    next unless data.fetch('@type') == 'BlogPosting'
    posts[data.fetch('mainEntityOfPage').fetch('@id')] = data
  end
end
abort 'search/structured-data post count differs' unless posts.size == search.size
sitemap = REXML::Document.new(File.read(File.join(site, 'sitemap.xml')))
urls = REXML::XPath.match(sitemap, '//s:loc', 's' => 'http://www.sitemaps.org/schemas/sitemap/0.9').map(&:text)
abort 'existing sitemap URLs missing' unless (baseline.fetch('sitemap_urls') - urls).empty?
REXML::XPath.each(sitemap, '//s:url', 's' => 'http://www.sitemaps.org/schemas/sitemap/0.9') do |entry|
  post = posts[entry.elements['loc'].text]
  next unless post && post.key?('dateModified')
  abort "sitemap update mismatch: #{entry.elements['loc'].text}" unless entry.elements['lastmod'].text == post.fetch('dateModified')
end
feed = REXML::Document.new(File.read(File.join(site, 'feed.xml')))
REXML::XPath.each(feed, '//a:entry', 'a' => 'http://www.w3.org/2005/Atom') do |entry|
  link = entry.elements['link'].attributes['href']
  if baseline.fetch('feed_entries').key?(link)
    expected = baseline.fetch('feed_entries').fetch(link)
    abort "feed identity changed: #{link}" unless expected == { 'id' => entry.elements['id'].text, 'title' => entry.elements['title'].text }
  end
  post = posts[link]
  next unless post && post.key?('dateModified')
  abort "feed update mismatch: #{entry.elements['id'].text}" unless entry.elements['updated'].text == post.fetch('dateModified')
end
%w[AGENTS.md shell.nix renovate.json package.json package-lock.json playwright.config.mjs lighthouserc.cjs lighthouse-reports .lighthouseci .lighthouse-site].each do |path|
  abort "development file published: #{path}" if File.exist?(File.join(site, path))
end

assets = JSON.parse(File.read(File.expand_path('../docs/assets-manifest.json', __dir__)))
assets.fetch('sha256').each do |path, digest|
  abort "vendored asset changed: #{path}" unless Digest::SHA256.file(File.join(site, path)).hexdigest == digest
end

puts "Site checks passed: #{baseline.fetch('html_paths').size} preserved paths, #{posts.size} posts, valid metadata, feeds and redirects."
