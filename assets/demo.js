(() => {
  const explorer = document.querySelector(".explorer");
  const img = document.querySelector("#selected-view");
  const link = document.querySelector(".selected-view-link");
  const buttons = [...document.querySelectorAll("[data-view]")];
  const label = document.querySelector("#view-label");
  const sweepButton = document.querySelector("#sweep-views");
  const imageError = document.querySelector("#image-error");
  const baseAlt = img.alt.replace(/ C3 \(v12\)$/, "");
  let selected = 12,
    sequence = 0,
    sweepTimer,
    sweeping = false;

  async function selectView(index) {
    const request = ++sequence;
    const button = buttons[index];
    const src = `assets/media/scene0042-view-${button.dataset.view}.webp`;
    const next = new Image();
    next.src = src;
    try {
      await next.decode();
    } catch (_) {
      if (request === sequence) imageError.textContent = explorer.dataset.error;
      return false;
    }
    if (request !== sequence) return false;
    selected = index;
    imageError.textContent = "";
    img.src = src;
    img.alt = `${baseAlt} ${button.dataset.camera} (v${button.dataset.view})`;
    link.href = src;
    label.textContent = `${explorer.dataset.cameraLabel} ${button.dataset.camera} / v${button.dataset.view}`;
    buttons.forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === index)),
    );
    return true;
  }
  function stopSweep() {
    sweeping = false;
    clearTimeout(sweepTimer);
    sweepButton.textContent = sweepButton.dataset.start;
    sweepButton.setAttribute("aria-pressed", "false");
  }
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      stopSweep();
      selectView(i);
    });
    button.addEventListener("keydown", (event) => {
      const row = Math.floor(i / 5),
        col = i % 5;
      const next = {
        ArrowLeft: row * 5 + Math.max(0, col - 1),
        ArrowRight: row * 5 + Math.min(4, col + 1),
        ArrowUp: Math.max(0, row - 1) * 5 + col,
        ArrowDown: Math.min(4, row + 1) * 5 + col,
        Home: row * 5,
        End: row * 5 + 4,
      }[event.key];
      if (next !== undefined) {
        event.preventDefault();
        stopSweep();
        buttons[next].focus();
        selectView(next);
      }
    });
  });
  document.querySelector("#reset-view").addEventListener("click", () => {
    stopSweep();
    selectView(12);
  });
  sweepButton.addEventListener("click", async () => {
    if (sweeping) {
      stopSweep();
      return;
    }
    sweeping = true;
    sweepButton.textContent = sweepButton.dataset.stop;
    sweepButton.setAttribute("aria-pressed", "true");
    let index = 10;
    const tick = async () => {
      if (!sweeping) return;
      const success = await selectView(index);
      if (!success || !sweeping) {
        stopSweep();
        return;
      }
      index = index === 14 ? 10 : index + 1;
      sweepTimer = setTimeout(tick, 850);
    };
    tick();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSweep();
  });
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) stopSweep();
  }).observe(explorer);

  const video = document.querySelector("#scene-video");
  const playButton = document.querySelector("#play-video");
  video.controls = false;
  playButton.hidden = false;
  playButton.addEventListener("click", async () => {
    video.controls = true;
    try {
      await video.play();
      playButton.hidden = true;
    } catch (_) {
      video.controls = false;
    }
  });
  const modeButtons = [...document.querySelectorAll("[data-video]")];
  let videoRequest = 0;
  modeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;
      const request = ++videoRequest;
      const time = video.ended ? 0 : video.currentTime;
      const playing = !video.paused;
      video.pause();
      if (!playButton.hidden) video.controls = false;
      modeButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      video.poster =
        button.dataset.video === "grid"
          ? "assets/media/scene0042-grid-poster.webp"
          : "assets/media/scene0042-poster.webp";
      video.src = `assets/media/scene0042-${button.dataset.video}.mp4`;
      video.addEventListener(
        "loadedmetadata",
        () => {
          if (request !== videoRequest) return;
          video.currentTime = Math.min(
            time,
            Math.max(0, video.duration - 0.05),
          );
          if (playing) video.play().catch(() => {});
        },
        { once: true },
      );
      video.load();
    }),
  );
  const videoError = document.querySelector("#video-error");
  video.addEventListener("error", () => {
    videoError.textContent =
      document.documentElement.lang === "en"
        ? "Video could not load. Use the sample download in Resources."
        : "视频加载失败，可在资源区下载样例。";
  });
  video.addEventListener("loadeddata", () => {
    videoError.textContent = "";
  });

  const copyButton = document.querySelector("#copy-citation");
  copyButton.addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(
        document.querySelector("#bibtex").textContent,
      );
      status.textContent = copyButton.dataset.copied;
    } catch (_) {
      status.textContent = status.dataset.failed;
    }
  });
})();
