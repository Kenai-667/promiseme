import Link from "next/link";
import { ExternalLink, Heart, ShieldCheck } from "lucide-react";
import { getSocialLinks } from "@/lib/data";

export default async function SiteFooter() {
  const socials = await getSocialLinks();

  return (
    <footer className="mt-20 border-t border-[#1c1f23] bg-[#0b0c0e] text-gray-400">
      <div className="pm-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#00d564] text-[21px] font-black text-[#06140b]">P</span>
            <span className="text-[21px] font-black tracking-[-0.055em] text-white">promiseme<span className="text-[#00d564]">.com</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7">
            Your stories, your voice, your community. Read gorgeous vertical comics, publish high-resolution chapters, and talk freely — without an account.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00d564]/30 bg-[#00d564]/10 px-3 py-1.5 text-xs font-bold text-[#72f3a7]">
              <ShieldCheck className="h-3.5 w-3.5" /> Zero verification
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold">
              <Heart className="h-3.5 w-3.5 text-[#00d564]" /> Made for creators
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">Explore</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/comics" className="hover:text-[#00d564]">All comics</Link></li>
            <li><Link href="/rankings" className="hover:text-[#00d564]">Rankings</Link></li>
            <li><Link href="/upload" className="hover:text-[#00d564]">Upload manga</Link></li>
            <li><Link href="/voice" className="hover:text-[#00d564]">Voice Studio</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">Community</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/community" className="hover:text-[#00d564]">Discussions</Link></li>
            <li><Link href="/chat" className="hover:text-[#00d564]">Live chat rooms</Link></li>
            <li><Link href="/about" className="hover:text-[#00d564]">About us</Link></li>
            <li><Link href="/about#owner-tools" className="hover:text-[#00d564]">Owner tools</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-white">Follow the owners</h3>
          <div className="flex flex-wrap gap-2">
            {socials.slice(0, 6).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3 py-2 text-xs font-bold text-gray-200 transition hover:border-[#00d564] hover:text-[#00d564]"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: social.accent }} />
                {social.platform}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5">Owner handles can be added or changed anytime from the About page.</p>
        </div>
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="pm-container flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} promiseme.com · Every story starts with a promise.</span>
          <span>Independent creators welcome · No sign-up required</span>
        </div>
      </div>
    </footer>
  );
}
