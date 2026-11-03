const { chromium } = require('@playwright/test');

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const perfectScores = Object.fromEntries(
  categories.map(category => [`categories:${category}`, ['error', { minScore: 1 }]])
);
const profile = process.env.LIGHTHOUSE_PROFILE;
const site = process.env.LIGHTHOUSE_SITE;
if (!['mobile', 'desktop'].includes(profile)) {
  throw new Error('LIGHTHOUSE_PROFILE must be mobile or desktop. Use npm run lighthouse.');
}
if (!site) throw new Error('LIGHTHOUSE_SITE is required. Use npm run lighthouse.');

module.exports = {
  ci: {
    collect: {
      staticDistDir: site,
      url: [
        '/', '/archive.html', '/blog/kubernetes-webhooks.html',
        '/blog/series-monitor.html', '/games.html'
      ].map(path => `http://localhost${path}`),
      numberOfRuns: 5,
      chromePath: chromium.executablePath(),
      settings: {
        ...(profile === 'desktop' ? { preset: 'desktop' } : {}),
        onlyCategories: categories,
        // Fix light OS preference so local and CI hosts audit the same theme.
        chromeFlags: '--no-sandbox --blink-settings=preferredColorScheme=1'
      }
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '^https?://[^/]+/(?!games\\.html(?:[?#]|$))',
          aggregationMethod: 'median',
          assertions: perfectScores
        },
        {
          matchingUrlPattern: '^https?://[^/]+/games\\.html(?:[?#]|$)',
          aggregationMethod: 'median',
          assertions: {
            ...perfectScores,
            // Automatic itch.io embeds currently trigger cookie warnings.
            'categories:best-practices': ['error', { minScore: 0.96 }]
          }
        }
      ]
    },
    upload: {
      target: 'filesystem',
      outputDir: `./lighthouse-reports/${profile}`
    }
  }
};
