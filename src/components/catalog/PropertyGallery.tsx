import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { PLACEHOLDER_IMAGE } from "@/lib/property";

interface PropertyGalleryProps {
  photos: string[];
  alt: string;
  activeIndex: number;
  onChange: (index: number) => void;
}

export function PropertyGallery({ photos, alt, activeIndex, onChange }: PropertyGalleryProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const total = photos.length;
  const current = photos[Math.min(activeIndex, Math.max(total - 1, 0))] || PLACEHOLDER_IMAGE;
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  const go = (index: number) => {
    if (total === 0) return;
    onChange((index + total) % total);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(activeRef.current - 1);
      if (event.key === "ArrowRight") go(activeRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.querySelector<HTMLElement>(`[data-thumb="${activeIndex}"]`);
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIndex]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-800 h-[220px] sm:h-[260px] lg:h-[300px]">
        <LazyImage
          src={current}
          alt={alt}
          placeholder={PLACEHOLDER_IMAGE}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => go(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/55 border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => go(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/55 border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between px-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Фото {activeIndex + 1}/{total}
          </p>
        </div>
      )}

      {total > 1 && (
        <div ref={stripRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {photos.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              data-thumb={index}
              onClick={() => onChange(index)}
              className={`relative shrink-0 overflow-hidden rounded-lg h-12 w-16 sm:h-14 sm:w-[4.5rem] border transition-all ${
                index === activeIndex ? "border-primary ring-1 ring-primary/40" : "border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <LazyImage
                src={url}
                alt={`${alt} ${index + 1}`}
                placeholder={PLACEHOLDER_IMAGE}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                  Гл
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
