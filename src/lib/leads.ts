export type LeadType = "contact" | "referral";

export interface ContactLeadPayload {
  type?: "contact";
  name: string;
  phone: string;
  message?: string;
  page?: string;
  /** Must be true — set only after explicit checkbox consent in the form UI. */
  consentAccepted: true;
}

export interface ReferralLeadPayload {
  type: "referral";
  /** Referrer's own data only — third-party contacts are not accepted (B1 redesign). */
  referrerName: string;
  referrerPhone: string;
  messenger?: string;
  /** Program theme selected by referrer (job/buy/sell/mortgage/other). */
  interest?: string;
  page?: string;
  /** Must be true — set only after explicit checkbox consent in the form UI. */
  consentAccepted: true;
}

export type LeadPayload = ContactLeadPayload | ReferralLeadPayload;

export async function submitLead(payload: LeadPayload): Promise<boolean> {
  if (payload.consentAccepted !== true) {
    return false;
  }

  const body = {
    ...payload,
    consentAccepted: true as const,
    page: payload.page || (typeof window !== "undefined" ? window.location.pathname : "/"),
  };

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.ok;
}
