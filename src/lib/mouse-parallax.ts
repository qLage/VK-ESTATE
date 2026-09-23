// Mouse parallax — desktop only, pauses when idle, no per-frame querySelectorAll
(function () {
  if (typeof window === "undefined") return;

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wideEnough = window.matchMedia("(min-width: 1024px)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!finePointer || !wideEnough || reduceMotion) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = 0;
  let running = false;
  const smooth = 0.08;
  const idleEpsilon = 0.001;

  let els: HTMLElement[] = [];

  const refreshEls = () => {
    els = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  };

  const tick = () => {
    currentX += (targetX - currentX) * smooth;
    currentY += (targetY - currentY) * smooth;

    for (const el of els) {
      const intensity = parseFloat(el.dataset.parallax || "20");
      const ix = el.dataset.parallaxInvertX === "true" ? -1 : 1;
      const iy = el.dataset.parallaxInvertY === "true" ? -1 : 1;
      const ox = currentX * intensity * ix;
      const oy = currentY * intensity * iy;
      const existing = el.dataset.parallaxBase || "";
      el.style.transform = existing
        ? `${existing} translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`
        : `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
    }

    const settled =
      Math.abs(targetX - currentX) < idleEpsilon &&
      Math.abs(targetY - currentY) < idleEpsilon;

    if (settled) {
      running = false;
      rafId = 0;
      return;
    }

    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    refreshEls();
    if (els.length === 0) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
      start();
    },
    { passive: true }
  );

  window.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        running = false;
      }
    },
    { passive: true }
  );
})();
