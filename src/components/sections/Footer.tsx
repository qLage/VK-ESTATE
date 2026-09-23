import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSite } from "@/hooks/useSite";
import {
  displayName,
  isInternalLink,
  legalEntityLine,
  mailtoHref,
  primaryEmail,
  primaryPhone,
  officeAddress,
  legalAddress,
  socialEntries,
  telHref,
  type SiteSocialKey,
} from "@/lib/site";

const footerLinks = {
  catalog: [
    { label: "Квартиры", href: "/catalog?category=apartment_sell" },
    { label: "Новостройки", href: "/catalog?category=newbuilding" },
    { label: "Коттеджи и дома", href: "/catalog?category=house" },
    { label: "Коммерческая", href: "/catalog?category=commercial" },
    { label: "Аренда", href: "/catalog?category=apartment_rent" },
  ],
  services: [
    { label: "Продажа", href: "/#services" },
    { label: "Покупка", href: "/#services" },
    { label: "Ипотека", href: "/#services" },
    { label: "Юрист", href: "/#services" },
  ],
  company: [
    { label: "О нас", href: "/#" },
    { label: "Отзывы", href: "/#reviews" },
    { label: "Карьера", href: "/#" },
  ],
};

const legalLabels = [
  { key: "privacy" as const, label: "Политика конфиденциальности" },
  { key: "terms" as const, label: "Пользовательское соглашение" },
  { key: "offer" as const, label: "Публичная оферта" },
  { key: "cookies" as const, label: "Использование cookie" },
];

const socialMeta: Record<SiteSocialKey, { label: string; icon: ReactNode }> = {
  telegram: {
    label: "Telegram",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  whatsapp: {
    label: "WhatsApp",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  vk: {
    label: "ВКонтакте",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.136.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.673 4 8.231c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
    ),
  },
  max: {
    label: "MAX",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h4.2l3.8 6.2L15.8 4H20l-6 8.8V20h-4v-7.2L4 4z"/>
      </svg>
    ),
  },
};

function FooterHref({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isInternalLink(href)) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function Footer() {
  const { profile, branding } = useSite();
  const name = displayName(profile, branding);
  const phone = primaryPhone(profile);
  const email = primaryEmail(profile);
  const office = officeAddress(profile);
  const legal = legalAddress(profile);
  const socials = socialEntries(profile);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4 md:space-y-5">
              {branding.logoPanelEnabled ? (
                <img src={branding.logoPanelUrl} alt={name} className="h-6 md:h-7 w-auto" />
              ) : (
                <p className="text-sm font-black uppercase tracking-widest text-white">{name}</p>
              )}
              <p className="text-[10px] md:text-xs text-white/20 leading-relaxed max-w-sm">
                {[profile.legalName, profile.tagline].filter(Boolean).join(" — ")}
              </p>
              <div className="space-y-2">
                {phone && (
                  <a href={telHref(phone)} className="flex items-center gap-2 text-white/20 hover:text-primary transition-colors">
                    <Phone className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] md:text-xs">{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={mailtoHref(email)} className="flex items-center gap-2 text-white/20 hover:text-primary transition-colors">
                    <Mail className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] md:text-xs">{email}</span>
                  </a>
                )}
                {office && (
                  <div className="flex items-center gap-2 text-white/20">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    <span className="text-[10px] md:text-xs">{office.address}</span>
                  </div>
                )}
                {profile.workingHours && (
                  <p className="text-[10px] md:text-xs text-white/20 pl-5">{profile.workingHours}</p>
                )}
              </div>

              {socials.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialMeta[social.key].label}
                      className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    >
                      {socialMeta[social.key].icon}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
                Каталог
              </p>
              <ul className="space-y-2 md:space-y-2.5">
                {footerLinks.catalog.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[10px] md:text-xs text-white/25 hover:text-primary transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
                Услуги
              </p>
              <ul className="space-y-2 md:space-y-2.5">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[10px] md:text-xs text-white/25 hover:text-primary transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
                Компания
              </p>
              <ul className="space-y-2 md:space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[10px] md:text-xs text-white/25 hover:text-primary transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/60">
                Правовая информация
              </p>
              <ul className="space-y-2 md:space-y-2.5">
                {legalLabels.map((link) => (
                  <li key={link.key}>
                    <FooterHref
                      href={profile.legalLinks[link.key]}
                      className="text-[10px] md:text-xs text-white/25 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </FooterHref>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 md:mt-14 lg:mt-16 pt-6 md:pt-8 border-t border-white/5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-[10px] text-white/15 leading-relaxed">
                <p>{legalEntityLine(profile)}</p>
                {legal && (
                  <p className="mt-0.5">
                    Юридический адрес: {legal.address}
                  </p>
                )}
              </div>
              <p className="text-[10px] text-white/15 shrink-0">
                © 2023–{year} {profile.legalName}. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
