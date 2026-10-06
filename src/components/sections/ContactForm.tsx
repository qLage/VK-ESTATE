import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Phone, User, MessageSquare, Send, CheckCircle } from "lucide-react";
import { submitLead } from "@/lib/leads";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
}

export function ContactForm({ open, onClose }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || loading) return;
    if (honeypot.trim()) return;
    setLoading(true);
    setError("");
    try {
      const ok = await submitLead({
        type: "contact",
        name: form.name,
        phone: form.phone,
        message: form.message,
      });
      if (!ok) {
        setError("Не удалось отправить заявку. Попробуйте ещё раз.");
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setAgreed(false);
        setForm({ name: "", phone: "", message: "" });
        onClose();
      }, 2500);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Оставить заявку">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-primary" />
          <p className="text-sm md:text-base text-white/60 text-center">
            Спасибо! Мы свяжемся с вами по указанному телефону.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
              Ваше имя
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Иван Иванов"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/30 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
              Телефон
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 (999) 999-99-99"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/30 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
              Сообщение
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-primary/40" />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Что вы ищете?"
                rows={3}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/30 transition-colors resize-none"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-[10px] text-white/30 leading-relaxed">
              Даю согласие на обработку персональных данных (имя, телефон, текст сообщения) для
              обратной связи по заявке в соответствии с{" "}
              <Link to="/consent" target="_blank" className="text-primary/60 hover:text-primary underline underline-offset-2">
                Согласием
              </Link>{" "}
              и{" "}
              <Link to="/privacy" target="_blank" className="text-primary/60 hover:text-primary underline underline-offset-2">
                Политикой конфиденциальности
              </Link>
              . Рекламные рассылки не запрашиваются.
            </span>
          </label>

          {error ? <p className="text-xs text-red-400 text-center">{error}</p> : null}

          <Button
            type="submit"
            variant="gradient"
            className="w-full h-12"
            disabled={!agreed || loading}
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
