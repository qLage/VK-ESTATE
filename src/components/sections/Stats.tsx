import { Building2, Users, Award, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const stats = [
  {
    icon: Building2,
    value: 500,
    suffix: "+",
    label: "Успешных сделок",
    description: "Продажа и аренда объектов",
  },
  {
    icon: Users,
    value: 120,
    suffix: "+",
    label: "Довольных клиентов",
    description: "Ежегодно обращаются повторно",
  },
  {
    icon: Award,
    value: 3,
    suffix: " года",
    label: "На рынке",
    description: "С 2023 года в недвижимости",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Поддержка",
    description: "На связи в любое время",
  },
];

export function Stats() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full animate-glow-pulse" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 md:mb-16 lg:mb-20" direction="up">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  О нас в цифрах
                </p>
                <div className="h-px w-6 md:w-8 bg-primary/40" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Почему <span className="text-primary">выбирают</span>{" "}
                <span className="text-white/10">нас</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                delay={index * 0.1}
                direction="scale"
                className="group relative p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-[1.5rem] lg:rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 hover-lift"
              >
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />

                <div className="relative z-10 space-y-3 md:space-y-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>

                  <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        duration={2000 + index * 300}
                      />
                    </p>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/60 mt-1">
                      {stat.label}
                    </p>
                  </div>

                  <p className="text-[10px] md:text-xs text-white/20 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
