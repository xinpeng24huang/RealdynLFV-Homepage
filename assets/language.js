/* Explicit language links work with or without JavaScript. Keep the section. */
(() => {
  const link = document.querySelector("[data-language]");
  if (!link) return;
  function updateLink() {
    const file = link.getAttribute("href").split("#")[0];
    link.setAttribute("href", file + location.hash);
  }
  updateLink();
  window.addEventListener("hashchange", updateLink);
})();
