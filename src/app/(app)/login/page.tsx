import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AuthTabs from "@/components/AuthTabs";

export const metadata: Metadata = { title: "Log in or sign up" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    if (["admin", "designer", "sales"].includes(session.role)) redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Account</div>
      <h1 className="mt-2 font-display text-4xl text-ink-900">Welcome back.</h1>
      <p className="mt-2 text-ink-700">Sign in to explore our full portfolio, price calculator, shop, and more.</p>
      <div className="mt-8">
        <AuthTabs />
      </div>
      <div className="mt-8 rounded-lg bg-clay-100 p-4 text-xs text-ink-700">
        <b>Demo credentials:</b><br />
        Customer — customer@littleray.local / customer123<br />
        Admin — admin@littleray.local / admin123
      </div>
    </div>
  );
}
