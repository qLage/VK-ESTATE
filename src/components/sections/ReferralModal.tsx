import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { Users, Home, KeyRound, Landmark, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const REWARDS = [
  {
    icon: Users,
    label: "Порекомендуй друга на работу, и получи от Вашей Крыши",
    value: "15.000₽",
  },
  {
    icon: Home,
    label: "Клиент на покупку, то вы можете с нами получить",
    value: "до 50.000₽",
  },
  {
    icon: KeyRound,
    label: "Клиент на продажу, то вы можете с нами получить",
    value: "до 30.000₽",
  },
  {
    icon: Landmark,
    label: "Клиент на одобрение ипотеки",
    value: "5.000₽",
  },
];

const MESSENGERS = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "phone", label: "Телефон" },
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

export function ReferralModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    friendName: "",
    friendPhone: "",
    referrerName: "",
    referrerPhone: "",
    messenger: "whatsapp",
  });

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePhoneChange = useCallback(
    (field: "friendPhone" | "referrerPhone", value: string) => {
      setForm((prev) => ({ ...prev, [field]: formatPhone(value) }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.friendName.trim() ||
      !form.friendPhone.trim() ||
      !form.referrerName.trim() ||
      !form.referrerPhone.trim()
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
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
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
            Вы можете с нами
            <br />
            <span className="text-primary">зарабатывать!</span>
          </h2>
        </div>

        {!showForm ? (
          <>
            {/* Rewards list */}
            <div className="space-y-2.5">
              {REWARDS.map((item, index) => {
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
                      <p className="text-xs text-white/60 leading-snug">
                        {item.label}
                      </p>
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
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-black"
            >
              Оставить заявку
            </Button>

            <p className="text-center text-[10px] text-white/20">
              Окно больше не покажется — закройте, если не интересно
            </p>
          </>
        ) : !submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <div className="space-y-1.5">
                <Label className="text-white/90 text-sm">Имя друга</Label>
                <Input
                  placeholder=""
                  value={form.friendName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, friendName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-white/90 text-sm">
                  Номер телефона друга
                </Label>
                <Input
                  placeholder="+7(000)000-00-00"
                  value={form.friendPhone}
                  onChange={(e) => handlePhoneChange("friendPhone", e.target.value)}
                  required
                />
              </div>

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
                <Label className="text-white/90 text-sm">
                  Ваш номер телефона
                </Label>
                <Input
                  placeholder="+7(000)000-00-00"
                  value={form.referrerPhone}
                  onChange={(e) =>
                    handlePhoneChange("referrerPhone", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 text-sm">
                  Мессенджер для связи?
                </Label>
                <div className="flex gap-4">
                  {MESSENGERS.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-black disabled:opacity-50"
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
            <h3 className="text-xl font-black text-white uppercase">
              Заявка отправлена!
            </h3>
            <p className="text-sm text-white/60">
              Мы свяжемся с вами в ближайшее время
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-12 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-black"
            >
              Понятно
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
