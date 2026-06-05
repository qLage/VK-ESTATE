import { useGallery } from "@/hooks/useGallery";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Images, Camera } from "lucide-react";

export function Gallery() {
  const { albums, photos, activeAlbum, setActiveAlbum, loading, error } = useGallery();

  const hasData = albums.length > 0;

  return (
    <section id="gallery" className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/[0.03] blur-[120px] rounded-full translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.02] blur-[120px] rounded-full -translate-x-1/4" />
      </div>

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-10 md:mb-14 lg:mb-16" direction="up">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="h-px w-6 md:w-8 bg-primary/40" />
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                  Галерея
                </p>
                <div className="h-px w-6 md:w-8 bg-primary/40" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
                Жизнь <span className="text-primary">агентства</span>
              </h2>
              <p className="text-sm md:text-base text-white/30 max-w-2xl mx-auto leading-relaxed">
                Офис, команда и моменты, которые нас вдохновляют
              </p>
            </div>
          </ScrollReveal>

          {/* Album Tabs */}
          {hasData && (
            <ScrollReveal className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14" direction="up" delay={0.1}>
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setActiveAlbum(album)}
                  className={`relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeAlbum?.id === album.id
                      ? "bg-primary text-black"
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/5"
                  }`}
                >
                  {album.title}
                </button>
              ))}
            </ScrollReveal>
          )}

          {/* Album Description */}
          {activeAlbum && (
            <ScrollReveal key={activeAlbum.id} className="text-center mb-8 md:mb-10" direction="up" delay={0.05}>
              <p className="text-sm md:text-base text-white/30">{activeAlbum.description || "Фото из жизни агентства"}</p>
            </ScrollReveal>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Camera className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Не удалось загрузить галерею</p>
              <p className="text-xs text-white/20 mt-1">Проверьте соединение с CRM</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !hasData && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Images className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">Галерея скоро появится</p>
            </div>
          )}

          {/* Photo Grid */}
          {!loading && !error && photos.length > 0 && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
              {photos.map((photo, index) => (
                <ScrollReveal key={photo.id} delay={index * 0.06} direction="scale">
                  <div className="group relative break-inside-avoid rounded-xl md:rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 hover:border-primary/20 transition-all duration-500">
                    <img
                      src={photo.file_url}
                      alt={photo.caption || ""}
                      className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-xs font-bold text-white truncate">{photo.caption || "Фото"}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* No photos in active album */}
          {!loading && !error && hasData && photos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <Camera className="w-12 h-12 mb-4 text-primary/20" />
              <p className="text-sm">В этом альбоме пока нет фото</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
