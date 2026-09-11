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
  floor: number | null;
  floorsTotal: number | null;
  coverUrl: string | null;
  photoCount: number;
  agent?: CatalogAgent | null;
  description?: string | null;
  photos?: CatalogPhoto[];
  coordinates?: CatalogCoordinates | null;
  renovation?: string | null;
  houseType?: string | null;
  cadastral?: string | null;
  video?: string | null;
  videoUrl?: string | null;
  tour3d?: string | null;
  tour3dUrl?: string | null;
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
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

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

    const data = await this.request<CatalogListResponse>(`/site-catalog?${params.toString()}`);
    return {
      total: data.total ?? 0,
      limit: data.limit ?? query.limit ?? 50,
      offset: data.offset ?? query.offset ?? 0,
      items: data.items ?? [],
    };
  }

  async getCatalogItem(id: string): Promise<CatalogProperty> {
    return this.request<CatalogProperty>(`/site-catalog/${encodeURIComponent(id)}`);
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
}

export const siteAPI = new SiteAPIClient();
