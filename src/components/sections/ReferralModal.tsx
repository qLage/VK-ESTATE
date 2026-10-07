import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Modal } from "@/components/ui/modal";
import { Users, Home, KeyRound, Landmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/leads";

/** Softened program themes — no unsubstantiated reward amounts (B7). */
const PROGRAM_THEMES = [
  {
    icon: Users,
    label: "Рекомендация кандидата на работу",
    value: "Обсудим условия",
  },
  {
    icon: Home,
    label: "Клиент на покупку",
    value: "Обсудим условия",
  },
  {
    icon: KeyRound,
    label: "Клиент на продажу",
    value: "Обсудим условия",
  },
  {
    icon: Landmark,
    label: "Клиент на ипотечное сопровождение",
    value: "Обсудим условия",
  },
];

const MESSENGERS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "phone", label: "Телефон" },
];

const INTEREST_OPTIONS = [
  { id: "job", label: "Работа" },
  { id: "buy", label: "Покупка" },
  { id: "sell", label: "Продажа" },
  { id: "mortgage", label: "Ипотека" },
  { id: "other", label: "Другое" },
];

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^7?/, "7");
  if (digits.length === 0) return "";
  let result = "+7";
  if (digits.length > 1) result += "(" + digits.slice(1, 4);
  if (digits.length >= 4) {
    const rest = digits.slice(4);
    if (rest.length > 0) result += ")" + rest.slice(0, 3);
    if (rest.length > 3) result += "-" + rest.slice(3, 5);
    if (rest.length > 5) result += "-" + rest.slice(5, 7);
  }
  return result;
}

const REFERRAL_DISMISSED_KEY = "vkrysha_referral_dismissed";

function isPropertyPage(pathname: string): boolean {
  return /^\/catalog\/[^/]+/.test(pathname);
}

/**
 * B1 Variant A redesign: collect only the referrer's own contact data.
 * Third-party friendName/friendPhone are not collected or stored.
 */
export function ReferralModal() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    referrerName: "",
    referrerPhone: "",
    messenger: "whatsapp",
    interest: "other",
  });

  useEffect(() => {
    if (isPropertyPage(location.pathname) || sessionStorage.getItem(REFERRAL_DISMISSED_KEY)) {
      setOpen(false);
      return;
    }
    const timer = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClose = () => {
    sessionStorage.setItem(REFERRAL_DISMISSED_KEY, "1");
    setOpen(false);
  };

  const handlePhoneChange = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, referrerPhone: formatPhone(value) }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !agreed ||
      honeypot.trim() ||
      !form.referrerName.trim() ||
      !form.referrerPhone.trim()
    ) {
      return;
    }
    setLoading(true);
    try {
      const ok = await submitLead({
        type: "referral",
        referrerName: form.referrerName,
        referrerPhone: form.referrerPhone,
        messenger: form.messenger,
        interest: form.interest,
        consentAccepted: true,
      });
      if (ok) {
        setSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="text-center space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Рекомендации
            <br />
            <span className="text-primary">и сотрудничество</span>
          </h2>
          <p className="text-xs text-white/45 leading-relaxed">
            Оставьте свои контакты — обсудим условия программы лично. Контакты третьих лиц
            через эту форму не принимаются.
          </p>
        </div>

        {!showForm ? (
          <>
            <div className="space-y-2.5">
              {PROGRAM_THEMES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="shrink-0 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs text-white/60 leading-snug">{item.label}</p>
                    </div>
                    <div className="shrink-0 px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-black text-xs tracking-tight">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white"
            >
              Оставить свои контакты
            </Button>

            <p className="text-center text-[10px] text-white/20">
              Окно больше не покажется — закройте, если не интересно
            </p>
          </>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <input
              type="text"
              name="company_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="space-y-1.5">
              <Label className="text-white/90 text-sm">Ваше ФИО</Label>
              <Input
                placeholder=""
                value={form.referrerName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, referrerName: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/90 text-sm">Ваш номер телефона</Label>
              <Input
                placeholder="+7(000)000-00-00"
                value={form.referrerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90 text-sm">Тема обращения</Label>
              <div className="flex flex-wrap gap-3">
                {INTEREST_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interest"
                      value={opt.id}
                      checked={form.interest === opt.id}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, interest: e.target.value }))
                      }
                      className="peer sr-only"
                    />
                    <span className="h-4 w-4 rounded-full border border-white/30 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs text-white/70 peer-checked:text-white transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90 text-sm">Мессенджер для связи?</Label>
              <div className="flex gap-4">
                {MESSENGERS.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="messenger"
                      value={m.id}
                      checked={form.messenger === m.id}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          messenger: e.target.value,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <span className="h-4 w-4 rounded-full border border-white/30 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs text-white/70 peer-checked:text-white transition-colors">
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-[10px] text-white/35 leading-relaxed text-left">
                Даю согласие на обработку моих персональных данных в соответствии с{" "}
                <Link
                  to="/consent"
                  target="_blank"
                  className="text-primary/60 hover:text-primary underline underline-offset-2"
                >
                  Согласием
                </Link>{" "}
                и{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-primary/60 hover:text-primary underline underline-offset-2"
                >
                  Политикой
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading || !agreed}
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
            >
              {loading ? "Отправка..." : "Отправить заявку"}
            </Button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              ← Назад
            </button>
          </form>
        ) : (
          <div className="py-8 space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-xl font-black text-white uppercase">Заявка отправлена!</h3>
            <p className="text-sm text-white/60">Мы свяжемся с вами в ближайшее время</p>
            <Button
              onClick={handleClose}
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white"
            >
              Понятно
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
