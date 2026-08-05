import { useState, useEffect } from "react";

interface LazyImageProps {
  src?: string | null;
  alt: string;
  placeholder: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export function LazyImage({
  src,
  alt,
  placeholder,
  className = "",
  loading = "lazy",
}: LazyImageProps) {
  const [displaySrc, setDisplaySrc] = useState(placeholder);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cleanSrc = (src || "").trim();
    const isValid =
      cleanSrc.length > 0 &&
      (cleanSrc.startsWith("http") ||
        cleanSrc.startsWith("/") ||
        cleanSrc.startsWith("data:"));

    if (!isValid) {
      setDisplaySrc(placeholder);
      setLoaded(true);
      return;
    }

    setLoaded(false);
    const img = new Image();

    img.onload = () => {
      setDisplaySrc(cleanSrc);
      setLoaded(true);
    };

    img.onerror = () => {
      setDisplaySrc(placeholder);
      setLoaded(true);
    };

    img.src = cleanSrc;

    // Если изображение уже в кэше браузера
    if (img.complete) {
      if (img.naturalWidth > 0) {
        setDisplaySrc(cleanSrc);
      } else {
        setDisplaySrc(placeholder);
      }
      setLoaded(true);
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder]);

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      loading={loading}
    />
  );
}
