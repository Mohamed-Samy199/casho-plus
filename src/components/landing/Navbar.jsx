import { useState } from "react";
import { Link } from "react-router-dom";


const NAV_LINKS = [
  { label: "الرئيسية", href: "#home" },
  { label: "خدماتنا", href: "#services" },
  { label: "عن كاشو بلس", href: "#about" },
  { label: "تواصل معنا", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo.png"
            alt="كاشو بلس"
            className="h-16 w-16 rounded-xl object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            كاشو <span className="text-casho-yellow">بلس</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 rounded-full border border-white/15 bg-white/5 px-8 py-3 backdrop-blur-md md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[15px] font-semibold text-white/85 transition-colors hover:text-casho-yellow"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden shrink-0 rounded-full bg-casho-yellow px-6 py-2.5 text-[15px] font-bold text-casho-blue-dark shadow-[0_4px_18px_rgba(255,210,31,0.3)] transition-transform hover:scale-[1.03] md:inline-block"
        >
          تواصل معنا
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute inset-x-0 top-0 h-[2px] bg-current transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-[2px] bg-current transition-transform ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="mx-5 mt-2 rounded-2xl border border-white/15 bg-casho-blue-dark/90 p-5 backdrop-blur-lg md:hidden">
          <ul className="flex flex-col gap-4 text-center">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-semibold text-white/90"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-5 block rounded-full bg-casho-yellow px-6 py-2.5 text-center text-[15px] font-bold text-casho-blue-dark"
          >
            تواصل معنا
          </a>
        </div>
      )}
    </header>
  );
}