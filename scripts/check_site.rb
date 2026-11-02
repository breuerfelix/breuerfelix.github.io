require 'json'
require 'rexml/document'
require 'rexml/xpath'

site = File.expand_path('../_site', __dir__)
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
  html.scan(%r{<script\b[^>]*application/ld\+json[^>]*>(.*?)</script>}m).each do |match|
    data = JSON.parse(match.first)
    next unless data.fetch('@type') == 'BlogPosting'
    posts[data.fetch('mainEntityOfPage').fetch('@id')] = data
  end
end
abort 'search/structured-data post count differs' unless posts.size == search.size
sitemap = REXML::Document.new(File.read(File.join(site, 'sitemap.xml')))
REXML::XPath.each(sitemap, '//s:url', 's' => 'http://www.sitemaps.org/schemas/sitemap/0.9') do |entry|
  post = posts[entry.elements['loc'].text]
  next unless post && post.key?('dateModified')
  abort "sitemap update mismatch: #{entry.elements['loc'].text}" unless entry.elements['lastmod'].text == post.fetch('dateModified')
end
feed = REXML::Document.new(File.read(File.join(site, 'feed.xml')))
REXML::XPath.each(feed, '//a:entry', 'a' => 'http://www.w3.org/2005/Atom') do |entry|
  post = posts[entry.elements['link'].attributes['href']]
  next unless post && post.key?('dateModified')
  abort "feed update mismatch: #{entry.elements['id'].text}" unless entry.elements['updated'].text == post.fetch('dateModified')
end
%w[AGENTS.md package.json package-lock.json playwright.config.mjs].each do |path|
  abort "development file published: #{path}" if File.exist?(File.join(site, path))
end
puts "Site checks passed: #{baseline.fetch('html_paths').size} preserved paths, #{posts.size} posts, valid metadata, feeds and redirects."
