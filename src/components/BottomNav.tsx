"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Jouer", href: "/play", icon: "🎮" },
  { label: "Profil", href: "/profile", icon: "👤" },
  { label: "Rang", href: "#", icon: "🏆" },
  { label: "Infos", href: "#", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on game/swipe and results pages
  if (pathname.startsWith("/play/") || pathname === "/results") {
    return null;
  }

  return (
    <nav className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t border-border px-4 pt-2 pb-8 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`text-[28px] ${!isActive ? "opacity-70" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
