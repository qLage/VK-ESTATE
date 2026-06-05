import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import {
  MapPin, Maximize, BedDouble, Building, Heart,
  ArrowLeft, Home, SlidersHorizontal, X
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const CATEGORY_META: Record<string, { tag: string; unit: string; roomsLabel: string }> = {
  newbuilding: { tag: "Новостройка", unit: "м²", roomsLabel: "Комнаты" },
  secondary: { tag: "Вторичка", unit: "м²", roomsLabel: "Комнаты" },
  apartment_sell: { tag: "Квартира", unit: "м²", roomsLabel: "Комнаты" },
  apartment_rent: { tag: "Квартира", unit: "м²", roomsLabel: "Комнаты" },
  house: { tag: "Дом", unit: "м²", roomsLabel: "Комнаты" },
  land: { tag: "Участок", unit: "соток", roomsLabel: "Площадь" },
  commercial: { tag: "Коммерция", unit: "м²", roomsLabel: "Помещения" },
  commercial_rent: { tag: "Коммерция", unit: "м²", roomsLabel: "Помещения" },
  rent: { tag: "Аренда", unit: "м²", roomsLabel: "Комнаты" },
};

const PLACEHOLDER_IMAGE = "/placeholder-property.svg";

const CATEGORIES = [
  { key: "all", label: "Все" },
  { key: "apartment_sell", label: "Квартиры" },
  { key: "newbuilding", label: "Новостройки" },
  { key: "house", label: "Дома" },
  { key: "commercial", label: "Коммерция" },
  { key: "apartment_rent", label: "Аренда" },
  { key: "land", label: "Участки" },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function formatPricePerMeter(price: number, area: number | null): string {
  if (!area) return "";
  return new Intl.NumberFormat("ru-RU").format(Math.round(price / area)) + " ₽/м²";
}

function formatArea(area: number | null, category: string): string {
  if (!area) return "—";
  const meta = CATEGORY_META[category] || CATEGORY_META.secondary;
  return `${area} ${meta.unit}`;
}

function formatRooms(rooms: string | null, category: string): string {
  if (!rooms || category === "land") return "—";
  if (rooms === "1") return "1 комн.";
  if (rooms === "2") return "2 комн.";
  if (rooms === "3") return "3 комн.";
  if (rooms === "4") return "4 комн.";
  if (rooms === "5") return "5 комн.";
  if (rooms === "6") return "6+ комн.";
  return rooms;
}

function formatFloor(floor: number | null, floorsTotal: number | null, category: string): string {
  if (category === "land") return "—";
  if (!floor || !floorsTotal) return "—";
  return `${floor}/${floorsTotal}`;
}

function makeTitle(area: number | null, rooms: string | null, category: string): string {
  const meta = CATEGORY_META[category] || CATEGORY_META.secondary;
  if (category === "land") {
    return meta.tag + ", " + formatArea(area, category);
  }
  const roomsStr = formatRooms(rooms, category);
  const areaStr = formatArea(area, category);
  if (roomsStr === "—") return meta.tag + ", " + areaStr;
  return roomsStr + ", " + areaStr;
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties: apiProperties, loading } = useProperties(100);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const activeCategory = searchParams.get("category") || "all";

  const properties = apiProperties.map((p) => ({
    id: p.id,
    title: makeTitle(p.area_total, p.rooms, p.category),
    location: p.address || p.city || "Адрес уточняется",
    price: p.price,
    area_total: p.area_total,
    rooms: p.rooms,
    floor: p.floor,
    floors_total: p.floors_total,
    category: p.category,
    cover_url: p.cover_url || PLACEHOLDER_IMAGE,
  }));

  const filtered = activeCategory === "all"
    ? properties
    : properties.filter((p) => p.category === activeCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <ScrollReveal className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12" direction="up">
            <div className="space-y-3">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Каталог
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Все <span className="text-primary">объекты</span>{" "}
                <span className="text-white/10">недвижимости</span>
              </h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                На главную
              </Button>
            </Link>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={0.1} direction="up">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
              <div className="flex items-center gap-2 mr-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Фильтр</span>
              </div>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    if (cat.key === "all") {
                      setSearchParams({});
                    } else {
                      setSearchParams({ category: cat.key });
                    }
                  }}
                  className={`px-3 md:px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-white/[0.03] border border-white/5 text-white/30 hover:text-primary hover:border-primary/20 hover:bg-primary/5"
                  }`}
                >
                  {cat.label}
                  {activeCategory === cat.key && cat.key !== "all" && (
                    <X className="w-3 h-3 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {loading && filtered.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Home className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Объекты не найдены</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {filtered.map((property, index) => {
              const meta = CATEGORY_META[property.category] || CATEGORY_META.secondary;
              return (
                <ScrollReveal key={property.id} delay={index * 0.06} direction="up">
                  <Card className="group flex flex-col overflow-hidden bg-zinc-900/40 border-white/5 hover:border-primary/20 rounded-2xl md:rounded-[1.5rem] h-[420px] sm:h-[440px] md:h-[460px] hover-lift transition-all duration-500">
                    <div className="relative h-[200px] sm:h-[220px] flex-shrink-0 overflow-hidden bg-zinc-800">
                      <img
                        src={property.cover_url}
                        alt={property.title}
                        className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/10">
                          {meta.tag}
                        </Badge>
                      </div>
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                          favorites.has(property.id) ? "text-red-500 border-red-500/30" : "text-white/50 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.has(property.id) ? "fill-current" : ""}`} />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xl md:text-2xl font-black text-white tracking-tight">
                          {formatPrice(property.price)}
                        </p>
                        {property.area_total && (
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                            {formatPricePerMeter(property.price, property.area_total)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4 md:p-5">
                      <div className="flex items-center gap-1.5 text-white/30 mb-2">
                        <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                        <p className="text-[10px] md:text-xs font-medium truncate">{property.location}</p>
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-primary transition-colors truncate mb-3">
                        {property.title}
                      </h3>
                      <div className="grid grid-cols-3 gap-2 mt-auto">
                        <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <Maximize className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-[10px] md:text-xs font-bold text-white">{formatArea(property.area_total, property.category)}</span>
                          <span className="text-[9px] text-white/20">Площадь</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <BedDouble className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-[10px] md:text-xs font-bold text-white">{formatRooms(property.rooms, property.category)}</span>
                          <span className="text-[9px] text-white/20">{meta.roomsLabel}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                          <Building className="w-3.5 h-3.5 text-primary/60" />
                          <span className="text-[10px] md:text-xs font-bold text-white">{formatFloor(property.floor, property.floors_total, property.category)}</span>
                          <span className="text-[9px] text-white/20">Этаж</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
