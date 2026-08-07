import { useMemo, useState } from "react";

interface LazyImageProps {
  src?: string | null;
  alt: string;
  placeholder: string;
  className?: string;
  loading?: "eager" | "lazy";
}

function resolveDisplaySrc(src: string | null | undefined, placeholder: string): string {
  const cleanSrc = (src || "").trim();
  const isValid =
    cleanSrc.length > 0 &&
    (cleanSrc.startsWith("http") ||
      cleanSrc.startsWith("/") ||
      cleanSrc.startsWith("data:"));
  return isValid ? cleanSrc : placeholder;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  className = "",
  loading = "lazy",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const displaySrc = useMemo(
    () => resolveDisplaySrc(src, placeholder),
    [src, placeholder]
  );

  return (
    <img
      key={`${displaySrc}-${alt}`}
      src={displaySrc}
      alt={alt}
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      loading={loading}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
    />
  );
}
