"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  Mic2,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

const links = [
  { href: "/comics", label: "Comics" },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/chat", label: "Live Chat" },
  { href: "/voice", label: "Voice", icon: Mic2 },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-black/20 bg-[#0b0c0e] text-white shadow-[0_4px_24px_rgba(0,0,0,0.14)]">
      <div className="pm-container flex h-[66px] items-center gap-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="promiseme.com home">
          <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#00d564] text-[21px] font-black text-[#06140b] shadow-[0_0_22px_rgba(0,213,100,0.35)] transition-transform group-hover:rotate-[-8deg]">
            P
          </span>
          <span className="hidden text-[21px] font-black tracking-[-0.055em] sm:block">
            promiseme<span className="text-[#00d564]">.com</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-[13px] font-bold transition ${
                isActive(link.href) ? "bg-white/10 text-[#00d564]" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form action="/comics" className="relative ml-auto hidden w-[190px] shrink-0 md:block xl:w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            name="q"
            type="search"
            placeholder="Search comics..."
            aria-label="Search comics"
            className="h-9 w-full rounded-full border border-white/10 bg-white/[0.07] pl-9 pr-3 text-[13px] text-white outline-none transition placeholder:text-gray-500 focus:border-[#00d564] focus:bg-white/10"
          />
        </form>

        <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-[#00d564]/25 bg-[#00d564]/10 px-3 py-1.5 text-[11px] font-bold text-[#72f3a7] md:ml-0 md:flex xl:text-[12px]">
          <Sparkles className="h-3.5 w-3.5" />
          No verification
        </div>

        <Link
          href="/upload"
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#00d564] px-4 py-2 text-[13px] font-black text-[#06140b] transition hover:bg-[#00ef70] sm:inline-flex"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
          Upload
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-white hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="hidden border-t border-white/[0.06] bg-[#0e1012] lg:block">
        <div className="pm-container flex h-8 items-center gap-6 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
          <span className="text-[#00d564]">● Free to read</span>
          <span>High-resolution uploads</span>
          <span>Reddit-style community</span>
          <span>Voice studio</span>
          <span className="ml-auto">No account · No email · No OTP</span>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#111315] px-4 py-4 lg:hidden">
          <form action="/comics" className="relative mb-3 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              name="q"
              type="search"
              placeholder="Search comics..."
              aria-label="Search comics"
              className="h-10 w-full rounded-full border border-white/10 bg-white/[0.07] pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-500"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  isActive(link.href) ? "bg-[#00d564] text-[#06140b]" : "bg-white/5 text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/upload" className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#00d564] px-4 py-3 text-sm font-black text-[#06140b]">
              <Plus className="h-4 w-4" strokeWidth={3} /> Upload your manga
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
