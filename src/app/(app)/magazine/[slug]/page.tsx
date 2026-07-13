import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [p] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return p ? { title: p.title, description: p.excerpt ?? undefined, openGraph: { images: p.coverImage ? [p.coverImage] : [] } } : { title: "Post not found" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (!post) notFound();

  const html = post.content
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.trim() === "") return "";
      return `<p>${line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("");

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/magazine" className="text-sm text-clay-600 hover:text-clay-700">← Magazine</Link>
      <div className="text-xs uppercase tracking-widest text-clay-600 mt-4">{post.category}</div>
      <h1 className="mt-2 font-display text-5xl text-ink-900">{post.title}</h1>
      {post.coverImage && (
        <div className="mt-6 h-80 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
      )}
      <div
        className="prose prose-lg mt-8 max-w-none prose-headings:font-display prose-headings:text-ink-900 prose-p:text-ink-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
