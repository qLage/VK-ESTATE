import { useEffect, useState } from "react";

export function useParallax(speed: number = 0.3) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number;
    let latestScrollY = window.scrollY;

    const handleScroll = () => {
      latestScrollY = window.scrollY;
    };

    const loop = () => {
      setOffset(latestScrollY * speed);
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return offset;
}
