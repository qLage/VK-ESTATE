import http from "node:http";
import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.LEADS_PORT || 8787);
const HOST = process.env.LEADS_HOST || "127.0.0.1";
const TOKEN = process.env.LEADS_API_TOKEN || "";
const DATA_DIR = process.env.LEADS_DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "leads.jsonl");

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const rateMap = new Map();

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(payload);
}

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) {
    return xf.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function allowPost(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count <= RATE_MAX;
}

function readBody(req, limit = 64_000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("payload_too_large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function trimStr(value, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function authorize(req) {
  if (!TOKEN) return false;
  const header = req.headers.authorization || "";
  return header === `Bearer ${TOKEN}`;
}

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function appendLead(lead) {
  await ensureStore();
  await appendFile(DATA_FILE, `${JSON.stringify(lead)}\n`, "utf8");
}

async function listLeads(sinceIso) {
  await ensureStore();
  let raw = "";
  try {
    raw = await readFile(DATA_FILE, "utf8");
  } catch (err) {
    if (err && err.code === "ENOENT") return [];
    throw err;
  }

  const sinceMs = sinceIso ? Date.parse(sinceIso) : NaN;
  const leads = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const item = JSON.parse(line);
      if (Number.isFinite(sinceMs)) {
        const created = Date.parse(item.createdAt || "");
        if (!Number.isFinite(created) || created < sinceMs) continue;
      }
      leads.push(item);
    } catch {
      // skip bad lines
    }
  }
  return leads;
}

function buildContactLead(body, page) {
  const name = trimStr(body.name, 120);
  const phone = trimStr(body.phone, 40);
  const message = trimStr(body.message, 2000);
  if (!name || !phone) {
    return { error: "name and phone are required" };
  }
  return {
    lead: {
      id: randomUUID(),
      type: "contact",
      createdAt: new Date().toISOString(),
      name,
      phone,
      message,
      source: "contact_form",
      page: trimStr(page || body.page || "/", 300) || "/",
    },
  };
}

function buildReferralLead(body, page) {
  // B1 Variant A: only referrer's own PD. Reject legacy third-party fields.
  if (trimStr(body.friendName, 1) || trimStr(body.friendPhone, 1)) {
    return {
      error:
        "third_party_contacts_not_accepted: use referrerName/referrerPhone only",
    };
  }
  const referrerName = trimStr(body.referrerName, 120);
  const referrerPhone = trimStr(body.referrerPhone, 40);
  const messenger = trimStr(body.messenger || "whatsapp", 40) || "whatsapp";
  const interest = trimStr(body.interest || "other", 40) || "other";
  if (!referrerName || !referrerPhone) {
    return { error: "referrerName and referrerPhone are required" };
  }
  return {
    lead: {
      id: randomUUID(),
      type: "referral",
      createdAt: new Date().toISOString(),
      name: referrerName,
      phone: referrerPhone,
      message: `referral_interest:${interest}`,
      source: "referral_form",
      page: trimStr(page || body.page || "/", 300) || "/",
      referrerName,
      referrerPhone,
      messenger,
      interest,
    },
  };
}

async function handlePost(req, res) {
  if (!allowPost(getClientIp(req))) {
    return json(res, 429, { ok: false, error: "rate_limit" });
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (err) {
    if (err && err.message === "payload_too_large") {
      return json(res, 413, { ok: false, error: "payload_too_large" });
    }
    return json(res, 400, { ok: false, error: "bad_request" });
  }

  let body;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return json(res, 400, { ok: false, error: "invalid_json" });
  }

  // Consent must be asserted by the client after an explicit checkbox action.
  // This does not prove legal sufficiency for third-party (referral) data —
  // it only blocks anonymous API bypass of the UI gate.
  if (body.consentAccepted !== true) {
    return json(res, 400, { ok: false, error: "consent_required" });
  }

  const type = trimStr(body.type || "contact", 40) || "contact";
  const page = trimStr(body.page, 300);
  const built =
    type === "referral" ? buildReferralLead(body, page) : buildContactLead(body, page);

  if (built.error) {
    return json(res, 400, { ok: false, error: built.error });
  }

  built.lead.consentAccepted = true;
  built.lead.consentAcceptedAt = new Date().toISOString();

  await appendLead(built.lead);
  return json(res, 201, { ok: true, lead: built.lead });
}

async function handleGet(req, res) {
  if (!authorize(req)) {
    return json(res, 401, { ok: false, error: "unauthorized" });
  }
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const since = url.searchParams.get("since") || undefined;
  const leads = await listLeads(since);
  return json(res, 200, { ok: true, count: leads.length, leads });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    if (req.method === "OPTIONS" && pathname === "/api/leads") {
      res.writeHead(204, {
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      return res.end();
    }

    if (pathname === "/api/leads" || pathname === "/leads") {
      if (req.method === "POST") return handlePost(req, res);
      if (req.method === "GET") return handleGet(req, res);
      return json(res, 405, { ok: false, error: "method_not_allowed" });
    }

    if (pathname === "/health") {
      return json(res, 200, { ok: true });
    }

    return json(res, 404, { ok: false, error: "not_found" });
  } catch (err) {
    console.error(err);
    return json(res, 500, { ok: false, error: "internal_error" });
  }
});

await ensureStore();
server.listen(PORT, HOST, () => {
  console.log(`leads-api listening on http://${HOST}:${PORT}`);
  if (!TOKEN) {
    console.warn("LEADS_API_TOKEN is empty — GET /api/leads will reject all requests");
  }
});
