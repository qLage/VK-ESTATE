import { useEmployees } from "@/hooks/useEmployees";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Phone, Mail, User } from "lucide-react";

const PLACEHOLDER_AVATAR = "/placeholder-avatar.svg";

// Иерархия позиций: порядок отображения групп
const POSITION_HIERARCHY = [
  "Директор",
  "Коммерческий директор",
  "Руководитель отдела продаж",
  "Менеджер отдела продаж",
  "Риелтор",
  "Администратор",
];

function getPositionPriority(name: string | null): number {
  if (!name) return 999;
  const idx = POSITION_HIERARCHY.indexOf(name);
  return idx === -1 ? 999 : idx;
}

interface TeamProps {
  limit?: number;
}

export function Team({ limit }: TeamProps = {}) {
  const { employees, loading, error } = useEmployees(limit || 50);

  // Группировка по position_name
  const groups = employees.reduce<Record<string, typeof employees>>((acc, emp) => {
    const pos = emp.position_name || "Другое";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(emp);
    return acc;
  }, {});

  // Сортировка групп по иерархии
  const sortedGroupNames = Object.keys(groups).sort(
    (a, b) => getPositionPriority(a) - getPositionPriority(b)
  );

  return (
    <section id="team" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12 md:mb-16 lg:mb-20" direction="up">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Наша команда
                </p>
                <div className="h-px w-6 md:w-8 bg-primary/40" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Профессионалы <br />
                <span className="text-primary">в недвижимости</span>
              </h2>
              <p className="text-sm md:text-base text-white/30 max-w-2xl mx-auto leading-relaxed">
                Каждый сотрудник — сертифицированный специалист с проверенным опытом сделок
              </p>
            </div>
          </ScrollReveal>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <User className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Не удалось загрузить данные сотрудников</p>
              <p className="text-xs text-white/20 mt-1">Проверьте соединение с CRM</p>
            </div>
          )}

          {!loading && !error && employees.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <User className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Информация о сотрудниках скоро появится</p>
            </div>
          )}

          {/* Employees by groups */}
          <div className="space-y-12 md:space-y-16">
            {sortedGroupNames.map((groupName) => (
              <div key={groupName}>
                <ScrollReveal direction="up">
                  <h3 className="text-center text-xs md:text-sm font-black uppercase tracking-[0.2em] text-primary/50 mb-6 md:mb-8">
                    {groupName}
                  </h3>
                </ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {groups[groupName].map((employee, index) => (
                    <ScrollReveal key={employee.id} delay={index * 0.08} direction="up">
                      <div className="group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 h-full hover-lift">
                        <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-primary/5 blur-[30px] rounded-full group-hover:bg-primary/10 transition-all duration-700" />

                        {/* Avatar */}
                        <div className="relative mb-4 md:mb-5">
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary/30 transition-all duration-500 bg-zinc-800">
                            <img
                              src={employee.avatar_url || PLACEHOLDER_AVATAR}
                              alt={employee.full_name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_AVATAR; }}
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="relative z-10 space-y-1.5 md:space-y-2">
                          <h3 className="text-sm md:text-base font-bold text-white group-hover:text-primary transition-colors">
                            {employee.full_name}
                          </h3>
                          {employee.position_name && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                              {employee.position_name}
                            </p>
                          )}
                        </div>

                        {/* Contacts */}
                        <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/5 w-full space-y-2">
                          {employee.phone && (
                            <a
                              href={`tel:${employee.phone}`}
                              className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-white/40 hover:text-primary transition-colors"
                            >
                              <Phone className="w-3 h-3 text-primary/60" />
                              {employee.phone}
                            </a>
                          )}
                          {employee.email && !employee.email.endsWith('@crm.local') && (
                            <a
                              href={`mailto:${employee.email}`}
                              className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-white/40 hover:text-primary transition-colors"
                            >
                              <Mail className="w-3 h-3 text-primary/60" />
                              {employee.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
