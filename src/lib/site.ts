export const CRM_ORIGIN = "https://vkrysha-crm.ru";

export type SiteSocialKey = "telegram" | "whatsapp" | "vk" | "youtube" | "max" | "instagram";

export interface SiteAddress {
  label: string | null;
  address: string;
  isPrimary: boolean;
}

export interface SiteSocials {
  telegram: string | null;
  whatsapp: string | null;
  vk: string | null;
  youtube: string | null;
  max: string | null;
  instagram: string | null;
}

export interface SiteLegalLinks {
  privacy: string;
  terms: string;
  offer: string;
  cookies: string;
}

export interface SiteProfile {
  legalName: string;
  tagline: string | null;
  description: string | null;
  inn: string | null;
  ogrnip: string | null;
  phones: string[];
  emails: string[];
  addresses: SiteAddress[];
  workingHours: string | null;
  socials: SiteSocials;
  legalLinks: SiteLegalLinks;
}

export interface SiteBranding {
  companyName: string;
  logoUrl: string;
  logoPanelUrl: string;
  logoPanelEnabled: boolean;
  accentColor: string | null;
}

export const FALLBACK_PROFILE: SiteProfile = {
  legalName: "ИП Матвеева Ангелина Владимировна",
  tagline: "риэлторские услуги в Воронеже и области с 2023 года",
  description: null,
  inn: "366112052029",
  ogrnip: "323366800066581",
  phones: ["+7 (XXX) XXX-XX-XX"],
  emails: ["boyarova.angelina.rieltor@mail.ru"],
  addresses: [
    {
      label: "Офис",
      address: "394000, г. Воронеж, ул. Донбасская, д. 25К2, кв. 168",
      isPrimary: true,
    },
  ],
  workingHours: "Пн–Пт 9:00–20:00",
  socials: {
    telegram: "https://t.me/vashakrysha",
    whatsapp: "https://wa.me/78001234567",
    vk: "https://vk.com/vashakrysha",
    youtube: "https://youtube.com/@vashakrysha",
    max: null,
    instagram: null,
  },
  legalLinks: {
    privacy: "/privacy",
    terms: "/terms",
    offer: "/offer",
    cookies: "/cookies",
  },
};

export const FALLBACK_BRANDING: SiteBranding = {
  companyName: "Ваша Крыша",
  logoUrl: "/logo.svg",
  logoPanelUrl: "/logo-panel.svg",
  logoPanelEnabled: true,
  accentColor: null,
};

type RawRecord = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(asString).filter((item): item is string => Boolean(item));
}

function pickString(raw: RawRecord, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = asString(raw[key]);
    if (value) return value;
  }
  return null;
}

