// Pure JS mouse parallax — direct DOM manipulation, no React state
(function () {
  if (typeof window === "undefined") return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const smooth = 0.08;

  window.addEventListener(
    "mousemove",
    (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = (e.clientX - cx) / cx;
      targetY = (e.clientY - cy) / cy;
    },
    { passive: true }
  );

  function tick() {
    currentX += (targetX - currentX) * smooth;
    currentY += (targetY - currentY) * smooth;

    const els = document.querySelectorAll<HTMLElement>("[data-parallax]");
    els.forEach((el) => {
      const intensity = parseFloat(el.dataset.parallax || "20");
      const ix = el.dataset.parallaxInvertX === "true" ? -1 : 1;
      const iy = el.dataset.parallaxInvertY === "true" ? -1 : 1;
      const ox = currentX * intensity * ix;
      const oy = currentY * intensity * iy;
      // Combine with existing transform if any (preserve animations)
      const existing = el.dataset.parallaxBase || "";
      el.style.transform = existing
        ? `${existing} translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`
        : `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px)`;
    });

    requestAnimationFrame(tick);
  }

  tick();
})();
