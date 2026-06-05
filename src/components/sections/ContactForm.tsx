import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Phone, User, MessageSquare, Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
}

export function ContactForm({ open, onClose }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    // In production, send to API or Telegram bot
    console.log("Form submitted:", form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAgreed(false);
      setForm({ name: "", phone: "", message: "" });
      onClose();
    }, 2500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Оставить заявку">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fade-in">
          <CheckCircle className="w-12 h-12 text-primary" />
          <p className="text-sm md:text-base text-white/60 text-center">
            Спасибо! Мы свяжемся с вами в течение 15 минут.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Consent checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-[10px] text-white/30 leading-relaxed">
              Я согласен на обработку{" "}
              <Link to="/privacy" target="_blank" className="text-primary/60 hover:text-primary underline underline-offset-2">
                персональных данных
              </Link>{" "}
              в соответствии с Федеральным законом № 152-ФЗ
            </span>
          </label>

          <Button
            type="submit"
            variant="gradient"
            className="w-full h-12"
            disabled={!agreed}
          >
            <Send className="w-4 h-4 mr-2" />
            Отправить заявку
          </Button>

          <p className="text-[10px] text-white/15 text-center">
            Нажимая кнопку «Отправить заявку», вы подтверждаете своё согласие на обработку персональных данных
          </p>
        </form>
      )}
    </Modal>
  );
}
