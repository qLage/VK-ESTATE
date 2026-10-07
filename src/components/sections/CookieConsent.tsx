import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Cookie, Settings2 } from "lucide-react";
import { useSite } from "@/hooks/useSite";
import { isInternalLink } from "@/lib/site";
import {
  COOKIE_CONSENT_KEY,
  clearCookieConsent,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !readCookieConsent());
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const { profile } = useSite();
  const cookiesHref = profile.legalLinks.cookies;

  useEffect(() => {
    const sync = () => setVisible(!readCookieConsent());
    window.addEventListener("vkrysha-cookie-consent", sync);
    return () => window.removeEventListener("vkrysha-cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (!showSettings) return;
    const current = readCookieConsent();
    if (current?.consent === "all") {
      setAnalytics(true);
      setMarketing(true);
    } else if (current?.consent === "custom") {
      setAnalytics(Boolean(current.analytics));
      setMarketing(Boolean(current.marketing));
    } else {
      setAnalytics(false);
      setMarketing(false);
    }
  }, [showSettings]);

  const acceptNecessary = () => {
    writeCookieConsent({ consent: "necessary", date: new Date().toISOString() });
    setVisible(false);
    setShowSettings(false);
  };

  const saveSettings = () => {
    const date = new Date().toISOString();
    if (analytics && marketing) {
      writeCookieConsent({ consent: "all", date });
    } else if (!analytics && !marketing) {
      writeCookieConsent({ consent: "necessary", date });
    } else {
      writeCookieConsent({ consent: "custom", analytics, marketing, date });
    }
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-900/95 md:backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-5">
          {!showSettings ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Файлы cookie и локальное хранение</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Сайт сохраняет в вашем браузере технические данные (выбор этого баннера,
                    служебные флаги интерфейса). Счётчики аналитики и рекламные пиксели сейчас
                    не подключены. Сторонние сервисы (например, Яндекс.Карты на страницах объектов)
                    могут обрабатывать данные при их загрузке — подробнее в{" "}
                    {isInternalLink(cookiesHref) ? (
                      <Link to={cookiesHref} className="text-primary/60 hover:text-primary underline underline-offset-2">
                        Политике cookie
                      </Link>
                    ) : (
                      <a href={cookiesHref} className="text-primary/60 hover:text-primary underline underline-offset-2">
                        Политике cookie
                      </a>
                    )}
                    .
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                >
                  <Settings2 className="w-3.5 h-3.5 inline mr-1.5" />
                  Подробнее
                </button>
                <button
                  type="button"
                  onClick={acceptNecessary}
                  className="flex-1 sm:flex-none h-10 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Понятно
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">Что сохраняется</p>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
                  aria-label="Закрыть"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-[11px] text-white/40 leading-relaxed">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-default">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary opacity-70"
                  />
                  <span>
                    <span className="block text-xs font-bold text-white mb-1">
                      Необходимые / технические
                    </span>
                    Ключ <code className="text-white/50">{COOKIE_CONSENT_KEY}</code> в localStorage —
                    ваш выбор по этому уведомлению; sessionStorage для закрытия реферального окна.
                    Всегда включены.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 cursor-pointer"
                  />
                  <span>
                    <span className="block text-xs font-bold text-white mb-1">Аналитика</span>
                    Яндекс.Метрика / аналоги. Сейчас скрипты не установлены — выбор сохранится и
                    будет учтён при подключении.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 cursor-pointer"
                  />
                  <span>
                    <span className="block text-xs font-bold text-white mb-1">Маркетинг</span>
                    Рекламные пиксели. Сейчас не установлены — загрузка только после согласия.
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={saveSettings}
                  className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearCookieConsent();
                    setAnalytics(false);
                    setMarketing(false);
                    setVisible(true);
                  }}
                  className="flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/[0.03] border border-white/10"
                >
                  Сбросить выбор
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Re-open cookie notice from footer / settings. */
export function openCookieSettings(): void {
  clearCookieConsent();
}
