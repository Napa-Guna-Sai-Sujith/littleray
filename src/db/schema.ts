import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------- Geography ----------
export const states = pgTable(
  "states",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("coming_soon"), // live | coming_soon
    launchQuarter: varchar("launch_quarter", { length: 40 }),
    tagline: text("tagline"),
    priceMultiplier: numeric("price_multiplier", { precision: 4, scale: 2 })
      .notNull()
      .default("1.00"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("states_slug_idx").on(t.slug),
  }),
);

export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("coming_soon"),
    heroImage: text("hero_image"),
    description: text("description"),
    priceMultiplier: numeric("price_multiplier", { precision: 4, scale: 2 })
      .notNull()
      .default("1.00"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    citySlugIdx: uniqueIndex("cities_slug_idx").on(t.slug),
    stateIdx: index("cities_state_idx").on(t.stateId),
  }),
);

// ---------- Users & Auth ----------
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    phone: varchar("phone", { length: 20 }),
    role: varchar("role", { length: 20 }).notNull().default("customer"), // customer | designer | sales | admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  }),
);

// ---------- Portfolio ----------
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  cityId: integer("city_id").references(() => cities.id),
  bhk: varchar("bhk", { length: 10 }),
  style: varchar("style", { length: 60 }),
  roomType: varchar("room_type", { length: 60 }),
  budgetTier: varchar("budget_tier", { length: 20 }), // budget | premium | luxury
  coverImage: text("cover_image").notNull(),
  beforeImage: text("before_image"),
  afterImage: text("after_image"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Testimonials & Reviews ----------
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  cityId: integer("city_id").references(() => cities.id),
  rating: integer("rating").notNull().default(5),
  quote: text("quote").notNull(),
  projectId: integer("project_id").references(() => projects.id),
  photoUrl: text("photo_url"),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Leads / CRM ----------
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  cityId: integer("city_id").references(() => cities.id),
  stateId: integer("state_id").references(() => states.id),
  source: varchar("source", { length: 40 }).default("website"),
  message: text("message"),
  bhk: varchar("bhk", { length: 10 }),
  propertyType: varchar("property_type", { length: 40 }),
  budget: varchar("budget", { length: 40 }),
  status: varchar("status", { length: 40 }).notNull().default("new"),
  // new | contacted | site_visit | quoted | booked | in_progress | delivered | lost
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ---------- Waitlist ----------
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  cityId: integer("city_id").references(() => cities.id),
  stateId: integer("state_id").references(() => states.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Quotes ----------
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  cityId: integer("city_id").references(() => cities.id),
  bhk: varchar("bhk", { length: 10 }).notNull(),
  tier: varchar("tier", { length: 20 }).notNull(), // budget | premium | luxury
  rooms: jsonb("rooms").$type<string[]>().notNull().default([]),
  addons: jsonb("addons").$type<string[]>().notNull().default([]),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  breakdown: jsonb("breakdown").$type<Record<string, number>>().notNull().default({}),
  status: varchar("status", { length: 30 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Consultation Bookings ----------
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  userId: integer("user_id").references(() => users.id),
  cityId: integer("city_id").references(() => cities.id),
  designerId: integer("designer_id").references(() => users.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  mode: varchar("mode", { length: 20 }).default("in_person"), // in_person | video
  status: varchar("status", { length: 20 }).default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Blog / CMS ----------
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  category: varchar("category", { length: 60 }),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  authorId: integer("author_id").references(() => users.id),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Products (E-commerce lite) ----------
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 220 }).notNull(),
  category: varchar("category", { length: 60 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  description: text("description"),
  stock: integer("stock").default(50),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Wishlist ----------
export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => projects.id),
  productId: integer("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- Analytics events ----------
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 60 }).notNull(),
  path: text("path"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
