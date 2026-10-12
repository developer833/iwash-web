import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { HeaderFrame } from "@/components/site/HeaderFrame";
import { MobileNav } from "@/components/site/MobileNav";

export function Header() {
  return (
    <HeaderFrame>
      <div className="relative mx-auto flex h-full max-w-[1680px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center" aria-label={`${site.name} home`}>
          <Image
            src={site.logo.src}
            alt={site.name}
            width={site.logo.width}
            height={site.logo.height}
            preload
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9 text-sm font-medium">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-brand)] hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <StoreBadges compact className="hidden md:flex" />
          <MobileNav />
        </div>
      </div>
    </HeaderFrame>
  );
}
