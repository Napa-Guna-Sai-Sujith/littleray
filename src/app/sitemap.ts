import type { MetadataRoute } from "next";
import { db } from "@/db";
import { cities, projects, blogPosts, states } from "@/db/schema";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const [allCities, allProjects, allPosts, allStates] = await Promise.all([
    db.select().from(cities),
    db.select().from(projects),
    db.select().from(blogPosts),
    db.select().from(states),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "", "/portfolio", "/services", "/calculator", "/shop",
    "/magazine", "/where-we-operate", "/about", "/consultation", "/login",
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));

  const cityRoutes: MetadataRoute.Sitemap = allCities.map((c) => ({
    url: `${base}/cities/${c.slug}`,
    changeFrequency: "weekly",
    priority: c.status === "live" ? 0.9 : 0.4,
    lastModified: c.createdAt,
  }));

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: p.createdAt,
  }));

  const postRoutes: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${base}/magazine/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
    lastModified: p.createdAt,
  }));

  void allStates;
  return [...staticRoutes, ...cityRoutes, ...projectRoutes, ...postRoutes];
}
