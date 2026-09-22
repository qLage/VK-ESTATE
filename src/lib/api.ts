// API client for the public website.
// Catalog goes through /api/site-catalog so the CRM token never reaches the browser:
//   dev  — Vite proxy injects CRM_SITE_TOKEN
//   prod — nginx must add the same token (see deploy/nginx-site-catalog.conf)
// Gallery and employees still use the public CRM endpoints via /api.

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface CatalogAgent {
  name: string;
  phone?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface CatalogPhoto {
  url: string;
  order?: number;
}

export interface CatalogCoordinates {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
}

export interface CatalogProperty {
  id: string;
  category: string;
  city: string | null;
  address: string | null;
  price: number;
  rooms: string | null;
  areaTotal: number | null;
  areaLiving?: number | null;
  areaKitchen?: number | null;
  landArea?: number | null;
  floor: number | null;
  floorsTotal: number | null;
  coverUrl: string | null;
  photoCount: number;
  agent?: CatalogAgent | null;
  description?: string | null;
  photos?: CatalogPhoto[];
  coordinates?: CatalogCoordinates | null;
  lat?: number | null;
  lng?: number | null;
  renovation?: string | null;
  houseType?: string | null;
  cadastral?: string | null;
  video?: string | null;
  videoUrl?: string | null;
  tour3d?: string | null;
  tour3dUrl?: string | null;
}

type RawRecord = Record<string, unknown>;

function pick<T>(raw: RawRecord, ...keys: string[]): T | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (value !== undefined && value !== null && value !== "") {
      return value as T;
    }
  }
  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function sanitizeAvatar(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("data:")) return null;
  return url;
}

function normalizePhotos(raw: unknown, coverUrl: string | null): CatalogPhoto[] {
  if (!Array.isArray(raw)) {
    return coverUrl ? [{ url: coverUrl, order: 0 }] : [];
  }

  const photos = raw.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as RawRecord;
    const url = String(pick<string>(row, "url", "file_url") || "");
    if (!url) return [];
    return [{ url, order: asNumber(pick(row, "order", "sort_order")) ?? index }];
  });

  if (photos.length > 0) return photos;
  return coverUrl ? [{ url: coverUrl, order: 0 }] : [];
}

function normalizeAgent(raw: unknown): CatalogAgent | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as RawRecord;
  const name = String(pick<string>(row, "name", "full_name") || "").trim();
  if (!name) return null;
  return {
    name,
    phone: pick<string>(row, "phone") || null,
    email: pick<string>(row, "email") || null,
    avatarUrl: sanitizeAvatar(pick<string>(row, "avatarUrl", "avatar_url") || null),
  };
}

export function normalizeCatalogProperty(raw: unknown): CatalogProperty {
  const row = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const coverUrl = pick<string>(row, "coverUrl", "cover_url") || null;
  const lat = asNumber(pick(row, "lat", "latitude")) ?? asNumber((row.coordinates as RawRecord | undefined)?.lat);
  const lng = asNumber(pick(row, "lng", "longitude")) ?? asNumber((row.coordinates as RawRecord | undefined)?.lng);

  return {
    id: String(row.id || ""),
    category: String(row.category || ""),
    city: pick<string>(row, "city") || null,
    address: pick<string>(row, "address") || null,
    price: asNumber(row.price) || 0,
    rooms: pick<string>(row, "rooms") != null ? String(pick(row, "rooms")) : null,
    areaTotal: asNumber(pick(row, "areaTotal", "area_total")),
    areaLiving: asNumber(pick(row, "areaLiving", "area_living")),
    areaKitchen: asNumber(pick(row, "areaKitchen", "area_kitchen")),
    landArea: asNumber(pick(row, "landArea", "land_area")),
    floor: asNumber(pick(row, "floor")),
    floorsTotal: asNumber(pick(row, "floorsTotal", "floors_total")),
    coverUrl,
    photoCount: asNumber(pick(row, "photoCount", "photo_count")) || 0,
    agent: normalizeAgent(row.agent),
    description: pick<string>(row, "description") || null,
    photos: normalizePhotos(row.photos, coverUrl),
    coordinates: lat != null && lng != null ? { lat, lng } : null,
    lat,
    lng,
    renovation: pick<string>(row, "renovation") || null,
    houseType: pick<string>(row, "houseType", "house_type") || null,
    cadastral: pick<string>(row, "cadastral", "cadastral_number") || null,
    videoUrl: pick<string>(row, "videoUrl", "video_url", "video") || null,
    tour3dUrl: pick<string>(row, "tour3dUrl", "tour_url3_d", "tour3d") || null,
  };
}

export interface CatalogListResponse {
  total: number;
  limit: number;
  offset: number;
  items: CatalogProperty[];
}

export interface CatalogQuery {
  limit?: number;
  offset?: number;
  city?: string;
  category?: string;
}

export interface ApiEmployee {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  position_id: string | null;
  position_name: string | null;
}

export interface ApiGalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  sort_order: number;
}

export interface ApiGalleryPhoto {
  id: string;
  file_url: string;
  caption: string | null;
  sort_order: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
}

class SiteAPIClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async getCatalog(query: CatalogQuery = {}): Promise<CatalogListResponse> {
    const params = new URLSearchParams();
    params.set("limit", String(query.limit ?? 50));
    params.set("offset", String(query.offset ?? 0));
    if (query.city) params.set("city", query.city);
    if (query.category) params.set("category", query.category);

    const data = await this.request<{ total?: number; limit?: number; offset?: number; items?: unknown[] }>(
      `/site-catalog?${params.toString()}`,
    );
    const items = Array.isArray(data.items) ? data.items.map(normalizeCatalogProperty).filter((item) => item.id) : [];
    return {
      total: data.total ?? items.length,
      limit: data.limit ?? query.limit ?? 50,
      offset: data.offset ?? query.offset ?? 0,
      items,
    };
  }

  async getCatalogItem(id: string): Promise<CatalogProperty> {
    const data = await this.request<unknown>(`/site-catalog/${encodeURIComponent(id)}`);
    return normalizeCatalogProperty(data);
  }

  async getPublicEmployees(limit = 50): Promise<ApiEmployee[]> {
    const res = await this.request<ApiEmployee[] | ApiResponse<ApiEmployee[]>>(
      `/employees/public?limit=${limit}`,
    );
    return Array.isArray(res) ? res : res.data || [];
  }

  async getGalleryAlbums(): Promise<ApiGalleryAlbum[]> {
    const res = await this.request<ApiResponse<ApiGalleryAlbum[]>>("/gallery/albums/public");
    return res.data || [];
  }

  async getAlbumPhotos(slug: string): Promise<{ album: ApiGalleryAlbum; photos: ApiGalleryPhoto[] }> {
    const res = await this.request<ApiResponse<{ album: ApiGalleryAlbum; photos: ApiGalleryPhoto[] }>>(
      `/gallery/albums/${slug}/photos`,
    );
    return res.data || { album: {} as ApiGalleryAlbum, photos: [] };
  }

  async getSiteProfile(): Promise<unknown> {
    return this.request<unknown>("/settings/site-profile");
  }

  async getBranding(): Promise<unknown> {
    return this.request<unknown>("/settings/branding");
  }
}

export const siteAPI = new SiteAPIClient();
