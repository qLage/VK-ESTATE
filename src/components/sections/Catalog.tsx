import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { ArrowRight, Home } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CatalogProps {
  limit?: number;
}

export function Catalog({ limit }: CatalogProps = {}) {
  const { properties, loading } = useProperties(limit || 20);
  const visible = properties.slice(0, limit || 9);

  return (
    <section id="catalog" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/[0.03] blur-[120px] rounded-full -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] blur-[120px] rounded-full translate-x-1/4" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-14 lg:mb-16" direction="up">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Каталог
                </p>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Эксклюзивные <br />
                <span className="text-primary">объекты</span>{" "}
                <span className="text-white/10">недвижимости</span>
              </h2>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="w-fit" size="sm">
                Все объекты <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </ScrollReveal>

          {loading && visible.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Home className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Объекты не найдены</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {visible.map((property, index) => (
              <ScrollReveal key={property.id} delay={index * 0.08} direction="up">
                <PropertyCard property={property} index={index} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
