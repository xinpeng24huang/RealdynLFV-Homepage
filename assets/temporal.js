(() => {
  const section = document.querySelector("#time");
  const range = document.querySelector("#frame-slider");
  const output = document.querySelector("#frame-output");
  const cards = [...document.querySelectorAll("[data-time-card]")];
  const previous = document.querySelector("#previous-frame");
  const next = document.querySelector("#next-frame");
  const error = document.querySelector("#time-error");
  const loading = section.querySelector(".temporal-loading");
  const strip = section.querySelector(".filmstrip");
  const pool = RealDynMedia.imagePool(12, 3);
  const first = Number(section.dataset.start),
    last = Number(section.dataset.end),
    fps = Number(section.dataset.fps);
  const isZh = document.documentElement.lang.startsWith("zh");
  let sequence = 0,
    timer;
  const path = (n) =>
    `assets/media/time0042/frame-${String(n).padStart(3, "0")}.webp`;
  const caption = (n) => (isZh ? `第 ${n} 帧` : `Frame ${n}`);
  const time = (n) => ((n - 1) / fps).toFixed(6);
  function prefetch(frame) {
    const around = [
      frame,
      frame - 1,
      frame + 1,
      frame - 2,
      frame + 2,
      frame - 3,
      frame + 3,
    ].filter((n) => n >= first && n <= last);
    pool.prefetch(around.map(path));
  }
  function centerSelected() {
    if (!matchMedia("(max-width:760px)").matches) return;
    const card = section.querySelector('[data-selected="true"]');
    strip.scrollLeft +=
      card.getBoundingClientRect().left - strip.getBoundingClientRect().left;
  }
  function indicate(frame) {
    range.value = frame;
    output.textContent = `${frame} / ${last}`;
    range.setAttribute("aria-valuetext", `${caption(frame)}, ${time(frame)} s`);
    previous.disabled = frame === first;
    next.disabled = frame === last;
    strip.setAttribute("aria-busy", "true");
    loading.hidden = false;
  }
  async function showFrame(value) {
    const frame = Math.max(first, Math.min(last, value));
    indicate(frame);
    const start = Math.max(first, Math.min(last - 2, frame - 1));
    const request = ++sequence;
    const indexes = [start, start + 1, start + 2];
    try {
      pool.setDemand(indexes.map(path));
      await Promise.all(indexes.map((n) => pool.load(path(n))));
    } catch (_) {
      if (request === sequence) {
        error.textContent = section.dataset.error;
        loading.hidden = true;
        strip.setAttribute("aria-busy", "false");
      }
      return;
    }
    if (request !== sequence) return;
    error.textContent = "";
    cards.forEach((card, i) => {
      const n = indexes[i],
        image = card.querySelector("img");
      image.removeAttribute("data-src");
      image.src = path(n);
      image.alt = `${section.dataset.alt} ${n}`;
      card.querySelector("a").href =
        `assets/media/time0042/hd/frame-${String(n).padStart(3, "0")}.webp`;
      const captions = card.querySelectorAll("figcaption span");
      captions[0].textContent = caption(n);
      captions[1].textContent = `${time(n)} s`;
      card.dataset.selected = String(n === frame);
    });
    section.dataset.frame = frame;
    strip.setAttribute("aria-busy", "false");
    loading.hidden = true;
    centerSelected();
    prefetch(frame);
  }
  range.addEventListener("input", () => {
    clearTimeout(timer);
    sequence++;
    const value = Number(range.value);
    indicate(value);
    timer = setTimeout(() => showFrame(value), 50);
  });
  previous.addEventListener("click", () => {
    clearTimeout(timer);
    showFrame(Number(range.value) - 1);
  });
  next.addEventListener("click", () => {
    clearTimeout(timer);
    showFrame(Number(range.value) + 1);
  });
  section.dataset.frame = section.dataset.initial;
  centerSelected();
  RealDynMedia.near([strip], () => prefetch(Number(range.value)));
})();
