import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const reviews = [
  {
    name: "Александр К.",
    role: "Покупатель квартиры",
    text: "Оформили ипотеку и купили 3-комнатную квартиру за 3 недели. Риелтор был на связи 24/7, всё объяснял простым языком. Рекомендую!",
    rating: 5,
  },
  {
    name: "Мария С.",
    role: "Продавец дома",
    text: "Продали загородный дом выше рыночной цены. Профессиональная фотосессия, грамотная реклама и быстрые показы. Спасибо команде!",
    rating: 5,
  },
  {
    name: "Дмитрий В.",
    role: "Инвестор",
    text: "Сотрудничаю с агентством уже 2 года. Помогают с покупкой коммерческой недвижимости под аренду. Доходность стабильно выше рынка.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.03] blur-[120px] rounded-full animate-glow-pulse" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 md:mb-16 lg:mb-20" direction="up">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Отзывы клиентов
                </p>
                <div className="h-px w-6 md:w-8 bg-primary/40" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Что <span className="text-primary">говорят</span>{" "}
                <span className="text-white/10">клиенты</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {reviews.map((review, index) => (
              <ScrollReveal key={review.name} delay={index * 0.12} direction="scale">
                <div className="group relative p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[1.5rem] lg:rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 h-full hover-lift">
                  <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-primary/5 blur-[30px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />

                  <div className="relative z-10 space-y-4 md:space-y-5">
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-primary/20" />

                    <p className="text-xs md:text-sm text-white/40 leading-relaxed">
                      "{review.text}"
                    </p>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/5">
                      <p className="text-sm font-bold text-white">{review.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-0.5">
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
