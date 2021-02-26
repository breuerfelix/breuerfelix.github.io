(() => {
  // Theme switch
  const lamp = document.getElementById('mode');

  lamp.addEventListener('click', () =>
    window.initTheme(localStorage.getItem('theme') == 'light' ? 'dark' : 'light')
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById('menu-trigger');

  cbox.addEventListener('change', function () {
    const area = document.querySelector('.wrapper');
    this.checked
      ? area.classList.add('blurry')
      : area.classList.remove('blurry');
  });
})();
