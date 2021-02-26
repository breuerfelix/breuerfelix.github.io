const body = document.body;

const setUtterancesTheme = theme => {
  const utterances = document.querySelector('.utterances-frame');
  if (!utterances) return;

  utterances.contentWindow.postMessage(
    {type: 'set-theme', theme: `github-${theme}`},
    'https://utteranc.es',
  );
};

const initTheme = theme => {
  if (!theme) theme = body.getAttribute('data-theme');
  localStorage.setItem('theme', theme);
  body.setAttribute('data-theme', theme);
  setUtterancesTheme(theme);
};


window.initTheme = initTheme;
