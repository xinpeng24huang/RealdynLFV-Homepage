/* Small, bounded decode queues; completed files also use the HTTP cache. */
(() => {
  function imagePool(limit = 18, concurrency = 2) {
    const entries = new Map();
    const queue = [];
    let active = 0,
      background = 0;
    function cancel(entry) {
      if (entry.started || entry.cancelled) return;
      entry.cancelled = true;
      entry.resolve(null);
      if (entries.get(entry.src) === entry) entries.delete(entry.src);
    }
    function setDemand(sources) {
      const wanted = new Set(sources);
      queue.forEach((entry) => {
        if (!wanted.has(entry.src)) cancel(entry);
      });
    }
    function trim() {
      for (const [src, entry] of entries) {
        if (entries.size <= limit) break;
        if (entry.done) entries.delete(src);
      }
    }
    function pump() {
      queue.sort((a, b) => b.priority - a.priority);
      while (active < concurrency && queue.length) {
        const index = queue.findIndex(
          (entry) =>
            entry.cancelled || entry.priority || background < concurrency - 1,
        );
        if (index < 0) break;
        const entry = queue.splice(index, 1)[0];
        if (entry.cancelled) continue;
        active++;
        const wasBackground = !entry.priority;
        if (wasBackground) background++;
        entry.started = true;
        const image = new Image();
        entry.image = image;
        image.decoding = "async";
        image.fetchPriority = entry.priority ? "high" : "low";
        image.src = entry.src;
        image
          .decode()
          .then(() => {
            entry.done = true;
            entry.resolve(image);
          })
          .catch((error) => {
            entries.delete(entry.src);
            entry.reject(error);
          })
          .finally(() => {
            active--;
            if (wasBackground) background--;
            trim();
            pump();
          });
      }
    }
    function load(src, low = false) {
      let entry = entries.get(src);
      if (entry) {
        entries.delete(src);
        entries.set(src, entry);
        if (!low) {
          entry.priority = 1;
          if (entry.image) entry.image.fetchPriority = "high";
          pump();
        }
        return entry.promise;
      }
      entry = { src, priority: low ? 0 : 1 };
      entry.promise = new Promise((resolve, reject) => {
        entry.resolve = resolve;
        entry.reject = reject;
      });
      entries.set(src, entry);
      queue.push(entry);
      pump();
      return entry.promise;
    }
    function prefetch(sources) {
      const wanted = new Set(sources.slice(0, 8));
      for (const entry of queue) {
        if (!entry.started && !entry.priority && !wanted.has(entry.src)) {
          cancel(entry);
        }
      }
      wanted.forEach((src) => load(src, true).catch(() => {}));
    }
    return { load, prefetch, setDemand };
  }
  function near(elements, callback, margin = "240px") {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          callback(entry.target);
        }),
      { rootMargin: margin },
    );
    elements.forEach((element) => observer.observe(element));
  }
  near([...document.querySelectorAll("img[data-src]")], (image) => {
    if (image.dataset.src) image.src = image.dataset.src;
    image.removeAttribute("data-src");
  });
  window.RealDynMedia = { imagePool, near };
})();
