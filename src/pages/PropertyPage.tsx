import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/LazyImage";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useProperty } from "@/hooks/useProperty";
import type { CatalogPhoto } from "@/lib/api";
import {
  PLACEHOLDER_IMAGE,
  formatArea,
  formatFloor,
  formatPrice,
  formatPricePerMeter,
  formatRooms,
  getCategoryMeta,
  makeTitle,
  propertyArea,
} from "@/lib/property";
import {
  ArrowLeft,
  BedDouble,
  Building,
  ExternalLink,
  Home,
  Mail,
  MapPin,
  Maximize,
  Phone,
} from "lucide-react";

function photoList(photos: CatalogPhoto[] | undefined, coverUrl: string | null): string[] {
  const fromPhotos = [...(photos || [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((photo) => photo.url)
    .filter(Boolean);
  if (fromPhotos.length > 0) return fromPhotos;
  return coverUrl ? [coverUrl] : [];
}

function mapUrl(property: {
  city: string | null;
  address: string | null;
  lat?: number | null;
  lng?: number | null;
  coordinates?: { lat?: number; lng?: number; latitude?: number; longitude?: number } | null;
}) {
  const lat = property.lat ?? property.coordinates?.lat ?? property.coordinates?.latitude;
  const lng = property.lng ?? property.coordinates?.lng ?? property.coordinates?.longitude;
  if (lat && lng) {
    return `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map`;
  }
  const query = [property.city, property.address].filter(Boolean).join(", ");
  if (!query) return null;
  return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
}

export default function PropertyPage() {
  const { id } = useParams();
  const { property, loading, error } = useProperty(id);
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = useMemo(
    () => (property ? photoList(property.photos, property.coverUrl) : []),
    [property],
  );
  const currentPhoto = photos[Math.min(activePhoto, Math.max(photos.length - 1, 0))] || PLACEHOLDER_IMAGE;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-20 flex flex-col items-center justify-center text-white/30">
        <Home className="w-12 h-12 mb-4 text-primary/20" />
        <p className="text-sm mb-6">Объект не найден</p>
        <Link to="/catalog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            К каталогу
          </Button>
        </Link>
      </div>
    );
  }

  const meta = getCategoryMeta(property.category);
  const area = propertyArea(property);
  const title = makeTitle(area, property.rooms, property.category);
  const location = [property.city, property.address].filter(Boolean).join(", ") || "Адрес уточняется";
  const video = property.videoUrl || property.video;
  const tour = property.tour3dUrl || property.tour3d;
  const maps = mapUrl(property);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex items-center justify-between gap-4 mb-8" direction="up">
            <Link to="/catalog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                К каталогу
              </Button>
            </Link>
            <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/10">
              {meta.tag}
            </Badge>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-zinc-800 aspect-[16/10]">
                <LazyImage
                  src={currentPhoto}
                  alt={title}
                  placeholder={PLACEHOLDER_IMAGE}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {photos.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {photos.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setActivePhoto(index)}
                      className={`relative overflow-hidden rounded-xl aspect-square border ${
                        index === activePhoto ? "border-primary" : "border-white/5"
                      }`}
                    >
                      <LazyImage
                        src={url}
                        alt={`${title} ${index + 1}`}
                        placeholder={PLACEHOLDER_IMAGE}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-white/30 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <p className="text-sm">{location}</p>
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3">
                  {title}
                </h1>
                <p className="text-3xl md:text-4xl font-black text-primary">
                  {formatPrice(property.price)}
                </p>
                {property.areaTotal || property.landArea ? (
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-1">
                    {formatPricePerMeter(property.price, area)}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <Maximize className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-bold text-white">{formatArea(area, property.category)}</span>
                  <span className="text-[9px] text-white/20">Площадь</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <BedDouble className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-bold text-white">{formatRooms(property.rooms, property.category)}</span>
                  <span className="text-[9px] text-white/20">{meta.roomsLabel}</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <Building className="w-4 h-4 text-primary/60" />
                  <span className="text-sm font-bold text-white">{formatFloor(property.floor, property.floorsTotal, property.category)}</span>
                  <span className="text-[9px] text-white/20">Этаж</span>
                </div>
              </div>

              {(property.renovation || property.houseType || property.cadastral) && (
                <div className="space-y-2 text-sm text-white/60">
                  {property.renovation && <p>Ремонт: {property.renovation}</p>}
                  {property.houseType && <p>Тип дома: {property.houseType}</p>}
                  {property.cadastral && <p>Кадастр: {property.cadastral}</p>}
                </div>
              )}

              {property.agent && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Агент</p>
                  <div className="flex items-center gap-3">
                    {property.agent.avatarUrl ? (
                      <img
                        src={property.agent.avatarUrl}
                        alt={property.agent.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                        {property.agent.name.slice(0, 1)}
                      </div>
                    )}
                    <p className="font-bold text-white">{property.agent.name}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {property.agent.phone && (
                      <a href={`tel:${property.agent.phone}`} className="inline-flex items-center gap-2 text-sm text-white hover:text-primary">
                        <Phone className="w-4 h-4" />
                        {property.agent.phone}
                      </a>
                    )}
                    {property.agent.email && (
                      <a href={`mailto:${property.agent.email}`} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-primary">
                        <Mail className="w-4 h-4" />
                        {property.agent.email}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {maps && (
                  <a href={maps} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">
                      На карте <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </a>
                )}
                {video && (
                  <a href={video} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">Видео</Button>
                  </a>
                )}
                {tour && (
                  <a href={tour} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">3D-тур</Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {property.description && (
            <ScrollReveal className="mt-10 max-w-3xl" direction="up">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3">Описание</p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
