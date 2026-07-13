"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export default function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    setIsOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const isAdmin = ["admin", "designer", "sales"].includes(user.role);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-600 text-clay-50 font-semibold hover:bg-clay-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-clay-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base select-none">{initial}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-clay-200 bg-white/95 backdrop-blur-md p-2 shadow-xl ring-1 ring-black/5 z-50 focus:outline-none transition-all duration-200">
          <div className="px-4 py-3 border-b border-clay-100/80 mb-1">
            <p className="text-sm font-semibold text-ink-900 truncate">{user.name}</p>
            <p className="text-xs text-ink-400 capitalize truncate mt-0.5">{user.role}</p>
          </div>

          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-4 py-2 text-sm text-ink-700 hover:bg-clay-100 hover:text-ink-900 transition-colors"
            >
              My Profile
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm text-ink-700 hover:bg-clay-100 hover:text-ink-900 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}

            <hr className="my-1 border-clay-100" />

            <button
              onClick={handleLogout}
              className="w-full text-left rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
