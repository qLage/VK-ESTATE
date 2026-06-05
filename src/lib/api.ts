// API client for the public website
// In dev, Vite proxy forwards /api → vkrysha-crm.ru/api
// In prod, configure nginx proxy or set VITE_API_URL env var

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface ApiProperty {
  id: string;
  category: string;
  city: string | null;
  address: string | null;
  price: number;
  area_total: number | null;
  area_living: number | null;
  area_kitchen: number | null;
  rooms: string | null;
  floor: number | null;
  floors_total: number | null;
  description: string | null;
  status: string;
  cover_url: string | null;
  photo_count: number;
  owner_name: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ApiEmployee {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
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

class SiteAPIClient {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

  // Public approved properties
  async getApprovedProperties(limit = 20, offset = 0): Promise<ApiProperty[]> {
    const res = await this.request<ApiProperty[]>(
      `/properties/public/approved?limit=${limit}&offset=${offset}`
    );
    return res.data || [];
  }

  // Public employees
  async getPublicEmployees(limit = 50): Promise<ApiEmployee[]> {
    const res = await this.request<ApiEmployee[]>(
      `/employees/public?limit=${limit}`
    );
    return res.data || [];
  }

  // Public gallery albums
  async getGalleryAlbums(): Promise<ApiGalleryAlbum[]> {
    const res = await this.request<ApiGalleryAlbum[]>("/gallery/albums/public");
    return res.data || [];
  }

  // Public album photos
  async getAlbumPhotos(slug: string): Promise<{ album: ApiGalleryAlbum; photos: ApiGalleryPhoto[] }> {
    const res = await this.request<{ album: ApiGalleryAlbum; photos: ApiGalleryPhoto[] }>(`/gallery/albums/${slug}/photos`);
    return res.data || { album: {} as ApiGalleryAlbum, photos: [] };
  }
}

export const siteAPI = new SiteAPIClient();