export function resolveCrmAsset(url: string | null | undefined): string | null {
  if (!url) return null;
  const value = url.trim();
  if (!value) return null;
  if (value.startsWith("http") || value.startsWith("data:")) return value;
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${CRM_ORIGIN}${value}`;
  return value;
}

export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return `tel:+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return `tel:+${digits}`;
  if (digits.length === 10) return `tel:+7${digits}`;
  return `tel:${phone}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

export function isInternalLink(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function primaryPhone(profile: SiteProfile): string | null {
  return profile.phones[0] || null;
}

export function primaryEmail(profile: SiteProfile): string | null {
  return profile.emails[0] || null;
}

export function primaryAddress(profile: SiteProfile): SiteAddress | null {
  return profile.addresses.find((item) => item.isPrimary) || profile.addresses[0] || null;
}

export function displayName(profile: SiteProfile, branding: SiteBranding): string {
  return branding.companyName || profile.legalName || FALLBACK_BRANDING.companyName;
}

export function legalEntityLine(profile: SiteProfile): string {
  const parts = [profile.legalName];
  if (profile.ogrnip) parts.push(`ОГРНИП ${profile.ogrnip}`);
  if (profile.inn) parts.push(`ИНН ${profile.inn}`);
  return parts.join(" · ");
}

export function operatorRequisites(profile: SiteProfile): string {
  const extras = [];
  if (profile.ogrnip) extras.push(`ОГРНИП: ${profile.ogrnip}`);
  if (profile.inn) extras.push(`ИНН: ${profile.inn}`);
  const address = primaryAddress(profile);
  if (address) extras.push(`адрес: ${address.address}`);
  if (extras.length === 0) return profile.legalName;
  return `${profile.legalName} (${extras.join(", ")})`;
}

export function socialEntries(profile: SiteProfile): { key: SiteSocialKey; href: string }[] {
  const keys: SiteSocialKey[] = ["telegram", "whatsapp", "vk", "youtube", "instagram", "max"];
  return keys.flatMap((key) => {
    const href = profile.socials[key];
    return href ? [{ key, href }] : [];
  });
}

function normalizeAddresses(raw: unknown): SiteAddress[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as RawRecord;
    const address = pickString(row, "address") || "";
    if (!address) return [];
    return [
      {
        label: pickString(row, "label"),
        address,
        isPrimary: Boolean(row.is_primary || row.isPrimary),
      },
    ];
  });
}

function normalizeSocials(raw: unknown): Partial<SiteSocials> {
  if (!raw || typeof raw !== "object") return {};
  const row = raw as RawRecord;
  return {
    telegram: pickString(row, "telegram"),
    whatsapp: pickString(row, "whatsapp"),
    vk: pickString(row, "vk"),
    youtube: pickString(row, "youtube"),
    max: pickString(row, "max"),
    instagram: pickString(row, "instagram"),
  };
}

function normalizeLegalLinks(raw: unknown): Partial<SiteLegalLinks> {
  if (!raw || typeof raw !== "object") return {};
  const row = raw as RawRecord;
  return {
    privacy: pickString(row, "privacy") || undefined,
    terms: pickString(row, "terms") || undefined,
    offer: pickString(row, "offer") || undefined,
    cookies: pickString(row, "cookies") || undefined,
  };
}

export function normalizeSiteProfile(raw: unknown): Partial<SiteProfile> {
  const row = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const socials = normalizeSocials(row.socials);
  const legalLinks = normalizeLegalLinks(row.legal_links ?? row.legalLinks);
  return {
    legalName: pickString(row, "legal_name", "legalName") || undefined,
    tagline: pickString(row, "tagline"),
    description: pickString(row, "description"),
    inn: pickString(row, "inn"),
    ogrnip: pickString(row, "ogrnip"),
    phones: asStringList(row.phones),
    emails: asStringList(row.emails),
    addresses: normalizeAddresses(row.addresses),
    workingHours: pickString(row, "working_hours", "workingHours"),
    socials: {
      telegram: socials.telegram ?? null,
      whatsapp: socials.whatsapp ?? null,
      vk: socials.vk ?? null,
      youtube: socials.youtube ?? null,
      max: socials.max ?? null,
      instagram: socials.instagram ?? null,
    },
    legalLinks: {
      privacy: legalLinks.privacy || FALLBACK_PROFILE.legalLinks.privacy,
      terms: legalLinks.terms || FALLBACK_PROFILE.legalLinks.terms,
      offer: legalLinks.offer || FALLBACK_PROFILE.legalLinks.offer,
      cookies: legalLinks.cookies || FALLBACK_PROFILE.legalLinks.cookies,
    },
  };
}

export function normalizeSiteBranding(raw: unknown): Partial<SiteBranding> {
  const row = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  return {
    companyName: pickString(row, "company_name", "companyName") || undefined,
    logoUrl: resolveCrmAsset(pickString(row, "logo_url", "logoUrl")) || undefined,
    logoPanelUrl: resolveCrmAsset(pickString(row, "logo_panel_url", "logoPanelUrl")) || undefined,
    logoPanelEnabled: row.logo_panel_enabled !== false && row.logoPanelEnabled !== false,
    accentColor: pickString(row, "accent_color", "accentColor"),
  };
}

export function mergeSiteProfile(raw: unknown): SiteProfile {
  const incoming = normalizeSiteProfile(raw);
  return {
    legalName: incoming.legalName || FALLBACK_PROFILE.legalName,
    tagline: incoming.tagline ?? FALLBACK_PROFILE.tagline,
    description: incoming.description ?? FALLBACK_PROFILE.description,
    inn: incoming.inn ?? FALLBACK_PROFILE.inn,
    ogrnip: incoming.ogrnip ?? FALLBACK_PROFILE.ogrnip,
    phones: incoming.phones && incoming.phones.length > 0 ? incoming.phones : FALLBACK_PROFILE.phones,
    emails: incoming.emails && incoming.emails.length > 0 ? incoming.emails : FALLBACK_PROFILE.emails,
    addresses: incoming.addresses && incoming.addresses.length > 0 ? incoming.addresses : FALLBACK_PROFILE.addresses,
    workingHours: incoming.workingHours ?? FALLBACK_PROFILE.workingHours,
    socials: {
      telegram: incoming.socials?.telegram ?? FALLBACK_PROFILE.socials.telegram,
      whatsapp: incoming.socials?.whatsapp ?? FALLBACK_PROFILE.socials.whatsapp,
      vk: incoming.socials?.vk ?? FALLBACK_PROFILE.socials.vk,
      youtube: incoming.socials?.youtube ?? FALLBACK_PROFILE.socials.youtube,
      max: incoming.socials?.max ?? FALLBACK_PROFILE.socials.max,
      instagram: incoming.socials?.instagram ?? FALLBACK_PROFILE.socials.instagram,
    },
    legalLinks: incoming.legalLinks || FALLBACK_PROFILE.legalLinks,
  };
}

export function mergeSiteBranding(raw: unknown): SiteBranding {
  const incoming = normalizeSiteBranding(raw);
  return {
    companyName: incoming.companyName || FALLBACK_BRANDING.companyName,
    logoUrl: incoming.logoUrl || FALLBACK_BRANDING.logoUrl,
    logoPanelUrl: incoming.logoPanelUrl || FALLBACK_BRANDING.logoPanelUrl,
    logoPanelEnabled: incoming.logoPanelEnabled ?? FALLBACK_BRANDING.logoPanelEnabled,
    accentColor: incoming.accentColor ?? FALLBACK_BRANDING.accentColor,
  };
}
