import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface CTAProps {
  onOpenForm: () => void;
}

export function CTA({ onOpenForm }: CTAProps) {
  return (
    <section id="contacts" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/[0.04] blur-[150px] rounded-full animate-glow-pulse" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] lg:rounded-[3.5rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/5 shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-primary/[0.03] blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <ScrollReveal direction="left">
                <div className="space-y-5 md:space-y-6 lg:space-y-8">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-px w-6 md:w-8 lg:w-12 bg-primary/40" />
                    <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                      Бесплатная консультация
                    </p>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                    Начните путь к <br />
                    <span className="text-primary">новой</span>{" "}
                    <span className="text-white/10">жизни</span>
                  </h2>

                  <p className="text-sm md:text-base text-white/30 max-w-md leading-relaxed">
                    Оставьте заявку и наш риелтор свяжется с вами в течение 15 минут.
                    Бесплатный подбор, оценка и консультация.
                  </p>

                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <Button variant="gradient" size="lg" onClick={onOpenForm}>
                      Оставить заявку <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <a href="tel:+7XXXXXXXXXX">
                      <Button variant="outline" size="lg">
                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                        Позвонить
                      </Button>
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Info Cards */}
              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    icon: Phone,
                    label: "Телефон",
                    value: "+7 (XXX) XXX-XX-XX",
                    description: "Пн–Пт 9:00–20:00",
                    href: "tel:+7XXXXXXXXXX",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "boyarova.angelina.rieltor@mail.ru",
                    description: "Ответим в течение часа",
                    href: "mailto:boyarova.angelina.rieltor@mail.ru",
                  },
                  {
                    icon: MapPin,
                    label: "Офис",
                    value: "Воронеж, ул. Донбасская, 25К2",
                    description: "Ежедневно 9:00 — 20:00",
                    href: "#",
                  },
                ].map((item, index) => (
                  <ScrollReveal key={item.label} delay={index * 0.1} direction="right">
                    <a
                      href={item.href}
                      className="group flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-500 hover-lift"
                    >
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm md:text-base font-bold text-white">{item.value}</p>
                        <p className="text-[10px] text-white/20">{item.description}</p>
                      </div>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
