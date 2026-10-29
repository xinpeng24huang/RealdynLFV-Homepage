(() => {
  const explorer = document.querySelector(".explorer");
  const img = document.querySelector("#selected-view");
  const link = document.querySelector(".selected-view-link");
  const buttons = [...document.querySelectorAll("[data-view]")];
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const label = document.querySelector("#view-label");
  const sweepButton = document.querySelector("#sweep-views");
  const imageError = document.querySelector("#image-error");
  const isZh = document.documentElement.lang.startsWith("zh");
  let selected = 12,
    sequence = 0,
    sweepTimer,
    sweeping = false,
    sweepRun = 0;
  let activeScene = scenes[0];

  async function selectView(index, scene = activeScene) {
    const request = ++sequence;
    activeScene = scene;
    selected = index;
    const button = buttons[index];
    const src = `${scene.dataset.prefix}${button.dataset.view}.webp`;
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
    activeScene = scene;
    imageError.textContent = "";
    img.src = src;
    img.alt = `${scene.dataset.name}, ${isZh ? "第" : "frame"} ${scene.dataset.frame}, ${explorer.dataset.cameraLabel} ${button.dataset.camera} (v${button.dataset.view})`;
    link.href = src;
    label.textContent = `${explorer.dataset.cameraLabel} ${button.dataset.camera} / v${button.dataset.view}`;
    document.querySelector("#view-frame-label").textContent =
      `${scene.dataset.scene} / ${isZh ? "第" : "Frame"} ${scene.dataset.frame} / t = ${scene.dataset.time} s`;
    document.querySelector("#scene-description").textContent =
      scene.dataset.hint;
    buttons.forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === index)),
    );
    scenes.forEach((b) => b.setAttribute("aria-pressed", String(b === scene)));
    return true;
  }
  function stopSweep() {
    sweeping = false;
    sweepRun++;
    clearTimeout(sweepTimer);
    sweepButton.textContent = sweepButton.dataset.start;
    sweepButton.setAttribute("aria-pressed", "false");
  }
  scenes.forEach((scene) =>
    scene.addEventListener("click", () => {
      stopSweep();
      selectView(selected, scene);
    }),
  );
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
  sweepButton.addEventListener("click", () => {
    if (sweeping) {
      stopSweep();
      return;
    }
    sweeping = true;
    const run = ++sweepRun;
    sweepButton.textContent = sweepButton.dataset.stop;
    sweepButton.setAttribute("aria-pressed", "true");
    let index = 10;
    const tick = async () => {
      if (!sweeping || run !== sweepRun) return;
      const success = await selectView(index);
      if (!sweeping || run !== sweepRun) return;
      if (!success) {
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
  const speed = document.querySelector("#playback-speed");
  speed.addEventListener("change", () => {
    video.defaultPlaybackRate = Number(speed.value);
    video.playbackRate = Number(speed.value);
  });
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
          video.playbackRate = Number(speed.value);
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
