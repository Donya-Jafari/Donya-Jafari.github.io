(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = new URLSearchParams(location.search).get('theme');
  const valid = value => value === 'dark' || value === 'light';
  let stored;
  try { stored = localStorage.getItem('theme'); } catch (_) { /* Storage is optional. */ }
  let explicit = valid(queryTheme) ? queryTheme : valid(stored) ? stored : null;
  const apply = theme => {
    root.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181c20' : '#fafaf8');
  };
  const persist = theme => { try { localStorage.setItem('theme', theme); } catch (_) { /* Continue without persistence. */ } };
  apply(explicit || (media.matches ? 'dark' : 'light'));
  if (valid(queryTheme)) persist(queryTheme);
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      explicit = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(explicit);
      persist(explicit);
      const url = new URL(location.href);
      if (url.searchParams.has('theme')) {
        url.searchParams.set('theme', explicit);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    });
  });
  media.addEventListener('change', event => { if (!explicit) apply(event.matches ? 'dark' : 'light'); });
  window.addEventListener('storage', event => {
    if (event.key === 'theme') {
      explicit = valid(event.newValue) ? event.newValue : null;
      apply(explicit || (media.matches ? 'dark' : 'light'));
    }
  });
})();
