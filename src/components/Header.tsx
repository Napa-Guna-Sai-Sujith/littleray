import Link from "next/link";
import { getAllStatesWithCities } from "@/lib/geo";
import { getSession } from "@/lib/auth";
import { SITE } from "@/lib/site";
import CitiesDropdown from "./CitiesDropdown";
import UserMenu from "./UserMenu";

export default async function Header() {
  const states = await getAllStatesWithCities();
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b border-clay-200/70 bg-clay-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-clay-500 text-clay-50 font-display text-lg">
            ℓ
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg text-ink-900">
              {SITE.name}
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">
              Interiors, thoughtfully done
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-700 lg:flex">
          <Link href="/portfolio" className="hover:text-clay-600 transition-colors">
            Portfolio
          </Link>
          <Link href="/services" className="hover:text-clay-600 transition-colors">
            Services
          </Link>
          <CitiesDropdown states={states} />
          <Link href="/where-we-operate" className="hover:text-clay-600 transition-colors">
            Where we operate
          </Link>
          <Link href="/calculator" className="hover:text-clay-600 transition-colors">
            Price calculator
          </Link>
          <Link href="/shop" className="hover:text-clay-600 transition-colors">
            Shop
          </Link>
          <Link href="/magazine" className="hover:text-clay-600 transition-colors">
            Magazine
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <UserMenu user={session} />
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full border border-clay-300 px-4 py-2 text-sm text-ink-700 hover:bg-clay-100 sm:inline-block transition-colors"
            >
              Log in
            </Link>
          )}
          <Link
            href="/consultation"
            className="rounded-full bg-clay-600 px-4 py-2 text-sm font-medium text-clay-50 shadow-sm hover:bg-clay-700 transition-colors"
          >
            Free consultation
          </Link>
        </div>
      </div>

      {/* Mobile secondary nav */}
      <div className="border-t border-clay-100 lg:hidden">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-2 text-xs text-ink-700">
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/services">Services</Link>
          <Link href="/where-we-operate">Cities</Link>
          <Link href="/calculator">Calculator</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/magazine">Magazine</Link>
        </div>
      </div>
    </header>
  );
}
