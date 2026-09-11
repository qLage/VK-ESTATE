interface PropertyMapProps {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  city?: string | null;
}

function widgetSrc({ lat, lng, address, city }: PropertyMapProps): string | null {
  if (lat && lng) {
    return `https://yandex.ru/map-widget/v1/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm`;
  }
  const query = [city, address].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(query)}&z=16`;
}

export function PropertyMap(props: PropertyMapProps) {
  const src = widgetSrc(props);
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-2xl md:rounded-[1.5rem] border border-white/5 bg-zinc-900/40">
      <iframe
        title="Карта объекта"
        src={src}
        className="w-full h-[280px] sm:h-[360px] lg:h-[420px] border-0"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
