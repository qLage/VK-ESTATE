import { useNavigate } from "react-router-dom";
import { Home, KeyRound, FileCheck, Calculator, ShieldCheck, ClipboardList } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface ServicesProps {
  onOpenForm: () => void;
}

const services = [
  {
    icon: Home,
    title: "Продажа недвижимости",
    description: "Помогаем выгодно и быстро продать квартиру, дом или коммерческую недвижимость по рыночной цене.",
    action: "form",
  },
  {
    icon: KeyRound,
    title: "Покупка и подбор",
    description: "Подберём объект под ваши критерии: бюджет, район, планировка. Проверим юридическую чистоту.",
    action: "catalog",
  },
  {
    icon: FileCheck,
    title: "Юридическое сопровождение",
    description: "Проверка документов, сопровождение сделки, защита интересов клиента на всех этапах.",
    action: "form",
  },
  {
    icon: Calculator,
    title: "Ипотечное брокерство",
    description: "Одобрение ипотеки в 15+ банках, подбор лучших условий, помощь с документами.",
    action: "form",
  },
  {
    icon: ShieldCheck,
    title: "Страхование сделок",
    description: "Страхование жизни, недвижимости и титула. Защита от рисков на сумму до 50 млн ₽.",
    action: "form",
  },
  {
    icon: ClipboardList,
    title: "Оценка и консалтинг",
    description: "Профессиональная оценка рыночной стоимости объектов и инвестиционный консалтинг.",
    action: "form",
  },
];

export function Services({ onOpenForm }: ServicesProps) {
  const navigate = useNavigate();

  const handleClick = (action: string) => {
    if (action === "catalog") {
      navigate("/catalog");
    } else {
      onOpenForm();
    }
  };

  return (
    <section id="services" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full translate-x-1/3 animate-glow-pulse" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 md:mb-16 lg:mb-20" direction="up">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Наши услуги
                </p>
                <div className="h-px w-6 md:w-8 bg-primary/40" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Полный <span className="text-primary">спектр</span>{" "}
                <span className="text-white/10">услуг</span>
              </h2>
              <p className="text-sm md:text-base text-white/30 max-w-2xl mx-auto">
                От подбора объекта до оформления документов — берём на себя все хлопоты
              </p>
            </div>
          </ScrollReveal>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.08} direction="up">
                <button
                  onClick={() => handleClick(service.action)}
                  className="group relative w-full p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[1.5rem] lg:rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 hover-lift text-left"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />

                  <div className="relative z-10 space-y-4 md:space-y-5">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                      <service.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base md:text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[10px] md:text-xs text-white/25 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
