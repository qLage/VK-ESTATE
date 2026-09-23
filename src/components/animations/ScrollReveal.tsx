import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.45,
}: ScrollRevealProps) {
  const { ref, isRevealed } = useScrollReveal({
    threshold: 0.08,
    rootMargin: "0px 0px -24px 0px",
  });

  const directionStyles: Record<string, string> = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
    scale: "scale-[0.98]",
    fade: "",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100",
        !isRevealed && directionStyles[direction],
        !isRevealed && "opacity-0 motion-reduce:opacity-100",
        isRevealed && "opacity-100 translate-x-0 translate-y-0 scale-100",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: isRevealed ? `${Math.min(delay, 0.2)}s` : "0s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}
