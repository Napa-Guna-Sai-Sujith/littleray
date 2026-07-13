"use client";
import { useRef, useState } from "react";

export default function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onTouchMove={onMove}
      className="relative h-[480px] w-full select-none overflow-hidden rounded-2xl bg-cover bg-center"
      style={{ backgroundImage: `url(${after})` }}
      role="img"
      aria-label="Before and after slider"
    >
      <div
        className="absolute inset-y-0 left-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${before})`, width: `${pos}%` }}
      />
      <div className="absolute inset-y-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="h-full w-0.5 bg-white/90" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink-900 shadow">
          ← Drag →
        </div>
      </div>
      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">Before</div>
      <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white">After</div>
    </div>
  );
}
