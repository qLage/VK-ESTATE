import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { siteAPI } from "@/lib/api";
import {
  FALLBACK_BRANDING,
  FALLBACK_PROFILE,
  mergeSiteBranding,
  mergeSiteProfile,
  type SiteBranding,
  type SiteProfile,
} from "@/lib/site";

interface SiteContextValue {
  profile: SiteProfile;
  branding: SiteBranding;
  loading: boolean;
}

const SiteContext = createContext<SiteContextValue>({
  profile: FALLBACK_PROFILE,
  branding: FALLBACK_BRANDING,
  loading: true,
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<SiteProfile>(FALLBACK_PROFILE);
  const [branding, setBranding] = useState<SiteBranding>(FALLBACK_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profileRaw, brandingRaw] = await Promise.all([
          siteAPI.getSiteProfile(),
          siteAPI.getBranding(),
        ]);
        if (cancelled) return;
        const nextProfile = mergeSiteProfile(profileRaw);
        const nextBranding = mergeSiteBranding(brandingRaw);
        setProfile(nextProfile);
        setBranding(nextBranding);
        document.title = `${nextBranding.companyName} — Агентство недвижимости`;
        const icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
        if (icon && nextBranding.logoPanelUrl) icon.href = nextBranding.logoPanelUrl;
      } catch {
        if (!cancelled) {
          setProfile(FALLBACK_PROFILE);
          setBranding(FALLBACK_BRANDING);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteContext.Provider value={{ profile, branding, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  return useContext(SiteContext);
}
