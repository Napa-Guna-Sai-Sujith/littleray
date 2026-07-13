import "dotenv/config";
import { db, pool } from "./index";
import {
  states,
  cities,
  users,
  projects,
  testimonials,
  blogPosts,
  products,
  leads,
} from "./schema";
import { hashPassword } from "../lib/auth";
import { sql } from "drizzle-orm";

// Use real Pexels stock photos — each one is a specific, high-quality interior
const P = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200`;
const PSQ = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=650&w=650`;

// Living rooms
const LIVING_1 = P(7148849);
const LIVING_2 = P(7148846);
const LIVING_3 = P(33452539);
const LIVING_4 = P(8142825);
const LIVING_5 = P(33688058);
const LIVING_6 = P(6527029);
const LIVING_7 = P(16985123);
const LIVING_8 = P(8236023);

// Kitchens
const KITCHEN_1 = P(7148841);
const KITCHEN_2 = P(6508341);
const KITCHEN_3 = P(7018836);
const KITCHEN_4 = P(6920446);
const KITCHEN_5 = P(7031211);
const KITCHEN_6 = P(8089079);

// Bedrooms
const BEDROOM_1 = P(7546275);
const BEDROOM_2 = P(7546291);
const BEDROOM_3 = P(17158655);
const BEDROOM_4 = P(7546556);
const BEDROOM_5 = P(36777913);
const BEDROOM_6 = P(8135118);

// Wardrobes/storage
const WARDROBE_1 = P(7587738);
const WARDROBE_2 = P(6580395);
const WARDROBE_3 = P(6670657);

// Full home / mixed
const FULL_1 = P(6238684);
const FULL_2 = P(7005291);
const FULL_3 = P(7195739);
const FULL_4 = P(7148779);

// City hero images
const HYDERABAD_HERO = P(11321242);
const SECUNDERABAD_HERO = P(10983775);

// Products (square crop)
const PROD_CERAMIC = PSQ(18273391);
const PROD_CHAIR = PSQ(11112738);
const PROD_CANDLE = PSQ(14974588);
const PROD_RUG = PSQ(38317548);
const PROD_BRASS = PSQ(774378);
const PROD_TABLE = PSQ(4789849);

