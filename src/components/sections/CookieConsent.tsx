import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Cookie, Settings2 } from "lucide-react";

const COOKIE_CONSENT_KEY = "vkrysha_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ consent: "all", date: new Date().toISOString() }));
    setVisible(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ consent: "necessary", date: new Date().toISOString() }));
    setVisible(false);
    setShowSettings(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        consent: "custom",
        analytics,
        marketing,
        date: new Date().toISOString(),
      })
    );
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-5">
          {!showSettings ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Мы используем cookie</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Сайт использует файлы cookie для улучшения работы и персонализации контента.
                    Вы можете настроить использование cookie или принять все.
                    Подробнее в{" "}
                    <Link to="/cookies" className="text-primary/60 hover:text-primary underline underline-offset-2">
                      Политике использования cookie
                    </Link>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                >
                  <Settings2 className="w-3.5 h-3.5 inline mr-1.5" />
                  Настроить
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Принять
                </button>
                <button
                  onClick={acceptNecessary}
                  className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all shrink-0"
                  aria-label="Отклонить"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">Настройки cookie</p>
                <button
                  onClick={() => setShowSettings(false)}
                  className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Necessary - always on */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Необходимые</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Обеспечивают корректную работу сайта</p>
                  </div>
                  <div className="h-5 w-9 rounded-full bg-primary relative shrink-0">
                    <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                {/* Analytics */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <div>
                    <p className="text-xs font-bold text-white">Аналитические</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Помогают улучшать сайт (Яндекс.Метрика)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 shrink-0"
                  />
                </label>

                {/* Marketing */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors">
                  <div>
                    <p className="text-xs font-bold text-white">Маркетинговые</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Используются для персонализации рекламы</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 shrink-0"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={saveSettings}
                  className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Сохранить настройки
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                >
                  Принять все
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
