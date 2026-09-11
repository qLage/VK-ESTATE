import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { useCatalog } from "@/hooks/useProperties";
import { FILTER_CATEGORIES } from "@/lib/property";
import { ArrowLeft, Home, SlidersHorizontal, X } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const activeCategory = searchParams.get("category") || "all";
  const { properties, loading, loadingMore, hasMore, loadMore } = useCatalog({
    limit: 12,
    category: activeCategory,
  });

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

          <ScrollReveal delay={0.1} direction="up">
            <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
              <div className="flex items-center gap-2 mr-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Фильтр</span>
              </div>
              {FILTER_CATEGORIES.map((cat) => (
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

          {loading && properties.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          )}

          {!loading && properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Home className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Объекты не найдены</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {properties.map((property, index) => (
              <ScrollReveal key={property.id} delay={index * 0.06} direction="up">
                <PropertyCard
                  property={property}
                  index={index}
                  favorite={favorites.has(property.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </ScrollReveal>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Загрузка..." : "Показать ещё"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
