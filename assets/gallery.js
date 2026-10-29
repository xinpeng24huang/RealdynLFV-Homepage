/* Start with the displayed image; request the larger file only after opening. */
(() => {
  const dialog = document.querySelector(".image-viewer");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const displayed = dialog.querySelector("img");
  const status = dialog.querySelector(".viewer-status");
  let opener,
    request = 0;
  document.querySelectorAll("[data-image-preview]").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const current = ++request;
      opener = link;
      const image = link.querySelector("img");
      displayed.src = image.currentSrc || image.src || image.dataset.src;
      displayed.alt = image.alt;
      dialog.querySelector("p").textContent = image.alt;
      status.textContent = dialog.dataset.loading;
      dialog.showModal();
      const larger = new Image();
      larger.fetchPriority = "high";
      larger.src = link.href;
      try {
        await larger.decode();
        if (current !== request || !dialog.open) return;
        displayed.src = larger.src;
        status.textContent = "";
      } catch (_) {
        if (current === request && dialog.open)
          status.textContent = dialog.dataset.error;
      }
    });
  });
  dialog
    .querySelector("button")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    request++;
    displayed.removeAttribute("src");
    if (opener) opener.focus();
  });
})();
