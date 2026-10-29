/* Progressive enhancement: real images retain a direct link without JavaScript. */
(() => {
  const dialog = document.querySelector('.image-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  let opener;
  document.querySelectorAll('[data-image-preview]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      const image = link.querySelector('img');
      dialog.querySelector('img').src = link.href;
      dialog.querySelector('img').alt = image.alt;
      dialog.querySelector('p').textContent = image.alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { if (opener) opener.focus(); });
})();
