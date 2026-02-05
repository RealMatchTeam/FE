// src/routes/_home/components/HeroCarousel.tsx
import { useState } from "react";
import type { HeroItem } from "../../../types/home";

export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;

  const current = items[Math.min(idx, items.length - 1)];

  return (
    <div className="relative">
      {/* 캡쳐처럼 꽤 큰 히어로 */}
      <div className="aspect-[375/210] w-full bg-black/5">
        <img src={current.imageUrl} alt={current.alt} className="h-full w-full object-cover" />
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`dot-${i}`}
            onClick={() => setIdx(i)}
            className={[
              "h-1.5 w-1.5 rounded-full",
              i === idx ? "bg-white" : "bg-white/40",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
