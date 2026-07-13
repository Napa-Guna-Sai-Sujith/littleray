"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CityStatusToggle({ type, id, status }: { type: "city" | "state"; id: number; status: string }) {
  const [current, setCurrent] = useState(status);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const next = current === "live" ? "coming_soon" : "live";
    setCurrent(next);
    start(async () => {
      await fetch("/api/admin/city-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: next }),
      });
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${current === "live" ? "bg-sage-500 text-white" : "bg-clay-500 text-white"}`}
    >
      {current === "live" ? "Live" : "Coming soon"}
    </button>
  );
}
