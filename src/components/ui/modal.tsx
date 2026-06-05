import * as React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl p-6 md:p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="ml-auto h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
