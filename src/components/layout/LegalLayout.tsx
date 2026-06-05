import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  updatedDate: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, updatedDate, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            На главную
          </Link>

          <div className="space-y-3 mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
              {title}
            </h1>
            <p className="text-[10px] md:text-xs text-white/20">
              Дата последнего обновления: {updatedDate}
            </p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/60">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
