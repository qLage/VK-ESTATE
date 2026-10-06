/** Cookie / preference consent helpers (first-party localStorage only). */

export const COOKIE_CONSENT_KEY = "vkrysha_cookie_consent";

export type CookieConsentChoice =
  | { consent: "all"; date: string }
  | { consent: "necessary"; date: string }
  | { consent: "custom"; analytics: boolean; marketing: boolean; date: string };

export function readCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsentChoice;
  } catch {
    return null;
  }
}

export function writeCookieConsent(value: CookieConsentChoice): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("vkrysha-cookie-consent"));
}

export function clearCookieConsent(): void {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent("vkrysha-cookie-consent"));
}

/** Analytics scripts must not load unless explicitly allowed. Currently none are shipped. */
export function analyticsAllowed(): boolean {
  const choice = readCookieConsent();
  if (!choice) return false;
  if (choice.consent === "all") return true;
  if (choice.consent === "custom") return Boolean(choice.analytics);
  return false;
}

export function marketingAllowed(): boolean {
  const choice = readCookieConsent();
  if (!choice) return false;
  if (choice.consent === "all") return true;
  if (choice.consent === "custom") return Boolean(choice.marketing);
  return false;
}
