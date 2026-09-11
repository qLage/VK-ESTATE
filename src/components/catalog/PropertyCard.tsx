import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/ui/LazyImage";
import type { CatalogProperty } from "@/lib/api";
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
import { BedDouble, Building, Heart, MapPin, Maximize } from "lucide-react";

interface PropertyCardProps {
  property: CatalogProperty;
  index?: number;
  favorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function PropertyCard({
  property,
  index = 0,
  favorite,
  onToggleFavorite,
}: PropertyCardProps) {
  const meta = getCategoryMeta(property.category);
  const area = propertyArea(property);
  const title = makeTitle(area, property.rooms, property.category);
  const location = property.address || property.city || "Адрес уточняется";

  return (
    <Link to={`/catalog/${property.id}`} className="block h-full">
      <Card className="group flex flex-col overflow-hidden bg-zinc-900/40 border-white/5 hover:border-primary/20 rounded-2xl md:rounded-[1.5rem] h-[420px] sm:h-[440px] md:h-[460px] hover-lift transition-all duration-500">
        <div className="relative h-[200px] sm:h-[220px] flex-shrink-0 overflow-hidden bg-zinc-800">
          <LazyImage
            src={property.coverUrl}
            alt={title}
            placeholder={PLACEHOLDER_IMAGE}
            className="w-full h-full object-cover group-hover:opacity-90"
            loading={index < 3 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/10">
              {meta.tag}
            </Badge>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleFavorite?.(property.id);
            }}
            className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              favorite ? "text-red-500 border-red-500/30" : "text-white/50 hover:text-primary hover:border-primary/30"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? "fill-current" : ""}`} />
          </button>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-xl md:text-2xl font-black text-white tracking-tight">
              {formatPrice(property.price)}
            </p>
            {area && property.category !== "land" ? (
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {formatPricePerMeter(property.price, area)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4 md:p-5">
          <div className="flex items-center gap-1.5 text-white/30 mb-2">
            <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
            <p className="text-[10px] md:text-xs font-medium truncate">{location}</p>
          </div>
          <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-primary transition-colors truncate mb-3">
            {title}
          </h3>
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <Maximize className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-[10px] md:text-xs font-bold text-white">
                {formatArea(area, property.category)}
              </span>
              <span className="text-[9px] text-white/20">Площадь</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <BedDouble className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-[10px] md:text-xs font-bold text-white">
                {formatRooms(property.rooms, property.category)}
              </span>
              <span className="text-[9px] text-white/20">{meta.roomsLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <Building className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-[10px] md:text-xs font-bold text-white">
                {formatFloor(property.floor, property.floorsTotal, property.category)}
              </span>
              <span className="text-[9px] text-white/20">Этаж</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
