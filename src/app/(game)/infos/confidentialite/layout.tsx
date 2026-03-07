import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — La Tronçonneuse de Poche",
  description: "Politique de confidentialité et protection des données personnelles.",
  alternates: {
    canonical: "/infos/confidentialite",
  },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
