import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  withText?: boolean;
  type?: "default" | "ops";
}

export function Logo({
  className,
  variant = "light",
  withText = true,
  type = "default",
}: LogoProps) {
  const isDark = variant === "dark";
  const markSrc = isDark
    ? "/rallyon-mark-dark.svg"
    : "/rallyon-mark-light.svg";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={markSrc}
        alt="RallyOn"
        width={32}
        height={32}
        className="h-full w-auto"
      />
      {withText && (
        <div className="flex items-baseline">
          <span
            className={cn(
              "font-display text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-zinc-950"
            )}
          >
            RALLY
          </span>
          <span
            className={cn(
              "font-display text-2xl font-light tracking-tight",
              isDark ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            ON
          </span>
          {type === "ops" && (
            <span className="ml-2 translate-y-[-2px] font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-500">
              Ops
            </span>
          )}
        </div>
      )}
    </div>
  );
}
