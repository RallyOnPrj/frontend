"use client";

import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type TagChipProps = {
  tag?: string | null;
  className?: string;
  muted?: boolean;
};

export function TagChip({ tag, className, muted = false }: TagChipProps) {
  const hasTag = !!tag;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-2 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-[0.2em]",
        hasTag
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : muted
            ? "border-zinc-200 bg-zinc-100 text-zinc-400"
            : "border-zinc-300 bg-white text-zinc-500",
        className
      )}
    >
      <Hash className="h-3.5 w-3.5" />
      {hasTag ? tag : "UNSET"}
    </span>
  );
}
