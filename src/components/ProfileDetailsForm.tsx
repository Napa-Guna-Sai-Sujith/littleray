"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
};

export default function ProfileDetailsForm({ user }: { user: User }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-clay-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-clay-100 pb-4">
        <h2 className="font-display text-2xl text-ink-900">Profile Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-clay-300 px-4 py-1.5 text-sm font-medium text-ink-700 hover:bg-clay-100 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-clay-300 bg-clay-50 px-3 py-2 text-sm text-ink-900 focus:border-clay-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="mt-1 block w-full rounded-lg border border-clay-300 bg-clay-50 px-3 py-2 text-sm text-ink-900 focus:border-clay-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="mt-1 block w-full rounded-lg border border-clay-200 bg-clay-100/50 px-3 py-2 text-sm text-ink-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300">
              Role (Read-only)
            </label>
            <input
              type="text"
              disabled
              value={user.role}
              className="mt-1 block w-full rounded-lg border border-clay-200 bg-clay-100/50 px-3 py-2 text-sm text-ink-400 capitalize cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-clay-600 px-5 py-2 text-sm font-medium text-clay-50 hover:bg-clay-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(user.name);
                setPhone(user.phone || "");
                setError("");
              }}
              className="rounded-full border border-clay-300 px-5 py-2 text-sm text-ink-700 hover:bg-clay-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Name</div>
            <div className="mt-1 text-sm font-medium text-ink-900">{user.name}</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Phone Number</div>
            <div className="mt-1 text-sm font-medium text-ink-900">
              {user.phone || <span className="text-ink-400 italic">Not provided</span>}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Email Address</div>
            <div className="mt-1 text-sm font-medium text-ink-900">{user.email}</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Account Type</div>
            <div className="mt-1 text-sm font-medium text-ink-900 capitalize">{user.role}</div>
          </div>
        </div>
      )}
    </div>
  );
}
