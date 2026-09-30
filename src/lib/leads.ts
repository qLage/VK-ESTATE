export type LeadType = "contact" | "referral";

export interface ContactLeadPayload {
  type?: "contact";
  name: string;
  phone: string;
  message?: string;
  page?: string;
}

export interface ReferralLeadPayload {
  type: "referral";
  friendName: string;
  friendPhone: string;
  referrerName: string;
  referrerPhone: string;
  messenger?: string;
  page?: string;
}

export type LeadPayload = ContactLeadPayload | ReferralLeadPayload;

export async function submitLead(payload: LeadPayload): Promise<boolean> {
  const body = {
    ...payload,
    page: payload.page || (typeof window !== "undefined" ? window.location.pathname : "/"),
  };

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response.ok;
}
