import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = { title: "Magazine — design ideas & guides" };

export default async function MagazinePage() {
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-clay-600">Magazine</div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">Ideas, guides & real projects.</h1>
      </div>

      {featured && (
        <Link href={`/magazine/${featured.slug}`} className="mt-10 grid gap-6 rounded-2xl border border-clay-200 bg-white p-4 md:grid-cols-2 md:p-6">
          <div className="h-64 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${featured.coverImage})` }} />
          <div className="flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-clay-600">{featured.category}</div>
            <h2 className="mt-1 font-display text-3xl text-ink-900">{featured.title}</h2>
            <p className="mt-2 text-ink-700">{featured.excerpt}</p>
            <span className="mt-3 text-sm text-clay-600">Read article →</span>
          </div>
        </Link>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.id} href={`/magazine/${p.slug}`} className="group overflow-hidden rounded-2xl border border-clay-200 bg-white">
            <div className="h-48 w-full bg-cover bg-center transition group-hover:scale-105" style={{ backgroundImage: `url(${p.coverImage})` }} />
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-clay-600">{p.category}</div>
              <div className="mt-1 font-display text-lg text-ink-900">{p.title}</div>
              <div className="mt-1 text-sm text-ink-500">{p.excerpt?.slice(0, 90)}…</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
