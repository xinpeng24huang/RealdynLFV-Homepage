(() => {
  const explorer = document.querySelector(".explorer");
  const stage = document.querySelector(".view-stage");
  const img = document.querySelector("#selected-view");
  const link = document.querySelector(".selected-view-link");
  const buttons = [...document.querySelectorAll("[data-view]")];
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const label = document.querySelector("#view-label");
  const loading = document.querySelector("#view-loading");
  const sweepButton = document.querySelector("#sweep-views");
  const imageError = document.querySelector("#image-error");
  const pool = RealDynMedia.imagePool(18, 2);
  const isZh = document.documentElement.lang.startsWith("zh");
  let selected = 12,
    sequence = 0,
    sweepTimer,
    sweeping = false,
    sweepRun = 0;
  let activeScene = scenes[0],
    nearby = false;
  const source = (scene, i) =>
    `${scene.dataset.prefix}${String(i).padStart(2, "0")}.webp`;
  function neighbors(i) {
    const r = Math.floor(i / 5),
      c = i % 5;
    return [
      i,
      ...(c > 0 ? [i - 1] : []),
      ...(c < 4 ? [i + 1] : []),
      ...(r > 0 ? [i - 5] : []),
      ...(r < 4 ? [i + 5] : []),
    ];
  }
  function warm(scene = activeScene, indexes = neighbors(selected)) {
    pool.prefetch(indexes.map((i) => source(scene, i)));
  }
  // The current image is already in the page; adjacent views wait until the explorer is near.
  RealDynMedia.near([explorer], () => {
    nearby = true;
    warm();
  });
  async function selectView(index, scene = activeScene) {
    const request = ++sequence;
    activeScene = scene;
    selected = index;
    const button = buttons[index],
      src = source(scene, index);
    buttons.forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === index)),
    );
    scenes.forEach((b) => b.setAttribute("aria-pressed", String(b === scene)));
    stage.setAttribute("aria-busy", "true");
    loading.textContent = `${explorer.dataset.loading} ${scene.dataset.name} · ${button.dataset.camera}`;
    loading.hidden = false;
    imageError.textContent = "";
    try {
      pool.setDemand(
        sweeping ? [10, 11, 12, 13, 14].map((i) => source(scene, i)) : [src],
      );
      await pool.load(src);
    } catch (_) {
      if (request === sequence) {
        stage.setAttribute("aria-busy", "false");
        loading.hidden = true;
        imageError.textContent = explorer.dataset.error;
      }
      return false;
    }
    if (request !== sequence) return false;
    img.src = src;
    img.alt = `${scene.dataset.name}, ${isZh ? "第 " + scene.dataset.frame + " 帧" : "frame " + scene.dataset.frame}, ${button.dataset.camera} (v${button.dataset.view})`;
    link.href = `${scene.dataset.hdPrefix}${button.dataset.view}.webp`;
    label.textContent = `${explorer.dataset.cameraLabel} ${button.dataset.camera} / v${button.dataset.view}`;
    document.querySelector("#view-frame-label").textContent =
      `${scene.dataset.scene} / ${isZh ? "第 " + scene.dataset.frame + " 帧" : "Frame " + scene.dataset.frame} / t = ${scene.dataset.time} s`;
    document.querySelector("#scene-description").textContent =
      scene.dataset.hint;
    stage.setAttribute("aria-busy", "false");
    loading.hidden = true;
    if (nearby && !sweeping) warm();
    return true;
  }
  function stopSweep() {
    sweeping = false;
    sweepRun++;
    clearTimeout(sweepTimer);
    sweepButton.textContent = sweepButton.dataset.start;
    sweepButton.setAttribute("aria-pressed", "false");
  }
  scenes.forEach((scene) => {
    const prepare = () => warm(scene, neighbors(selected).slice(0, 3));
    scene.addEventListener("pointerenter", prepare);
    scene.addEventListener("focus", prepare);
    scene.addEventListener("touchstart", prepare, { passive: true });
    scene.addEventListener("click", () => {
      stopSweep();
      selectView(selected, scene);
    });
  });
  buttons.forEach((button, i) => {
    const prepare = () => pool.prefetch([source(activeScene, i)]);
    button.addEventListener("pointerenter", prepare);
    button.addEventListener("focus", prepare);
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
  const warmRow = () => warm(activeScene, [10, 11, 12, 13, 14]);
  sweepButton.addEventListener("pointerenter", warmRow);
  sweepButton.addEventListener("focus", warmRow);
  sweepButton.addEventListener("click", () => {
    if (sweeping) {
      stopSweep();
      return;
    }
    sweeping = true;
    warmRow();
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
      sweepTimer = setTimeout(tick, 650);
    };
    tick();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSweep();
  });
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) stopSweep();
  }).observe(explorer);

  const videos = [...document.querySelectorAll("video")];
  let activePlayback;
  function prepareVideo(video) {
    if (video.dataset.poster) {
      video.poster = video.dataset.poster;
      delete video.dataset.poster;
    }
    const source = video.querySelector("source[data-src]");
    if (source) {
      source.src = source.dataset.src;
      delete source.dataset.src;
      video.preload = "metadata";
      video.load();
    }
  }
  RealDynMedia.near(
    videos.filter((v) => v.id !== "scene-video"),
    prepareVideo,
  );
  videos.forEach((video) => {
    const button = video.parentElement.querySelector("[data-play-video]");
    const speed =
      video.id === "scene-video"
        ? document.querySelector("#playback-speed")
        : video.closest(".motion-clip").querySelector(".clip-speed");
    const resetButton = (ended = false) => {
      button.textContent = ended ? button.dataset.replay : button.dataset.play;
      button.disabled = false;
      button.hidden = false;
    };
    const applySpeed = () => {
      video.defaultPlaybackRate = Number(speed.value);
      video.playbackRate = Number(speed.value);
    };
    video.controls = false;
    resetButton();
    speed.addEventListener("change", applySpeed);
    video.addEventListener("loadedmetadata", applySpeed);
    button.addEventListener("pointerenter", () => prepareVideo(video));
    button.addEventListener("focus", () => prepareVideo(video));
    button.addEventListener("click", async () => {
      activePlayback = video;
      videos.forEach((v) => {
        if (v !== video) v.pause();
      });
      prepareVideo(video);
      if (video.ended) video.currentTime = 0;
      button.textContent = button.dataset.loading;
      button.disabled = true;
      if (video.id !== "scene-video") {
        // A short lead avoids an early stall when a visitor jumps straight to a clip.
        video.preload = "auto";
        await new Promise((resolve) => {
          const deadline = performance.now() + 1800;
          const ready = () => {
            const position = video.currentTime;
            const end = video.buffered.length
              ? video.buffered.end(video.buffered.length - 1)
              : 0;
            if (
              activePlayback !== video ||
              video.error ||
              end - position >= 0.4 ||
              performance.now() >= deadline
            )
              resolve();
            else setTimeout(ready, 40);
          };
          ready();
        });
        if (activePlayback !== video) {
          resetButton();
          return;
        }
      }
      video.controls = true;
      try {
        await video.play();
      } catch (_) {
        resetButton();
      }
    });
    video.addEventListener("play", () => {
      if (video.paused) return;
      activePlayback = video;
      videos.forEach((v) => {
        if (v !== video) v.pause();
      });
    });
    video.addEventListener("playing", () => {
      if (video.paused) return;
      button.hidden = true;
      button.disabled = false;
    });
    video.addEventListener("ended", () => {
      if (activePlayback === video) activePlayback = null;
      resetButton(true);
    });
    video.addEventListener("error", () => {
      resetButton();
    });
  });
  const video = document.querySelector("#scene-video");
  const playButton = document.querySelector("#play-video");
  const modeButtons = [...document.querySelectorAll("[data-video]")];
  let videoRequest = 0;
  modeButtons.forEach((button) =>
    button.addEventListener("click", () => {
      if (button.getAttribute("aria-pressed") === "true") return;
      const request = ++videoRequest,
        time = video.ended ? 0 : video.currentTime,
        resume = !video.paused && !video.ended;
      video.pause();
      modeButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      playButton.textContent = playButton.dataset.play;
      playButton.hidden = false;
      playButton.disabled = false;
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
          if (resume && activePlayback === video) video.play().catch(() => {});
        },
        { once: true },
      );
      video.load();
    }),
  );
  const videoError = document.querySelector("#video-error");
  video.addEventListener("error", () => {
    videoError.textContent = isZh
      ? "视频加载失败，可在资源区下载样例。"
      : "Video could not load. The sample is available in Resources.";
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
