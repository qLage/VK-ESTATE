import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

const navLinks = [
  { label: "Каталог", to: "/catalog", section: "catalog" },
  { label: "Галерея", to: "/#gallery", section: "gallery" },
  { label: "Услуги", to: "/#services", section: "services" },
  { label: "Команда", to: "/#team", section: "team" },
  { label: "Отзывы", to: "/#reviews", section: "reviews" },
  { label: "Контакты", to: "/#contacts", section: "contacts" },
];

interface NavbarProps {
  onOpenForm: () => void;
}

export function Navbar({ onOpenForm }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const activeSection = useActiveSection();

  const scrollToSection = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isHome = location.pathname === "/";
  const isCatalog = location.pathname === "/catalog";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 mt-3 sm:mt-4">
        <div className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-zinc-900/60 backdrop-blur-2xl border border-white/5 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src="/logo-panel.svg" alt="Ваша Крыша" className="h-5 sm:h-6 md:h-7 w-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = link.section
                ? (isHome && activeSection === link.section) || (link.section === "catalog" && isCatalog)
                : false;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => {
                    if (link.to.startsWith("/#")) {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        window.location.href = link.to;
                      } else {
                        scrollToSection(link.to.replace("/#", ""));
                      }
                    }
                  }}
                  className={`relative text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-white/40 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary/60" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+7XXXXXXXXXX" className="flex items-center gap-2 text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+7 (XXX) XXX-XX-XX</span>
            </a>
            <Button size="sm" variant="gradient" onClick={onOpenForm}>
              Подобрать жильё
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 text-white/70"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/5 p-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => {
              const isActive = link.section
                ? (isHome && activeSection === link.section) || (link.section === "catalog" && isCatalog)
                : false;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => {
                    setOpen(false);
                    if (link.to.startsWith("/#")) {
                      e.preventDefault();
                      if (location.pathname !== "/") {
                        window.location.href = link.to;
                      } else {
                        scrollToSection(link.to.replace("/#", ""));
                      }
                    }
                  }}
                  className={`block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <a
                href="tel:+7XXXXXXXXXX"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                +7 (XXX) XXX-XX-XX
              </a>
              <Button className="w-full" variant="gradient" onClick={() => { setOpen(false); onOpenForm(); }}>
                Подобрать жильё
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
