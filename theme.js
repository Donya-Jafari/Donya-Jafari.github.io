(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');

  const applyTheme = (value) => {
    if (value === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  };

  const getPreferredTheme = () => {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('theme');
    if (fromParam === 'dark' || fromParam === 'light') {
      return fromParam;
    }

    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const updateUrlParam = (theme) => {
    const params = new URLSearchParams(window.location.search);
    params.set('theme', theme);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', next);
  };

  const updateLinks = (theme) => {
    const origin = window.location.origin;
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
        return;
      }
      if (/^https?:/i.test(href)) {
        return;
      }
      const url = new URL(href, window.location.href);
      if (origin !== 'null' && url.origin !== origin) {
        return;
      }
      url.searchParams.set('theme', theme);
      link.setAttribute('href', `${url.pathname}?${url.searchParams.toString()}`);
    });
  };

  const initial = getPreferredTheme();
  applyTheme(initial);
  localStorage.setItem('theme', initial);
  updateUrlParam(initial);
  updateLinks(initial);

  button?.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
    updateUrlParam(next);
    updateLinks(next);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && (event.newValue === 'dark' || event.newValue === 'light')) {
      applyTheme(event.newValue);
      updateUrlParam(event.newValue);
      updateLinks(event.newValue);
    }
  });
})();
