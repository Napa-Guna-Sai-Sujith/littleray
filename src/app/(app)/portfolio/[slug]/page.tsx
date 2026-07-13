import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects, cities, testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import BeforeAfter from "@/components/BeforeAfter";

export async function generateStaticParams() {
  try {
    const all = await db.select({ slug: projects.slug }).from(projects);
    return all.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [p] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.description ?? undefined,
    openGraph: { images: [p.coverImage] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  if (!project) notFound();
  const [city] = project.cityId ? await db.select().from(cities).where(eq(cities.id, project.cityId)).limit(1) : [null];
  const projectTestimonial = await db.select().from(testimonials).where(eq(testimonials.projectId, project.id)).limit(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/portfolio" className="text-sm text-clay-600 hover:text-clay-700">← All projects</Link>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-clay-600">
          {project.bhk} · {project.style} {city ? `· ${city.name}` : ""}
        </div>
        <h1 className="mt-2 font-display text-5xl text-ink-900">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-ink-700">{project.description}</p>
      </div>

      <div
        className="mt-8 h-[520px] w-full rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${project.coverImage})` }}
        role="img"
        aria-label={project.title}
      />

      {project.beforeImage && project.afterImage && (
        <div className="mt-10">
          <h2 className="font-display text-3xl text-ink-900">Before & after</h2>
          <div className="mt-4">
            <BeforeAfter before={project.beforeImage} after={project.afterImage} />
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {project.images.map((im, i) => (
          <div key={i} className="h-56 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${im})` }} />
        ))}
      </div>

      {projectTestimonial.length > 0 && (
        <figure className="mt-12 rounded-2xl bg-clay-100 p-8">
          <div className="text-clay-500">{"★".repeat(projectTestimonial[0].rating)}</div>
          <blockquote className="mt-2 font-display text-2xl text-ink-900">“{projectTestimonial[0].quote}”</blockquote>
          <figcaption className="mt-2 text-sm text-ink-500">— {projectTestimonial[0].customerName}{city ? `, ${city.name}` : ""}</figcaption>
        </figure>
      )}
    </div>
  );
}
