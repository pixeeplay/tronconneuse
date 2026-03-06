import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialit\u00e9 — La Tronçonneuse de Poche",
  description: "Politique de confidentialit\u00e9 et protection des donn\u00e9es personnelles.",
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
