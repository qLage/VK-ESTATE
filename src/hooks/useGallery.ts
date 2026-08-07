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
    // activeAlbum is read only to set a default once; albums should not reload when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // We intentionally watch only the slug; other album fields should not trigger a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlbum?.slug]);

  return { albums, photos, activeAlbum, setActiveAlbum, loading, error };
}
