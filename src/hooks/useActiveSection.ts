import { useEffect, useState } from "react";

const SECTIONS = ["catalog", "gallery", "services", "team", "reviews", "contacts"];

function getSectionTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const offset = window.scrollY + 140;

      let best = "";
      let bestTop = -Infinity;

      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = getSectionTop(el);
        if (top <= offset && top > bestTop) {
          bestTop = top;
          best = id;
        }
      }

      setActive((prev) => (prev === best ? prev : best));
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const timeout = setTimeout(update, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return active;
}
