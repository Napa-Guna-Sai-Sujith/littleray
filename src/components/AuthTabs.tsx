"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthTabs() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setLoading(false);
    if (!res.ok) { setErr((await res.json()).error ?? "Error"); return; }
    const data = await res.json();
    router.push(data.user?.role === "customer" || !data.user?.role ? "/dashboard" : "/admin");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-clay-200 bg-white p-6">
      <div className="flex gap-2">
        {(["login", "signup"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 text-sm ${mode === m ? "bg-clay-600 text-white" : "bg-clay-100 text-clay-700"}`}>
            {m === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {mode === "signup" && (
          <>
            <input required placeholder="Full name" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input placeholder="Phone" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </>
        )}
        <input required type="email" placeholder="Email" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input required type="password" placeholder="Password" className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <div className="text-xs text-red-600">{err.replace(/_/g, " ")}</div>}
        <button disabled={loading} className="w-full rounded-full bg-clay-600 py-2.5 text-sm text-white hover:bg-clay-700 disabled:opacity-60">
          {loading ? "…" : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
