export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "france-finances.com",
    url: "https://nicoquipaie.pixeeplay.fr",
    logo: "https://nicoquipaie.pixeeplay.fr/favicon.ico",
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "La Tronçonneuse de Poche",
    url: "https://nicoquipaie.pixeeplay.fr",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    description:
      "Explorez le budget de la France de manière interactive. 370 cartes de dépenses publiques à découvrir.",
    inLanguage: "fr",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
      />
    </>
  );
}
