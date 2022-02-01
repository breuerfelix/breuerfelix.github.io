const body = document.body;

const setUtterancesTheme = theme => {
  const utterances = document.querySelector('.utterances-frame');
  if (!utterances) return;

  utterances.contentWindow.postMessage(
    {type: 'set-theme', theme: `github-${theme}`},
    'https://utteranc.es',
  );
};

const setMixcloudTheme = theme => {
  const oldTheme = theme == 'light' ? 'dark' : 'light';
  const selection = document.getElementsByTagName('iframe');
  const iframes = Array.prototype.slice.call(selection);

  iframes.forEach(iframe => {
    if (!iframe.src.match(/mixcloud/g)) {
      return;
    }

    iframe.setAttribute('src', iframe.src.replace(oldTheme, theme));
  });
};

const initTheme = theme => {
  if (!theme) theme = body.getAttribute('data-theme');
  localStorage.setItem('theme', theme);
  body.setAttribute('data-theme', theme);
  setUtterancesTheme(theme);
  setMixcloudTheme(theme);
};


window.initTheme = initTheme;
