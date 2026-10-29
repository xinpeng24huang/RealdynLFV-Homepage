(() => {
  const key = 'realdynlfv-language';
  const current = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
  const switcher = document.querySelector('[data-language]');
  let preferred;
  try { preferred = localStorage.getItem(key); } catch (_) { /* Static links remain usable. */ }
  if (current === 'en' && preferred === 'zh') {
    location.replace(new URL('zh.html' + location.hash, location.href).href);
    return;
  }
  if (switcher) switcher.addEventListener('click', () => {
    try { localStorage.setItem(key, switcher.dataset.language); } catch (_) { /* Preference is optional. */ }
    switcher.href = new URL(switcher.getAttribute('href').split('#')[0] + location.hash, location.href).href;
  });
})();
