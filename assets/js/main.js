(function () {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!prefersDark) {
    document.body.classList.add('theme-light');
  }
})();