async function main() {
  console.log("🌱 Seeding Little Ray Interio…");

  await db.execute(sql`TRUNCATE TABLE
    events, wishlist, products, blog_posts, consultations, quotes, waitlist,
    leads, testimonials, projects, users, cities, states
    RESTART IDENTITY CASCADE`);

  // ---------- States ----------
  const [telangana, ap, karnataka] = await db
    .insert(states)
    .values([
      {
        slug: "telangana",
        name: "Telangana",
        status: "live",
        tagline: "Where it all began. Full-service interiors across 6 cities.",
        priceMultiplier: "1.00",
      },
      {
        slug: "andhra-pradesh",
        name: "Andhra Pradesh",
        status: "coming_soon",
        launchQuarter: "Q3 2026",
        tagline: "Launching Q3 2026 — Vijayawada, Visakhapatnam, Guntur & Tirupati. Join the waitlist for early-bird pricing.",
        priceMultiplier: "0.95",
      },
      {
        slug: "karnataka",
        name: "Karnataka",
        status: "coming_soon",
        launchQuarter: "Q1 2027",
        tagline: "Launching Q1 2027, starting with Bengaluru. Reserved slots open now.",
        priceMultiplier: "1.15",
      },
    ])
    .returning();

  // ---------- Cities ----------
  const cityData = [
    { state: telangana, name: "Hyderabad", slug: "hyderabad", status: "live", mult: "1.10", img: HYDERABAD_HERO, desc: "Our flagship studio. 800+ Hyderabad homes designed since 2019. In-home consultations available 7 days a week." },
    { state: telangana, name: "Warangal", slug: "warangal", status: "live", mult: "0.95", img: LIVING_3, desc: "Dedicated Warangal studio opened 2022. Budget-friendly packages tailored for Warangal's apartment layouts." },
    { state: telangana, name: "Nizamabad", slug: "nizamabad", status: "live", mult: "0.92", img: BEDROOM_3, desc: "Serving Nizamabad with the same premium quality as Hyderabad, at regional pricing." },
    { state: telangana, name: "Karimnagar", slug: "karimnagar", status: "live", mult: "0.92", img: KITCHEN_4, desc: "Full-service interiors for Karimnagar families. From modular kitchens to complete home makeovers." },
    { state: telangana, name: "Secunderabad", slug: "secunderabad", status: "live", mult: "1.08", img: SECUNDERABAD_HERO, desc: "The twin city, same studio. All Secunderabad consultations are handled from our Hyderabad studio." },
    { state: telangana, name: "Khammam", slug: "khammam", status: "live", mult: "0.90", img: LIVING_5, desc: "Our newest Telangana city. Launched in early 2025 with special introductory pricing." },
    { state: ap, name: "Vijayawada", slug: "vijayawada", status: "coming_soon", mult: "1.00", img: FULL_2, desc: "Join the waitlist for Vijayawada and get early-bird pricing when we launch." },
    { state: ap, name: "Visakhapatnam", slug: "visakhapatnam", status: "coming_soon", mult: "1.05", img: LIVING_7, desc: "Vizag is on our roadmap. Sign up to be notified the moment we open." },
    { state: ap, name: "Guntur", slug: "guntur", status: "coming_soon", mult: "0.95", img: KITCHEN_5, desc: "We're planning our Guntur launch. Register now for priority scheduling." },
    { state: ap, name: "Tirupati", slug: "tirupati", status: "coming_soon", mult: "0.98", img: BEDROOM_5, desc: "Tirupati homes will get the Little Ray treatment soon. Join the waitlist." },
    { state: karnataka, name: "Bengaluru", slug: "bengaluru", status: "coming_soon", mult: "1.20", img: FULL_1, desc: "Bengaluru launch in Q1 2027. Our biggest market expansion — studio location scouting underway." },
    { state: karnataka, name: "Mysuru", slug: "mysuru", status: "coming_soon", mult: "1.05", img: LIVING_8, desc: "Mysuru's heritage charm meets modern interiors. Coming soon." },
    { state: karnataka, name: "Mangaluru", slug: "mangaluru", status: "coming_soon", mult: "1.02", img: KITCHEN_3, desc: "Coastal homes, thoughtful design. Mangaluru launch planned for mid-2027." },
    { state: karnataka, name: "Hubli", slug: "hubli", status: "coming_soon", mult: "0.98", img: BEDROOM_4, desc: "Quality interiors for Hubli-Dharwad. Join the waitlist." },
  ];

  const insertedCities = await db
    .insert(cities)
    .values(
      cityData.map((c) => ({
        stateId: c.state.id,
        slug: c.slug,
        name: c.name,
        status: c.status,
        heroImage: c.img,
        description: c.desc,
        priceMultiplier: c.mult,
      })),
    )
    .returning();

  const bySlug = new Map(insertedCities.map((c) => [c.slug, c]));

  // ---------- Users ----------
  const [admin, designer, sales, customer] = await db
    .insert(users)
    .values([
      { email: "admin@littleray.local", name: "Priya Rao", passwordHash: await hashPassword("admin123"), role: "admin", phone: "+919876500001" },
      { email: "designer@littleray.local", name: "Arjun Menon", passwordHash: await hashPassword("designer123"), role: "designer", phone: "+919876500002" },
      { email: "sales@littleray.local", name: "Neha Reddy", passwordHash: await hashPassword("sales123"), role: "sales", phone: "+919876500003" },
      { email: "customer@littleray.local", name: "Rahul Kumar", passwordHash: await hashPassword("customer123"), role: "customer", phone: "+919876500004" },
    ])
    .returning();

  // ---------- Projects (24 projects, real images, varied, detailed) ----------
  const projectDefs = [
    { title: "Warm Earthy 3BHK in Hyderabad", city: "hyderabad", bhk: "3BHK", style: "Contemporary", room: "Full Home", tier: "premium", cover: LIVING_1, before: FULL_3, after: LIVING_1, images: [LIVING_1, KITCHEN_1, BEDROOM_1], featured: true, desc: "A complete 3BHK transformation for a young Hyderabad family. The brief was 'warm but minimal' — we used walnut-toned veneers, brass accents, and off-white soft furnishings to create a home that feels lived-in from day one. The modular kitchen features a Corian island with built-in induction. Delivered in 48 days flat." },
    { title: "Modern Classic 2BHK in Secunderabad", city: "secunderabad", bhk: "2BHK", style: "Modern Classic", room: "Full Home", tier: "premium", cover: LIVING_2, before: FULL_4, after: LIVING_2, images: [LIVING_2, BEDROOM_2, KITCHEN_2], featured: true, desc: "Classic mouldings meet modern convenience. This Secunderabad 2BHK was designed for a retired couple who wanted timeless elegance without the fuss. Soft-close wardrobes, under-bed hydraulic storage, and a fully modular kitchen with ambient LED panels." },
    { title: "Scandinavian 4BHK Villa in Hyderabad", city: "hyderabad", bhk: "4BHK", style: "Minimal Scandinavian", room: "Full Home", tier: "luxury", cover: LIVING_5, before: FULL_2, after: LIVING_5, images: [LIVING_5, BEDROOM_3, WARDROBE_1], featured: true, desc: "A stunning Scandinavian-inspired villa in Jubilee Hills. White oak, matte white surfaces, and curated lighting create a museum-quality calm. Every room has custom millwork designed specifically for the family's needs — from a floor-to-ceiling library wall to a chef-grade kitchen with Häfele fittings." },
    { title: "Cozy Indo-Fusion 2BHK in Warangal", city: "warangal", bhk: "2BHK", style: "Indo-Fusion", room: "Full Home", tier: "budget", cover: LIVING_3, before: BEDROOM_4, after: LIVING_3, images: [LIVING_3, KITCHEN_4, BEDROOM_4], featured: true, desc: "A budget-friendly 2BHK that doesn't look budget at all. We used locally sourced teak frames, handloom upholstery from Pochampally, and terracotta accents to give this Warangal home a distinctly Telangana identity. Total cost: under ₹4L." },
    { title: "Premium Kitchen Makeover in Hyderabad", city: "hyderabad", bhk: "3BHK", style: "Contemporary", room: "Kitchen", tier: "premium", cover: KITCHEN_1, before: KITCHEN_2, after: KITCHEN_1, images: [KITCHEN_1, KITCHEN_3, KITCHEN_6], featured: true, desc: "A Gachibowli kitchen transformed from a dark galley to an open L-shaped layout with a breakfast counter. Hettich tandem drawers, granite countertops, built-in chimney, and warm pendant lighting make this the heart of the home." },
    { title: "Boho Warm Master Bedroom in Karimnagar", city: "karimnagar", bhk: "3BHK", style: "Boho Warm", room: "Master Bedroom", tier: "premium", cover: BEDROOM_6, before: BEDROOM_1, after: BEDROOM_6, images: [BEDROOM_6, WARDROBE_2, LIVING_4], featured: true, desc: "A textured, layered bedroom that feels like a boutique hotel. Cane headboard, linen drapes, warm terracotta wall behind the bed, and a hidden walk-in closet with velvet-lined drawers. Client called it 'the room I never want to leave'." },

    // Non-featured but detailed
    { title: "Minimalist 1BHK in Secunderabad", city: "secunderabad", bhk: "1BHK", style: "Minimal Scandinavian", room: "Full Home", tier: "budget", cover: FULL_1, before: FULL_3, after: FULL_1, images: [FULL_1, KITCHEN_5, BEDROOM_4], featured: false, desc: "A compact 1BHK for a software professional. Every square foot optimized — murphy bed, fold-out dining, floor-to-ceiling storage. Finished in laminate and plywood to keep costs under ₹2.5L." },
    { title: "Contemporary Living Room in Nizamabad", city: "nizamabad", bhk: "3BHK", style: "Contemporary", room: "Living Room", tier: "premium", cover: LIVING_4, before: LIVING_6, after: LIVING_4, images: [LIVING_4, LIVING_6, BEDROOM_5], featured: false, desc: "A living room redesign focused on the TV wall and seating layout. Fluted panel TV unit with hidden cable management, L-shaped sofa in mushroom linen, and a false ceiling with cove lighting." },
    { title: "Modular Kitchen in Khammam", city: "khammam", bhk: "2BHK", style: "Contemporary", room: "Kitchen", tier: "budget", cover: KITCHEN_4, before: KITCHEN_2, after: KITCHEN_4, images: [KITCHEN_4, KITCHEN_6, KITCHEN_5], featured: false, desc: "A U-shaped modular kitchen in marine plywood with laminate finish. Includes corner carousel, bottle pull-out, cutlery tray, and grain storage drawers. Completed in 22 days." },
    { title: "Luxury Kids Room in Hyderabad", city: "hyderabad", bhk: "4BHK", style: "Modern Classic", room: "Kids Room", tier: "luxury", cover: BEDROOM_3, before: BEDROOM_1, after: BEDROOM_3, images: [BEDROOM_3, WARDROBE_3, LIVING_7], featured: false, desc: "A twin kids' room with bunk beds, study alcove, and a reading nook under the window. Pastel palette with pops of teal. All furniture edges rounded for safety." },
    { title: "Walk-in Wardrobe in Hyderabad Villa", city: "hyderabad", bhk: "Villa", style: "Minimal Scandinavian", room: "Master Bedroom", tier: "luxury", cover: WARDROBE_1, before: WARDROBE_2, after: WARDROBE_1, images: [WARDROBE_1, WARDROBE_3, BEDROOM_5], featured: false, desc: "A 120 sq ft walk-in closet with island drawer unit, LED-lit hanging zones, shoe wall, and a full-length mirror alcove. Finished in white lacquer with brushed brass handles." },
    { title: "Modern Classic Dining in Warangal", city: "warangal", bhk: "3BHK", style: "Modern Classic", room: "Living Room", tier: "premium", cover: LIVING_7, before: LIVING_3, after: LIVING_7, images: [LIVING_7, KITCHEN_3, BEDROOM_2], featured: false, desc: "A formal dining space with a 6-seater marble-top table, upholstered chairs, a china cabinet with LED display, and a statement chandelier. Classic proportions, modern comfort." },
    { title: "Budget Full-Home in Karimnagar", city: "karimnagar", bhk: "2BHK", style: "Contemporary", room: "Full Home", tier: "budget", cover: FULL_4, before: FULL_2, after: FULL_4, images: [FULL_4, KITCHEN_2, BEDROOM_4], featured: false, desc: "Proof that ₹3L can go a long way. This Karimnagar 2BHK includes a modular kitchen, TV unit, master wardrobe, shoe rack, and false ceiling in the living room — all in 38 days." },
    { title: "Elegant Master Suite in Hyderabad", city: "hyderabad", bhk: "3BHK", style: "Modern Classic", room: "Master Bedroom", tier: "luxury", cover: BEDROOM_2, before: BEDROOM_4, after: BEDROOM_2, images: [BEDROOM_2, WARDROBE_2, LIVING_8], featured: false, desc: "A master suite with upholstered wall, floating nightstands, automated curtains, and an en-suite dressing area. Premium veneer finishes throughout." },
    { title: "Open-Plan Kitchen-Living in Secunderabad", city: "secunderabad", bhk: "3BHK", style: "Contemporary", room: "Kitchen", tier: "premium", cover: KITCHEN_3, before: KITCHEN_5, after: KITCHEN_3, images: [KITCHEN_3, LIVING_6, KITCHEN_1], featured: false, desc: "Wall between kitchen and living room removed to create an open-plan flow. Island kitchen with bar seating, integrated appliances, and soft pendant lighting." },
    { title: "Boho Warm Living Room in Nizamabad", city: "nizamabad", bhk: "2BHK", style: "Boho Warm", room: "Living Room", tier: "budget", cover: LIVING_8, before: LIVING_4, after: LIVING_8, images: [LIVING_8, BEDROOM_6, KITCHEN_4], featured: false, desc: "Rattan, jute, terracotta, and linen in a compact living room. A daybed by the window, floor cushions, and handwoven rugs make this a truly comfortable home." },
    { title: "Compact Kitchen in Warangal", city: "warangal", bhk: "1BHK", style: "Contemporary", room: "Kitchen", tier: "budget", cover: KITCHEN_6, before: KITCHEN_2, after: KITCHEN_6, images: [KITCHEN_6, KITCHEN_5, FULL_3], featured: false, desc: "A parallel kitchen for a small apartment. Maximized storage with overhead cabinets reaching the ceiling. Budget finish with high-pressure laminate." },
    { title: "Designer TV Wall in Khammam", city: "khammam", bhk: "3BHK", style: "Contemporary", room: "Living Room", tier: "premium", cover: LIVING_6, before: LIVING_4, after: LIVING_6, images: [LIVING_6, LIVING_7, BEDROOM_3], featured: false, desc: "A statement TV wall with back-lit fluted panels, floating shelf, and hidden cable management. The wall alone transformed the room's entire personality." },
    { title: "Luxury 4BHK in Hyderabad", city: "hyderabad", bhk: "4BHK", style: "Modern Classic", room: "Full Home", tier: "luxury", cover: LIVING_7, before: FULL_2, after: LIVING_7, images: [LIVING_7, KITCHEN_3, BEDROOM_2, WARDROBE_1], featured: false, desc: "Our most premium project to date. Italian marble flooring, imported hardware, automated lighting, and custom furniture throughout. 4 bedrooms, 2 living areas, a home theatre, and a chef's kitchen." },
    { title: "Guest Bedroom in Karimnagar", city: "karimnagar", bhk: "3BHK", style: "Indo-Fusion", room: "Master Bedroom", tier: "budget", cover: BEDROOM_5, before: BEDROOM_1, after: BEDROOM_5, images: [BEDROOM_5, BEDROOM_4, LIVING_3], featured: false, desc: "A warm guest bedroom with Pochampally fabric headboard, brass reading lamps, and a compact wardrobe with mirror. Simple, inviting, done in 14 days." },
    { title: "Study & Home Office in Secunderabad", city: "secunderabad", bhk: "3BHK", style: "Minimal Scandinavian", room: "Full Home", tier: "premium", cover: FULL_2, before: FULL_1, after: FULL_2, images: [FULL_2, FULL_3, BEDROOM_3], featured: false, desc: "A dedicated home office carved out of a spare bedroom. Built-in desk with cable grommets, pegboard wall, overhead bookshelves, and acoustic paneling for video calls." },
    { title: "Pooja Room in Hyderabad", city: "hyderabad", bhk: "3BHK", style: "Indo-Fusion", room: "Full Home", tier: "premium", cover: LIVING_4, before: LIVING_6, after: LIVING_4, images: [LIVING_4, KITCHEN_1, BEDROOM_6], featured: false, desc: "A carved teak pooja unit with bell-metal accessories, LED backlighting, and a marble-top drawer for puja supplies. Designed per Vastu guidelines." },
    { title: "False Ceiling Design in Warangal", city: "warangal", bhk: "2BHK", style: "Contemporary", room: "Living Room", tier: "budget", cover: BEDROOM_1, before: FULL_3, after: BEDROOM_1, images: [BEDROOM_1, LIVING_3, KITCHEN_4], featured: false, desc: "A layered false ceiling with cove lighting and recessed spots. Added 10 cm of perceived height to a low-ceiling apartment. Completed in 6 days." },
    { title: "Island Kitchen in Nizamabad", city: "nizamabad", bhk: "3BHK", style: "Contemporary", room: "Kitchen", tier: "luxury", cover: KITCHEN_5, before: KITCHEN_2, after: KITCHEN_5, images: [KITCHEN_5, KITCHEN_1, LIVING_5], featured: false, desc: "An island kitchen with quartz countertop, wine rack, and a dedicated baking station. Top-of-the-line Häfele and Blum fittings throughout." },
  ];

  const insertedProjects = await db
    .insert(projects)
    .values(
      projectDefs.map((p, i) => ({
        slug: `${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
        title: p.title,
        cityId: bySlug.get(p.city)!.id,
        bhk: p.bhk,
        style: p.style,
        roomType: p.room,
        budgetTier: p.tier,
        coverImage: p.cover,
        beforeImage: p.before,
        afterImage: p.after,
        images: p.images,
        description: p.desc,
        tags: [p.style, p.bhk, p.room, bySlug.get(p.city)!.name],
        featured: p.featured,
      })),
    )
    .returning();

  // ---------- Testimonials (17, varied ratings, city-tagged) ----------
  const testimonialData = [
    { name: "Ananya Iyer", city: "hyderabad", rating: 5, quote: "The team turned our 3BHK into the calm haven we dreamt of. Handover was on the day promised — 48 days, not a day more.", pi: 0 },
    { name: "Vikram & Sunitha Shetty", city: "hyderabad", rating: 5, quote: "We compared three vendors. Little Ray was 20% cheaper and the only one that came with a written 10-year warranty. The kitchen is outstanding.", pi: 4 },
    { name: "Suma Reddy", city: "secunderabad", rating: 4, quote: "Our designer listened — that sounds basic, but it's rare. The modular kitchen exceeded expectations. One minor delay on the wardrobe, but they made it right.", pi: 1 },
    { name: "Karthik Naidu", city: "warangal", rating: 5, quote: "Warangal doesn't usually get this quality of service. Every material was explained, every choice was ours. Felt truly premium.", pi: 3 },
    { name: "Divya Rao", city: "nizamabad", rating: 5, quote: "10-year warranty sealed it for us. Eight months in, everything is as good as day one. Zero touch-ups needed.", pi: 7 },
    { name: "Ramesh Prasad", city: "karimnagar", rating: 5, quote: "From tiles to switch plates — everything was walked through with us before ordering. The hand-held experience was exactly what we needed for our first home.", pi: 5 },
    { name: "Meena Krishnan", city: "khammam", rating: 4, quote: "They designed around our family's daily habits, not around a template. The pooja room placement was perfect per Vastu.", pi: 8 },
    { name: "Aditya Sharma", city: "hyderabad", rating: 5, quote: "Best decision was choosing Little Ray over the two bigger brands we considered. Better craft, better communication, and honestly, better design.", pi: 0 },
    { name: "Nisha Verma", city: "hyderabad", rating: 5, quote: "The false ceiling detailing is museum-quality. Every guest asks who did our interiors. We proudly recommend Little Ray every time.", pi: 9 },
    { name: "Praveen Kumar", city: "secunderabad", rating: 5, quote: "Site engineer was on WhatsApp any time we had a question. Weekly photo updates, no surprises on the bill. This is how construction should work.", pi: 14 },
    { name: "Lakshmi Devi", city: "warangal", rating: 5, quote: "They accommodated our pooja room dimensions perfectly — a small thing that mattered a lot to us as a family.", pi: 11 },
    { name: "Rohit Gadde", city: "hyderabad", rating: 4, quote: "The modular wardrobe design saved us so much floor space. Walk-in closet feels like a luxury hotel. Minor delay on hardware delivery, but end result is perfect.", pi: 10 },
    { name: "Sneha Patel", city: "nizamabad", rating: 5, quote: "Clean handover, no touch-ups needed later. The attention to finishing is rare in this price segment. Highly recommend.", pi: 23 },
    { name: "Manoj & Kavita Rao", city: "karimnagar", rating: 5, quote: "The lighting layout completely transformed our living room mood. Evening ambiance is restaurant-quality now. We couldn't be happier.", pi: 12 },
    { name: "Kavya Reddy", city: "khammam", rating: 5, quote: "Kitchen work is my highlight — Corian countertops with integrated sink, tandem drawers, and a breakfast counter. Exactly what I pinned on Pinterest.", pi: 17 },
    { name: "Arun Bhat", city: "hyderabad", rating: 5, quote: "Our 4BHK villa came in under budget. Never expected that in this industry. The design quality rivals anything you'd see from the big Mumbai firms.", pi: 18 },
    { name: "Shreya Deshmukh", city: "secunderabad", rating: 4, quote: "Warm neutral palette, thoughtful storage in every corner, and a master bedroom that feels like a retreat. Worth every rupee.", pi: 20 },
  ];

  await db.insert(testimonials).values(
    testimonialData.map((t) => ({
      customerName: t.name,
      cityId: bySlug.get(t.city)!.id,
      rating: t.rating,
      quote: t.quote,
      projectId: insertedProjects[t.pi % insertedProjects.length].id,
      verified: true,
    })),
  );

  // ---------- Blog posts (12, real content) ----------
  const blogData = [
    {
      title: "5 warm neutral palettes that work in every South Indian home",
      category: "Palettes",
      excerpt: "From Hyderabadi to coastal — five colour systems that age beautifully in our climate and light.",
      content: `# 5 Warm Neutral Palettes That Work in Every South Indian Home\n\nSouth Indian light is generous, golden, and intense. It exposes cheap finishes and rewards honest materials. Here are five palette families we return to, project after project.\n\n## 1. Walnut & Ivory\nDark walnut veneers on joinery, ivory walls, brass accents. The palette that never dates. Works best in east- or north-facing rooms where direct sun is limited.\n\n## 2. Terracotta & Linen\nOxide-washed terracotta walls or tiles paired with natural linen upholstery. Perfect for Telangana's red-soil landscapes — it connects the inside to the outside.\n\n## 3. Sage & Stone\nA cooler palette for homes that get western sun. Sage green joinery, greige walls, and brushed nickel hardware. Feels Scandinavian but at home in Hyderabad.\n\n## 4. Ochre & Teak\nBold but liveable. Ochre feature walls anchor a room while teak furniture warms the whole space. Great for living rooms and dining areas.\n\n## 5. Chalk & Charcoal\nHigh contrast, modern, editorial. White walls, charcoal joinery, black steel frames. Reserve this for clients who are meticulous about maintenance — white shows everything.\n\n## The bottom line\nEvery palette here can be adapted to budget, premium, or luxury finishes. The difference is in the materials, not the colours. That's the Little Ray approach.`,
      cover: LIVING_1,
    },
    {
      title: "Modular vs. carpenter-built kitchens: an honest 2026 comparison",
      category: "Kitchens",
      excerpt: "We've done both. Here's when modular wins, when it doesn't, and what most brands won't tell you.",
      content: `# Modular vs. Carpenter-Built Kitchens\n\nEvery second client asks this. Here's our honest take after 1,200+ kitchens.\n\n## Modular wins when:\n- You want soft-close drawers, tandem pull-outs, and precise hardware.\n- You're in a standard-sized apartment.\n- You value warranty — our modular kitchens carry a 10-year guarantee on carcass and hinges.\n- Timeline matters — factory modules install in 3–5 days vs. 15–20 for carpentry.\n\n## Carpentry wins when:\n- Your kitchen has irregular angles, beams, or non-standard heights.\n- You want solid wood doors (not MDF or plywood).\n- Ultra-tight budgets — a basic carpenter kitchen can come in 30% cheaper.\n\n## The hybrid approach\nWe often do a hybrid: modular base units with tandem drawers for ergonomics, and carpenter-built uppers and tall units for flexibility. It's 15% cheaper than full modular and handles awkward corners gracefully.\n\n## What most brands won't say\nCheap modular kitchens (under ₹80K) use particleboard carcasses that swell in India's humidity. Insist on marine plywood or BWR plywood for carcasses — it costs more upfront but lasts a decade longer.`,
      cover: KITCHEN_1,
    },
    {
      title: "How to plan a pooja room that doesn't feel dated",
      category: "Cultural Design",
      excerpt: "Vastu-compliant, beautiful, and modern — yes, all three are possible.",
      content: `# Planning a Pooja Room That Doesn't Feel Dated\n\nPooja rooms are deeply personal. Our approach: respect the spiritual intent, skip the temple kitsch.\n\n## Vastu basics that matter\n- North-east corner of the home is ideal.\n- Face east or north while praying.\n- Don't place the pooja room under a staircase or attached to a bathroom wall.\n\n## Design principles\n1. **Use natural materials.** Teak, marble, bell metal. They age with grace.\n2. **Back-lighting over top-lighting.** LED strips behind the deity shelf create a soft halo without glare.\n3. **Hide the mechanics.** A small drawer for camphor, wicks, and match boxes keeps the space clean.\n4. **Keep it compact.** A 3×3 ft wall-mounted unit is usually enough.\n5. **Ventilation.** Incense and camphor need somewhere to go. A small exhaust vent or a window is essential.\n\n## Our signature detail\nA brass bell mounted inside the door frame. When you open the pooja room, the bell chimes. A tiny thing that clients love.`,
      cover: LIVING_4,
    },
    {
      title: "The 45-day interior timeline: what actually happens each week",
      category: "Process",
      excerpt: "Week-by-week breakdown of a typical Little Ray project, from sign-off to handover.",
      content: `# The 45-Day Interior Timeline\n\nTransparency is our brand. Here's exactly what happens in a typical 2–3 BHK project.\n\n## Week 1–2: Design finalisation\n- 3D renders approved, material samples signed off, detailed BOQ (bill of quantities) locked.\n- Factory order placed on Day 8.\n\n## Week 3: Site prep\n- Civil work: false ceiling framework, electrical re-routing, plumbing modifications.\n- Painting primer coat.\n\n## Week 4–5: Installation phase 1\n- Modular kitchen modules delivered and installed.\n- Wardrobes and storage units assembled.\n- False ceiling finished and cove LEDs wired.\n\n## Week 6: Installation phase 2\n- TV unit, shoe rack, study table, and smaller joinery.\n- Final paint coat.\n- Electrical fixtures and hardware fitting.\n\n## Week 6.5: Quality check\n- Internal QC by our site engineer.\n- Punch list shared with client on WhatsApp.\n\n## Day 45: Handover\n- Walk-through with client.\n- Warranty cards and maintenance guide handed over.\n- Post-handover check-in at Day 60 and Day 180.`,
      cover: FULL_2,
    },
    {
      title: "False ceiling designs that don't shrink the room",
      category: "Ceilings",
      excerpt: "6 designer-approved ceiling profiles for Indian apartments with 9–10 ft slab heights.",
      content: `# False Ceiling Designs That Don't Shrink the Room\n\nMost Indian apartments have 9–10 ft slab-to-slab heights. After a 6-inch false ceiling, you're at 8.5–9 ft. Here's how to keep the room feeling tall.\n\n## 1. Peripheral cove only\nDrop the ceiling by 6 inches only around the perimeter. The centre stays at full height, and cove LEDs create an illusion of lift.\n\n## 2. Recessed centre\nThe opposite approach — a recessed panel in the centre with concealed lighting pushes the eye upward.\n\n## 3. Single-plane with recessed spots\nNo level change at all. A flat gypsum board at 6 inches below slab with recessed LED downlights. Clean, modern, and zero visual clutter.\n\n## 4. Wooden beam accents\nFaux wooden beams (actually WPC or PVC-wrapped MDF) in a parallel or grid pattern. Adds warmth without reducing perceived height.\n\n## 5. Floating panels\nA rectangular panel 'floated' in the centre with a shadow gap around it. Works beautifully over dining tables.\n\n## 6. Minimal coffered\nA coffered pattern in the living room only, with warm 3000K LEDs in each recess. Luxury without excess.\n\n## What to avoid\n- Multiple level drops (3+ levels) — looks heavy and dated.\n- POP (plaster of Paris) in humid cities — gypsum boards are more stable.\n- Cool white LEDs (5000K+) — always go warm (2700K–3000K) for living spaces.`,
      cover: BEDROOM_1,
    },
    {
      title: "Small home, smart storage: 12 details we love in compact apartments",
      category: "Small Spaces",
      excerpt: "Practical storage ideas that make 600–800 sq ft apartments feel twice their size.",
      content: `# Small Home, Smart Storage\n\nOur most-requested brief: "Make it feel bigger." Here are 12 storage details we keep coming back to.\n\n## Living room\n1. **TV unit with storage behind fluted panels.** Hides router, cables, and board games.\n2. **Window seat with under-seat drawers.** Doubles as seating and linen storage.\n3. **Floating shelves with concealed brackets.** Keeps walls light.\n\n## Kitchen\n4. **Corner carousel.** Utilises 100% of a dead corner.\n5. **Vertical pull-out near the stove.** For oils, spices, and frequently used bottles.\n6. **Overhead cabinets to the ceiling.** The top shelf stores rarely-used appliances.\n\n## Bedroom\n7. **Hydraulic bed with under-mattress storage.** 30+ sq ft of hidden storage.\n8. **Loft shutters above wardrobes.** For suitcases and seasonal blankets.\n9. **Nightstand with built-in drawer and charging slot.**\n\n## Entryway\n10. **Shoe rack with mirror door.** Two functions, one unit.\n11. **Wall-mounted key holder with shelf.** For wallets, sunglasses, masks.\n12. **Coat hooks behind the door.** Invisible when door is open.`,
      cover: FULL_1,
    },
    {
      title: "Why we design bedrooms around morning light in Hyderabad",
      category: "Bedrooms",
      excerpt: "The science and sentiment behind orientating a bed to the sunrise.",
      content: `# Why We Design Bedrooms Around Morning Light\n\nHyderabad faces east to the sunrise. We use that.\n\n## The science\nMorning light (6–8 AM) is rich in blue wavelengths that signal your body to stop melatonin production. Waking to natural light improves sleep quality, mood, and energy.\n\n## The design implications\n1. **Bed placement.** Headboard on the west or south wall so morning light hits the foot of the bed first — gentle, not jarring.\n2. **Window treatment.** Sheer + blackout layers. Sheers filter morning light to a soft glow; blackout curtains for weekend sleep-ins.\n3. **Wall colour.** East-facing walls catch direct sun — use cooler tones (sage, dove grey) to balance the warmth. West-facing walls can handle warmer hues.\n4. **Mirror placement.** A mirror on the wall opposite the window doubles the morning light without a second window.\n\n## The sentiment\nA room that wakes you with light feels fundamentally different from one that wakes you with an alarm. That's the kind of detail that makes a house feel like home.`,
      cover: BEDROOM_3,
    },
    {
      title: "Vastu-friendly floor plans without heavy compromises",
      category: "Cultural Design",
      excerpt: "8 Vastu principles we honour and 3 myths we politely set aside.",
      content: `# Vastu-Friendly Floor Plans\n\nMany clients want Vastu compliance. We respect that — but we also push back on myths that would compromise good design.\n\n## 8 principles we honour\n1. Main entrance facing north or east where possible.\n2. Kitchen in the south-east.\n3. Master bedroom in the south-west.\n4. Pooja room in the north-east.\n5. No toilets directly above the kitchen.\n6. Open space in the north-east quadrant (balcony, window).\n7. Staircase in the south or west.\n8. Living room in the north or east.\n\n## 3 myths we set aside\n1. **No bedroom in the south-east.** Myth. South-east bedrooms work fine with proper ventilation.\n2. **Main door must be taller than interior doors.** Aesthetically awkward and structurally unnecessary.\n3. **Spiral staircases are inauspicious.** There's no Vastu text that says this. We've installed several beautiful spirals.`,
      cover: FULL_3,
    },
    {
      title: "Kids' rooms that outlast the toddler years",
      category: "Kids",
      excerpt: "Design a room at age 3 that still works at age 13. It's about structure, not theme.",
      content: `# Kids' Rooms That Outlast the Toddler Years\n\n## The mistake everyone makes\nTheming. Dinosaurs at 3, space at 6, "can we redo it" at 9. Themes are expensive to outgrow.\n\n## Our approach\n1. **Neutral bones, changeable accents.** White or wood furniture. Add personality through bedsheets, wall art, and cushions — things that cost ₹2K to change, not ₹2L.\n2. **A desk from day one.** Even toddlers use a desk (for art, Play-Doh). Size it for a 10-year-old. Use an adjustable chair.\n3. **Bunk bed with a lower reading nook.** Younger kids use the lower bunk for play. Older kids use it for reading. The upper bunk is always the bed.\n4. **Soft-close everything.** Small fingers get caught in hardware.\n5. **Rounded edges.** Non-negotiable until age 7.\n6. **Display shelves.** Let the child curate their own shelf. Trophies, art, Lego, books — it's their room.`,
      cover: BEDROOM_5,
    },
    {
      title: "Choosing between veneer, laminate, and acrylic shutters",
      category: "Materials",
      excerpt: "A no-jargon guide to kitchen and wardrobe shutter finishes — cost, durability, and aesthetics.",
      content: `# Veneer vs. Laminate vs. Acrylic Shutters\n\n## Laminate (HPL / LPL)\n- **Cost:** ₹ — most affordable.\n- **Durability:** Excellent scratch and moisture resistance.\n- **Look:** Solid colours, wood-print, or textured. Can look 'plasticky' in some lights.\n- **Best for:** Budget and premium kitchens. Wardrobes in humid rooms.\n\n## Veneer\n- **Cost:** ₹₹ — mid-range.\n- **Durability:** Good, but needs periodic polishing. Susceptible to moisture damage if unsealed.\n- **Look:** Real wood grain — no two doors are identical.\n- **Best for:** Living room joinery, TV units, pooja units. Premium and luxury tiers.\n\n## Acrylic\n- **Cost:** ₹₹₹ — premium.\n- **Durability:** Excellent. Scratch-resistant, UV-stable, wipes clean.\n- **Look:** High-gloss, mirror-like finish. Fingerprint magnet.\n- **Best for:** Modern and minimal kitchens. Luxury wardrobes.\n\n## Our recommendation\nMix finishes. Acrylic on kitchen base units (easy to wipe at counter height), laminate on uppers (lighter, cheaper). Veneer in the living room where you want warmth.`,
      cover: WARDROBE_2,
    },
    {
      title: "10 furnishings under ₹15,000 that anchor a living room",
      category: "Furnishings",
      excerpt: "Budget picks from our shop that designers actually use in real projects.",
      content: `# 10 Furnishings Under ₹15,000\n\nYou don't need a ₹50K rug to finish a room. Here are real products from our catalogue that we use in client homes.\n\n1. **Terracotta Handwoven Rug 6×9** — ₹12,500. Grounds any seating area.\n2. **Mango Wood Coffee Table** — ₹14,900. Solid wood, rounded edges, aged brass legs.\n3. **Rattan Pendant Light (Uma)** — ₹6,200. Instant warmth over a dining table.\n4. **Cane-back Dining Chair** — ₹5,900 each. Mid-century meets South Indian craft.\n5. **Ochre Cotton Throw** — ₹2,450. Drape over a sofa to add colour.\n6. **Ceramic Vase (Warangal series)** — ₹1,800. Local artist collaboration.\n7. **Kalamkari Wall Hanging** — ₹3,800. The single easiest way to add personality.\n8. **Woven Jute Pouffe** — ₹4,200. Extra seating that doubles as a footrest.\n9. **Brass Table Lamp (Sitara)** — ₹3,450. Warm reading light.\n10. **Ikat Runner 14×72** — ₹1,650. Down a hallway or across a console.\n\nAll available in our shop — ships across Telangana in 3–5 days.`,
      cover: LIVING_8,
    },
    {
      title: "Behind the scenes: our Warangal 3BHK reveal",
      category: "Projects",
      excerpt: "Full photo tour and cost breakdown of a recent ₹4.2L Warangal project.",
      content: `# Behind the Scenes: Warangal 3BHK\n\nClient brief: "Indo-Fusion, not too loud, under ₹4.5L."\n\n## Scope\n- Living room: TV unit + sofa back panel + false ceiling.\n- Kitchen: L-shaped modular, laminate finish, Hettich hardware.\n- Master bedroom: Wardrobe + bed back panel + side tables.\n- Pooja room: Compact teak unit.\n\n## Timeline\n- Design: 10 days.\n- Manufacturing: 14 days.\n- Installation: 12 days.\n- Total: 36 days (ahead of schedule).\n\n## Cost breakdown\n| Item | Amount |\n|---|---|\n| Kitchen | ₹1,35,000 |\n| Wardrobes | ₹85,000 |\n| Living room joinery | ₹75,000 |\n| False ceiling + lighting | ₹42,000 |\n| Pooja unit | ₹28,000 |\n| Painting + civil | ₹35,000 |\n| **Total** | **₹4,00,000** |\n\nFinal cost was ₹4.0L — ₹50K under the ₹4.5L budget. The client added a shoe rack and entry console with the savings.`,
      cover: LIVING_3,
    },
  ];

  await db.insert(blogPosts).values(
    blogData.map((b) => ({
      slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.cover,
      category: b.category,
      tags: [b.category, "design", "south india"],
      authorId: designer.id,
      published: true,
    })),
  );

  // ---------- Products (24, with specific product images) ----------
  const productData = [
    { name: "Terracotta Handwoven Rug 6×9", cat: "Rugs & Runners", price: 12500, img: PROD_RUG, desc: "Hand-loomed terracotta rug in durable cotton-jute blend. 6×9 ft. Ideal under a living room seating area. Made by artisan weavers in Warangal." },
    { name: "Teak Bookshelf — Four Shelf", cat: "Storage", price: 18900, img: P(7195739), desc: "Solid teak four-shelf bookcase with tapered legs. Height: 160 cm. Width: 90 cm. Oil-finished. Ships assembled." },
    { name: "Brass Table Lamp — Sitara", cat: "Lighting", price: 3450, img: PROD_CANDLE, desc: "Handcrafted brass lamp with cotton shade. Height: 42 cm. E27 bulb socket. Warm ambient light for bedside or study." },
    { name: "Linen Cushion Cover Set (4 pcs)", cat: "Soft Furnishings", price: 2200, img: PSQ(8135118), desc: "Set of 4 pure linen cushion covers in oatmeal, sage, clay, and ivory. 45×45 cm. Zip closure. Machine washable." },
    { name: "Mango Wood Coffee Table", cat: "Tables", price: 14900, img: PROD_TABLE, desc: "Solid mango wood with aged brass hairpin legs. 100×55×40 cm. Natural grain variation makes each piece unique." },
    { name: "Cane-back Dining Chair", cat: "Seating", price: 5900, img: PROD_CHAIR, desc: "Mid-century inspired dining chair with natural cane back and teak frame. Seat height: 46 cm. Max load: 120 kg." },
    { name: "Ceramic Vase — Warangal Series", cat: "Decor", price: 1800, img: PROD_CERAMIC, desc: "Handmade ceramic vase by Warangal potter Ramaiah. Height: 24 cm. Terracotta glaze with white lip. Each piece is one-of-a-kind." },
    { name: "Sabai Grass Basket Set (3 sizes)", cat: "Storage", price: 1450, img: PSQ(4789849), desc: "Three nesting baskets in handwoven sabai grass. Great for blankets, toys, or laundry. Sizes: 30/25/20 cm diameter." },
    { name: "Kalamkari Wall Hanging", cat: "Wall Art", price: 3800, img: PSQ(38317548), desc: "Authentic Machilipatnam Kalamkari on cotton. Natural dyes, hand-painted. 60×90 cm. Ready to hang." },
    { name: "Ochre Cotton Throw", cat: "Soft Furnishings", price: 2450, img: PSQ(36777913), desc: "Hand-loomed ochre cotton throw with fringe detail. 130×180 cm. Perfect draped over a sofa or at the foot of a bed." },
    { name: "Rattan Pendant Light — Uma", cat: "Lighting", price: 6200, img: P(6238684), desc: "Hand-woven rattan pendant lamp. Diameter: 40 cm. Creates beautiful light patterns on ceiling and walls. E27 socket." },
    { name: "Terracotta Planter — Large", cat: "Decor", price: 950, img: PROD_BRASS, desc: "Wheel-thrown terracotta planter with saucer. 30 cm diameter. Unglazed exterior. Ideal for indoor plants." },
    { name: "Ikat Runner 14×72", cat: "Rugs & Runners", price: 1650, img: PSQ(7148779), desc: "Pochampally ikat runner in indigo and white. 36×183 cm. Handwoven cotton. Perfect for console tables or hallways." },
    { name: "Sheesham Console Table", cat: "Tables", price: 22400, img: P(6527029), desc: "Solid sheesham (Indian rosewood) console table with iron frame. 120×35×80 cm. Natural oil finish." },
    { name: "Handloom Curtain Panel (single)", cat: "Soft Furnishings", price: 3200, img: P(7546275), desc: "Single handloom cotton curtain panel in natural ivory. 140×270 cm. Rod pocket + back tabs. Light-filtering." },
    { name: "Marble Coasters — Set of 6", cat: "Decor", price: 1250, img: PROD_CERAMIC, desc: "White marble coasters with cork backing. 10 cm diameter. Comes in a recycled cardboard gift box." },
    { name: "Brass Diya Stand — Triple", cat: "Decor", price: 1890, img: PROD_BRASS, desc: "Three-tier brass diya stand for pooja room or festive display. Height: 22 cm. Hand-polished bell metal." },
    { name: "Woven Jute Pouffe", cat: "Seating", price: 4200, img: PSQ(11112733), desc: "Braided jute pouffe with cotton filling. 50 cm diameter, 35 cm height. Extra seating that doubles as a footrest." },
    { name: "Wall Mirror — Teak Frame", cat: "Wall Art", price: 5800, img: P(7587738), desc: "Round mirror in solid teak frame. 60 cm diameter. Reclaimed plantation teak. Metal hanging bracket included." },
    { name: "Ceramic Dinner Set — 16 Piece", cat: "Kitchenware", price: 8900, img: PROD_CERAMIC, desc: "Stoneware dinner set: 4 dinner plates, 4 side plates, 4 bowls, 4 mugs. Speckled cream glaze. Microwave and dishwasher safe." },
    { name: "Cotton Bedsheet Set — Queen", cat: "Soft Furnishings", price: 3450, img: PSQ(7546556), desc: "300-thread-count cotton sateen bedsheet set: 1 flat sheet, 1 fitted sheet, 2 pillowcases. Queen size. Block-printed paisley." },
    { name: "Bamboo Floor Lamp — Nira", cat: "Lighting", price: 7200, img: P(33688058), desc: "Bent bamboo floor lamp with linen shade. Height: 150 cm. E27 socket. Weighted metal base." },
    { name: "Macramé Plant Hanger", cat: "Decor", price: 850, img: PSQ(11112738), desc: "Hand-knotted cotton macramé plant hanger. Length: 90 cm. Holds pots up to 15 cm diameter." },
    { name: "Copper Bottle — Hammered", cat: "Kitchenware", price: 1450, img: PROD_BRASS, desc: "Pure copper water bottle, hand-hammered finish. 1 litre capacity. Ayurvedic tradition meets modern design." },
  ];

  await db.insert(products).values(
    productData.map((p) => ({
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: p.name,
      category: p.cat,
      price: String(p.price),
      originalPrice: p.price > 5000 ? String(Math.round(p.price * 1.2)) : null,
      image: p.img,
      description: p.desc,
      stock: 10 + Math.floor(Math.random() * 30),
    })),
  );

  // ---------- Sample leads for admin demo ----------
  const sampleLeads = [
    { name: "Aparna Sinha", email: "aparna@example.com", phone: "+919812340001", cityKey: "hyderabad", status: "new", bhk: "3BHK", budget: "8-12L", msg: "Just bought a flat in Gachibowli. Looking for full-home interiors." },
    { name: "Ravi Teja M.", email: "ravi@example.com", phone: "+919812340002", cityKey: "secunderabad", status: "contacted", bhk: "2BHK", budget: "4-6L", msg: "Interested in kitchen + wardrobes only. Existing furniture in living room." },
    { name: "Sunita & Ramesh Devi", email: "sunita@example.com", phone: "+919812340003", cityKey: "warangal", status: "site_visit", bhk: "3BHK", budget: "5-8L", msg: "New apartment in Warangal. Want budget-friendly full home." },
    { name: "Krishna Prasad", email: "krishna@example.com", phone: "+919812340004", cityKey: "hyderabad", status: "quoted", bhk: "4BHK", budget: "15-20L", msg: "Villa in Jubilee Hills. Premium/luxury tier. Need 3D renders before deciding." },
    { name: "Meera Iyer", email: "meera@example.com", phone: "+919812340005", cityKey: "nizamabad", status: "booked", bhk: "2BHK", budget: "3-5L", msg: "Ready to start. Deposit paid. Waiting for design kick-off." },
    { name: "Deepak Sharma", email: "deepak@example.com", phone: "+919812340006", cityKey: "karimnagar", status: "in_progress", bhk: "3BHK", budget: "6-8L", msg: "Week 4 — kitchen installed, wardrobes in progress." },
    { name: "Chandni Rao", email: "chandni@example.com", phone: "+919812340007", cityKey: "khammam", status: "delivered", bhk: "2BHK", budget: "3-4L", msg: "Handed over last week. Very happy. Left a 5-star review." },
    { name: "Pradeep Reddy", email: "pradeep@example.com", phone: "+919812340008", cityKey: "hyderabad", status: "new", bhk: "3BHK", budget: "10-15L", msg: "Referred by Vikram Shetty. Looking for contemporary style." },
    { name: "Swathi K.", email: "swathi@example.com", phone: "+919812340009", cityKey: "secunderabad", status: "contacted", bhk: "1BHK", budget: "2-3L", msg: "Small apartment, first home. Need everything from scratch." },
    { name: "Naveen Kumar", email: "naveen@example.com", phone: "+919812340010", cityKey: "hyderabad", status: "site_visit", bhk: "Villa", budget: "25L+", msg: "5BHK villa near ORR. Wants luxury tier with imported materials." },
  ];

  await db.insert(leads).values(
    sampleLeads.map((l) => {
      const c = bySlug.get(l.cityKey)!;
      return {
        name: l.name,
        email: l.email,
        phone: l.phone,
        cityId: c.id,
        stateId: c.stateId,
        message: l.msg,
        bhk: l.bhk,
        propertyType: "Apartment",
        budget: l.budget,
        status: l.status,
      };
    }),
  );

  console.log("✅ Seed complete — 3 states, 14 cities, 24 projects, 17 testimonials, 12 blog posts, 24 products, 10 leads.");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
