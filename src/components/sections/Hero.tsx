import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  ArrowRight,
  Home,
  Key,
  TrendingUp,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const TAGS = [
  { label: "Квартиры", category: "apartment_sell" },
  { label: "Новостройки", category: "newbuilding" },
  { label: "Коттеджи", category: "house" },
  { label: "Коммерция", category: "commercial" },
  { label: "Ипотека", category: "apartment_sell" },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden"
    >
      {/* Background Effects with mouse parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          data-parallax="40"
          className="absolute top-0 right-0 w-[500px] sm:w-[700px] md:w-[900px] h-[500px] sm:h-[700px] md:h-[900px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"
        />
        <div
          data-parallax="30"
          data-parallax-invert-x="true"
          data-parallax-invert-y="true"
          className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/[0.03] blur-[100px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 lg:space-y-10">
              <HeroLabel />

              <HeroHeading />

              <HeroDescription />

              <HeroSearch />

              <HeroTags />
            </div>

            {/* Right Visual */}
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroLabel() {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 md:gap-3 transition-all duration-700 ${
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionDelay: "0.1s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="h-px w-6 md:w-8 lg:w-12 bg-primary/40" />
      <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
        Агентство недвижимости
      </p>
    </div>
  );
}

function HeroHeading() {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <h1
      ref={ref}
      className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] uppercase transition-all duration-700 ${
        isRevealed
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-6 blur-sm"
      }`}
      style={{
        transitionDelay: "0.2s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      Найдём вашу <br />
      <span className="text-primary">идеальную</span>{" "}
      <span className="text-white/10">крышу</span>
    </h1>
  );
}

function HeroDescription() {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <p
      ref={ref}
      className={`text-sm md:text-base lg:text-lg text-white/30 max-w-lg leading-relaxed transition-all duration-700 ${
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionDelay: "0.3s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      Продажа и аренда недвижимости в Воронеже и области. Персональный подход,
      профессиональное сопровождение сделок и юридическая поддержка.
    </p>
  );
}

function HeroSearch() {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative p-1.5 sm:p-2 rounded-2xl md:rounded-[1.5rem] bg-zinc-900/60 backdrop-blur-xl border border-white/5 shadow-2xl max-w-xl transition-all duration-700 ${
        isRevealed
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.98]"
      }`}
      style={{
        transitionDelay: "0.4s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 h-12 sm:h-14 rounded-xl md:rounded-[1.25rem] bg-white/[0.03] border border-white/5">
          <Search className="w-4 h-4 text-primary/60 shrink-0" />
          <input
            type="text"
            placeholder="Район, метро или адрес..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/20 outline-none"
          />
        </div>
        <Link to="/catalog">
          <Button
            className="h-12 sm:h-14 rounded-xl md:rounded-[1.25rem] w-full sm:w-auto"
            variant="gradient"
          >
            <span className="hidden sm:inline">Найти</span>
            <ArrowRight className="w-4 h-4 sm:ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function HeroTags() {
  const { ref, isRevealed } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`flex flex-wrap gap-2 md:gap-3 transition-all duration-700 ${
        isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        transitionDelay: "0.5s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {TAGS.map((tag) => (
        <Link
          key={tag.label}
          to={`/catalog?category=${tag.category}`}
          className="px-3 md:px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/5 text-white/30 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5"
        >
          {tag.label}
        </Link>
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative hidden lg:block">
      <div className="relative aspect-square max-w-lg mx-auto">
        {/* Decorative Rings with parallax */}
        <div
          data-parallax="10"
          className="absolute inset-0 rounded-[3rem] border border-white/5"
        />
        <div
          data-parallax="16"
          className="absolute inset-4 rounded-[2.5rem] border border-white/[0.03]"
        />
        <div
          data-parallax="24"
          className="absolute inset-8 rounded-[2rem] border border-white/[0.02]"
        />

        {/* Center Card — wrapper with parallax, inner with float animation */}
        <div
          data-parallax="30"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-2xl flex flex-col items-center justify-center p-8 animate-float">
            <img
              src="/logo.svg"
              alt="Ваша Крыша"
              className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-80"
            />
            <div className="mt-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                Воронеж и область
              </span>
            </div>
          </div>
        </div>

        {/* Floating Badges — wrapper absolute + parallax + fade-in (opacity only), inner content */}
        <div
          data-parallax="40"
          className="absolute top-8 left-0 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <Home className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              500+ сделок
            </span>
          </div>
        </div>

        <div
          data-parallax="30"
          data-parallax-invert-x="true"
          data-parallax-invert-y="true"
          className="absolute bottom-12 right-0 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <Key className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Ключи за 3 дня
            </span>
          </div>
        </div>

        <div
          data-parallax="50"
          data-parallax-invert-x="true"
          className="absolute top-1/2 -right-4 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Лучшие цены
            </span>
          </div>
        </div>

        <div
          data-parallax="36"
          data-parallax-invert-y="true"
          className="absolute bottom-4 left-4 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Юр. защита
            </span>
          </div>
        </div>

        <div
          data-parallax="40"
          data-parallax-invert-x="true"
          className="absolute top-20 right-8 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
            <Percent className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Ипотека от 4%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
