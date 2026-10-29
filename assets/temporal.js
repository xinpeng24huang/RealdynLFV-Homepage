(() => {
  const section = document.querySelector("#time");
  const range = document.querySelector("#frame-slider");
  const output = document.querySelector("#frame-output");
  const cards = [...document.querySelectorAll("[data-time-card]")];
  const previous = document.querySelector("#previous-frame");
  const next = document.querySelector("#next-frame");
  const error = document.querySelector("#time-error");
  let sequence = 0,
    timer;
  function centerSelected() {
    if (!matchMedia("(max-width:760px)").matches) return;
    const strip = section.querySelector(".filmstrip");
    const card = section.querySelector('[data-selected="true"]');
    const a = strip.getBoundingClientRect(),
      b = card.getBoundingClientRect();
    strip.scrollLeft += b.left - a.left - (a.width - b.width) / 2;
  }
  async function showFrame(value) {
    const frame = Math.max(1, Math.min(150, value));
    range.value = frame;
    const start = Math.max(1, Math.min(148, frame - 1));
    const request = ++sequence;
    const items = [start, start + 1, start + 2].map((n) => {
      const image = new Image();
      const src = `assets/media/time0042/frame-${String(n).padStart(3, "0")}.webp`;
      image.src = src;
      return { n, image, src };
    });
    try {
      await Promise.all(items.map((i) => i.image.decode()));
    } catch (_) {
      if (request === sequence) error.textContent = section.dataset.error;
      return;
    }
    if (request !== sequence) return;
    error.textContent = "";
    cards.forEach((card, i) => {
      const { n, src } = items[i],
        image = card.querySelector("img");
      image.src = src;
      image.alt = `${section.dataset.alt} ${n}`;
      card.querySelector("a").href = src;
      const captions = card.querySelectorAll("figcaption span");
      captions[0].textContent = document.documentElement.lang.startsWith("zh")
        ? `第 ${n} 帧`
        : `Frame ${n}`;
      captions[1].textContent = `${(((n - 1) * 1001) / 60000).toFixed(3)} s`;
      card.dataset.selected = String(n === frame);
    });
    range.value = frame;
    section.dataset.frame = frame;
    output.textContent = `${frame} / 150`;
    range.setAttribute(
      "aria-valuetext",
      `${section.dataset.frameWord} ${frame}, ${(((frame - 1) * 1001) / 60000).toFixed(3)} s`,
    );
    previous.disabled = frame === 1;
    next.disabled = frame === 150;
    centerSelected();
  }
  range.addEventListener("input", () => {
    clearTimeout(timer);
    sequence++;
    const value = Number(range.value);
    timer = setTimeout(() => showFrame(value), 60);
  });
  previous.addEventListener("click", () => {
    clearTimeout(timer);
    showFrame(Number(range.value) - 1);
  });
  next.addEventListener("click", () => {
    clearTimeout(timer);
    showFrame(Number(range.value) + 1);
  });
  section.dataset.frame = "91";
  centerSelected();
  document.querySelectorAll(".motion-clip").forEach((clip) => {
    const video = clip.querySelector("video");
    const speed = clip.querySelector(".clip-speed");
    const applySpeed = () => {
      video.playbackRate = Number(speed.value);
    };
    speed.addEventListener("change", applySpeed);
    video.addEventListener("loadedmetadata", applySpeed);
  });
})();
