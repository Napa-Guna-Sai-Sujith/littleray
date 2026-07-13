"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Props = {
  stats: {
    projects: number;
    reviews: number;
    avgRating: string;
    liveCities: number;
    comingSoonCities: number;
  };
  states: {
    name: string;
    status: string;
    launchQuarter: string | null;
    cities: { name: string; status: string }[];
  }[];
  testimonials: {
    customerName: string;
    rating: number;
    quote: string;
    cityName: string;
  }[];
};

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span ref={ref}>{val}</span>;
}

export default function LandingClient({ stats, states, testimonials }: Props) {
  const [phase, setPhase] = useState<"splash" | "content">("splash");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Splash shows for 3s then fades out
    const t1 = setTimeout(() => setPhase("content"), 3200);
    const t2 = setTimeout(() => setFadeIn(true), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // SPLASH SCREEN
  if (phase === "splash") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-900">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-48 w-48 animate-ping rounded-full border border-clay-500/20" style={{ animationDuration: "3s" }} />
          <div className="absolute h-36 w-36 animate-ping rounded-full border border-clay-500/30" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
          <div className="absolute h-24 w-24 animate-ping rounded-full border border-clay-500/40" style={{ animationDuration: "2s", animationDelay: "0.6s" }} />
          <div className="relative grid h-20 w-20 place-items-center rounded-full bg-clay-600 shadow-2xl shadow-clay-500/30 animate-[scaleIn_0.8s_ease-out]">
            <span className="font-display text-4xl text-clay-50">ℓ</span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <h1 className="font-display text-4xl text-clay-50 animate-[slideUp_1s_ease-out_0.5s_both] md:text-5xl">
            Little Ray Interio
          </h1>
        </div>
        <div className="mt-2 overflow-hidden">
          <p className="text-sm uppercase tracking-[0.35em] text-clay-300/70 animate-[slideUp_1s_ease-out_1s_both]">
            Interiors, thoughtfully done
          </p>
        </div>

        {/* Loading bar */}
        <div className="mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-clay-800">
          <div className="h-full w-full animate-[loadBar_2.8s_ease-in-out] rounded-full bg-gradient-to-r from-clay-600 to-clay-400" />
        </div>
        <p className="mt-3 text-xs text-clay-500 animate-[fadeIn_1s_ease-out_1.5s_both]">Preparing your experience…</p>
      </div>
    );
  }

  // MAIN LANDING CONTENT
  return (
    <div className={`transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-clay-900 to-ink-900" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(143,102,54,0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(111,138,103,0.2) 0%, transparent 50%)`
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-clay-500/30 bg-clay-900/50 px-4 py-2 text-xs uppercase tracking-widest text-clay-300 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sage-500" />
            Now live across Telangana
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-display text-5xl leading-[1.05] text-clay-50 md:text-7xl">
            We design homes that
            <br />
            <span className="bg-gradient-to-r from-clay-400 to-sage-500 bg-clip-text text-transparent">feel like yours.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-clay-200/80 md:text-xl">
            End-to-end interior design and execution for South Indian homes. From the first consultation to move-in day — one team, one price, one warranty.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="group rounded-full bg-clay-500 px-8 py-4 text-sm font-medium text-white shadow-lg shadow-clay-500/25 transition hover:bg-clay-400 hover:shadow-clay-400/30">
              Sign in to explore designs
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/login" className="rounded-full border border-clay-500/40 px-8 py-4 text-sm text-clay-200 backdrop-blur transition hover:border-clay-400 hover:text-white">
              Create free account
            </Link>
          </div>

          {/* Live stats counter */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Projects completed", value: stats.projects },
              { label: "Client reviews", value: stats.reviews },
              { label: "Live cities", value: stats.liveCities },
              { label: "Expanding to", value: stats.comingSoonCities },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-clay-700/50 bg-clay-900/40 p-5 backdrop-blur">
                <div className="font-display text-3xl text-clay-50">
                  <AnimatedCounter target={s.value} />
                  {s.label === "Expanding to" ? " cities" : "+"}
                </div>
                <div className="mt-1 text-xs text-clay-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-1 text-clay-500">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ABOUT THE COMPANY */}
      <section className="bg-clay-50 text-ink-900 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-clay-600">Who we are</div>
              <h2 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">
                A small studio with big ambitions.
              </h2>
              <p className="mt-6 text-lg text-ink-700 leading-relaxed">
                Little Ray Interio is a Hyderabad-based interior design studio building beautiful, liveable homes across South India. Founded on the belief that great design should be accessible — not just aspirational.
              </p>
              <p className="mt-4 text-ink-700 leading-relaxed">
                We handle everything end-to-end: consultation, 3D design, factory manufacturing, installation, and post-handover warranty. One team, one bill, zero surprises.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎨", title: "Design studio", desc: "8 interior designers, 2 3D visualisers, Vastu consultant" },
                { icon: "🏭", title: "Own factory", desc: "12,000 sq ft CNC facility in Hyderabad" },
                { icon: "👷", title: "In-house crew", desc: "15 carpenters, 4 engineers — no subcontracting" },
                { icon: "🛡️", title: "10-year warranty", desc: "Written, honoured, on all modular units" },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl border border-clay-200 bg-white p-5">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="mt-2 font-display text-lg text-ink-900">{c.title}</div>
                  <p className="mt-1 text-sm text-ink-600">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-clay-600">How it works</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">Four steps to your dream home.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-600">From first call to final handover in 45 days. Transparent at every stage.</p>
          </div>
          <div className="mt-14 grid gap-0 md:grid-cols-4">
            {[
              { n: "01", icon: "☕", title: "Free consultation", desc: "45 minutes with a senior designer. We listen to your family, lifestyle, budget, and dreams for the space.", color: "from-clay-500 to-clay-600" },
              { n: "02", icon: "🎨", title: "3D design & quote", desc: "Photorealistic 3D renders of every room. Transparent BOQ — no hidden charges. Revise until it feels perfect.", color: "from-sage-500 to-sage-700" },
              { n: "03", icon: "🔨", title: "Manufacture & install", desc: "CNC-cut in our factory, installed by our crew. Weekly photo updates. Single point of contact throughout.", color: "from-clay-600 to-clay-700" },
              { n: "04", icon: "🎉", title: "Move in with warranty", desc: "Snag-free handover, cleaning included. 10-year warranty on all modular work. Check-ins at 60 and 180 days.", color: "from-sage-700 to-ink-700" },
            ].map((step, i) => (
              <div key={step.n} className="relative flex flex-col items-center text-center p-6">
                {i < 3 && <div className="absolute right-0 top-1/3 hidden h-px w-full bg-clay-200 md:block" style={{ width: "50%", right: "-25%" }} />}
                <div className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${step.color} text-2xl text-white shadow-lg`}>
                  {step.icon}
                </div>
                <div className="mt-1 text-xs font-medium text-clay-400">{step.n}</div>
                <div className="mt-2 font-display text-xl text-ink-900">{step.title}</div>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-clay-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-clay-600">What we do</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">Complete interior solutions.</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🏠", t: "Full home interiors", d: "Mood board to move-in. Every room, every detail.", p: "From ₹3.2L" },
              { icon: "🍳", t: "Modular kitchens", d: "Ergonomic layouts, premium hardware, Corian countertops.", p: "From ₹1.45L" },
              { icon: "🚪", t: "Wardrobes & storage", d: "Sliding, hinged, or walk-in. LED interiors, soft-close.", p: "From ₹85K" },
              { icon: "💡", t: "False ceilings & lighting", d: "Cove LEDs, recessed spots, floating panels.", p: "From ₹45K" },
              { icon: "📺", t: "Living & TV units", d: "Fluted panel feature walls, hidden cable management.", p: "From ₹85K" },
              { icon: "🔧", t: "Renovation", d: "Refresh any room without full-home disruption.", p: "Custom quote" },
            ].map((s) => (
              <div key={s.t} className="group rounded-2xl border border-clay-200 bg-white p-6 transition hover:border-clay-400 hover:shadow-lg">
                <span className="text-3xl">{s.icon}</span>
                <div className="mt-3 font-display text-xl text-ink-900">{s.t}</div>
                <p className="mt-2 text-sm text-ink-600">{s.d}</p>
                <div className="mt-4 text-xs font-medium uppercase tracking-widest text-clay-600">{s.p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-clay-600">Client love</div>
            <h2 className="mt-3 font-display text-4xl text-ink-900 md:text-5xl">
              Rated {stats.avgRating}/5 by homeowners.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-600">Every review is from a verified homeowner whose project we completed.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <figure key={i} className="rounded-2xl border border-clay-200 bg-clay-50 p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < t.rating ? "text-amber-400" : "text-clay-200"}>★</span>
                  ))}
                </div>
                <blockquote className="mt-3 text-ink-800 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-clay-200 text-xs font-medium text-clay-700">
                    {t.customerName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">{t.customerName}</div>
                    <div className="text-xs text-ink-500">{t.cityName} · Verified homeowner</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* EXPANSION ROADMAP */}
      <section className="bg-ink-900 py-24 text-clay-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-clay-400">Where we operate</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Growing across South India.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-clay-300/80">
              Live in {stats.liveCities} cities. {stats.comingSoonCities} more coming soon. Every expansion is careful — quality before speed.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {states.map((s) => (
              <div key={s.name} className={`rounded-2xl p-6 ${s.status === "live" ? "border-2 border-sage-500 bg-sage-500/10" : "border border-clay-700 bg-clay-900/50"}`}>
                <div className="flex items-center justify-between">
                  <div className="font-display text-2xl">{s.name}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${s.status === "live" ? "bg-sage-500 text-white" : "bg-clay-600 text-clay-100"}`}>
                    {s.status === "live" ? "Live" : s.launchQuarter ?? "Coming soon"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.cities.map((c) => (
                    <span key={c.name} className={`rounded-full px-3 py-1 text-xs ${c.status === "live" ? "bg-sage-500/20 text-sage-500 border border-sage-500/30" : "bg-clay-800 text-clay-400 border border-clay-700"}`}>
                      {c.status === "live" ? "●" : "○"} {c.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - LOGIN */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-clay-600 to-clay-800" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl text-white md:text-5xl">
            Ready to see what we can do for your home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-clay-100/80 text-lg">
            Sign in to explore our full portfolio, use the interactive price calculator, browse our shop, and book a free consultation.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login" className="rounded-full bg-white px-10 py-4 text-sm font-medium text-clay-700 shadow-xl transition hover:bg-clay-50 hover:shadow-2xl">
              Sign in / Create account →
            </Link>
            <Link href="/consultation" className="rounded-full border border-white/30 px-10 py-4 text-sm text-white transition hover:border-white/60">
              Book free consultation
            </Link>
          </div>
          <p className="mt-6 text-xs text-clay-200/60">
            Free to sign up. No credit card required. Explore everything before you commit.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink-900 border-t border-clay-800 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-600 text-clay-50 font-display text-lg">ℓ</span>
                <span className="font-display text-xl text-clay-50">Little Ray Interio</span>
              </div>
              <p className="mt-3 text-sm text-clay-400">Warm, considered interiors for South Indian homes.</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-clay-500 mb-3">Company</div>
              <ul className="space-y-2 text-sm text-clay-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
                <li><Link href="/consultation" className="hover:text-white transition-colors">Book consultation</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-clay-500 mb-3">Contact</div>
              <ul className="space-y-2 text-sm text-clay-400">
                <li>📞 +91 90000 00000</li>
                <li>✉️ hello@littleray.example</li>
                <li>📍 Hyderabad, Telangana</li>
              </ul>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-clay-500 mb-3">Stats</div>
              <ul className="space-y-2 text-sm text-clay-400">
                <li>{stats.projects} projects completed</li>
                <li>{stats.avgRating}/5 average rating</li>
                <li>{stats.liveCities + stats.comingSoonCities} cities total</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-clay-800 pt-6 text-center text-xs text-clay-600">
            © {new Date().getFullYear()} Little Ray Interio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
