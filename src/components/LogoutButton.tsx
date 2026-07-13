"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={logout} className="rounded-full border border-clay-300 px-4 py-2 text-sm text-ink-700 hover:bg-clay-100">
      Log out
    </button>
  );
}
