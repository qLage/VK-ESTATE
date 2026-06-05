import { useState, useEffect } from "react";
import { siteAPI, type ApiGalleryAlbum, type ApiGalleryPhoto } from "@/lib/api";

export function useGallery() {
  const [albums, setAlbums] = useState<ApiGalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<ApiGalleryPhoto[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<ApiGalleryAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAlbums() {
      try {
        setLoading(true);
        const data = await siteAPI.getGalleryAlbums();
        if (!cancelled) {
          setAlbums(data);
          if (data.length > 0 && !activeAlbum) {
            setActiveAlbum(data[0]);
          }
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка загрузки");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAlbums();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPhotos() {
      if (!activeAlbum) return;
      try {
        setLoading(true);
        const data = await siteAPI.getAlbumPhotos(activeAlbum.slug);
        if (!cancelled) {
          setPhotos(data.photos);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ошибка загрузки фото");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPhotos();
    return () => { cancelled = true; };
  }, [activeAlbum?.slug]);

  return { albums, photos, activeAlbum, setActiveAlbum, loading, error };
}
