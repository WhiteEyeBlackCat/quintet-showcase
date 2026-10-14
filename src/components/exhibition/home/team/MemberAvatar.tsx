"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface MemberAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

/** Round avatar with a gradient halo; falls back to an initial when the image is missing. */
export function MemberAvatar({ src, name, className }: MemberAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;
  return (
    <span
      className={cn(
        "relative block size-24 shrink-0 rounded-full p-[2px] sm:size-28",
        "bg-[conic-gradient(from_200deg,var(--violet),var(--blue),var(--cyan),var(--violet))]",
        "shadow-[0_0_40px_-8px_rgba(139,124,255,0.6)]",
        className,
      )}
    >
      <span className="relative block size-full overflow-hidden rounded-full bg-night">
        {showImage ? (
          <Image
            src={src}
            alt={`${name} 的頭像`}
            fill
            sizes="112px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            role="img"
            aria-label={`${name} 的頭像`}
            className="flex size-full items-center justify-center bg-panel font-display text-3xl text-ink-soft"
          >
            {name.slice(-1)}
          </span>
        )}
      </span>
    </span>
  );
}
