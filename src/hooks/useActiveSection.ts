import { useEffect, useState } from "react";

const SECTIONS = ["catalog", "gallery", "services", "team", "reviews", "contacts"];

function getSectionTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY + 140;

      let best = "";
      let bestTop = -Infinity;

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = getSectionTop(el);
        if (top <= offset && top > bestTop) {
          bestTop = top;
          best = id;
        }
      });

      setActive(best);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Delay initial check to ensure DOM is fully laid out
    const timeout = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return active;
}
