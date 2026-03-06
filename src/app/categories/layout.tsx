import { NavbarLanding } from "@/components/landing/NavbarLanding";
import { Footer } from "@/components/landing/Footer";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <NavbarLanding />
      <div className="pt-16">{children}</div>
      <Footer />
    </div>
  );
}
