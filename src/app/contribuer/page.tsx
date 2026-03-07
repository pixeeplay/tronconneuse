import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { NavbarLanding } from "@/components/landing/NavbarLanding";

export const metadata: Metadata = {
  title: "Contribuer — france-finances.com",
  description:
    "Proposez des cartes de dépenses publiques pour Budget Swipe. Guide du contributeur, format JSON, règles éditoriales.",
  alternates: { canonical: "/contribuer" },
  openGraph: {
    title: "Contribuer — france-finances.com",
    description:
      "Proposez des cartes de dépenses publiques pour Budget Swipe. Open source, ouvert à tous.",
    url: "https://france-finances.com/contribuer",
  },
};

const sources = [
  "vie-publique.fr, PLF/PLFSS (budget.gouv.fr)",
  "Sénat, Assemblée nationale, Cour des comptes",
  "INSEE, DREES, DARES",
  "Sites des collectivités (budgets primitifs)",
  "Opérateurs publics (ADEME, CNAF, CNAM…)",
  "Presse de référence (Le Monde, Les Échos…)",
];

const checklist = [
  "Le JSON est valide et respecte le schéma",
  "L'ID est unique et suit la convention de nommage",
  "Le titre est compréhensible en 5 secondes",
  "Le montant est vérifié dans au moins 1 source officielle",
  "Le coût par citoyen est correct (montant / population)",
  "Le contexte est factuel, neutre, 2-4 phrases",
  "L'équivalence est concrète et mémorable",
  "Au moins 1 source officielle avec URL valide",
  "Pas de doublon avec une carte existante",
  "Données à jour (2024-2026)",
];

const cardExample = `{
  "id": "san-11",
  "category": "Santé & Hôpital",
  "categoryEmoji": "🏥",
  "categoryId": "sante",
  "title": "Télémédecine et numérique en santé",
  "amountLabel": "~2 Md€ / an",
  "amountValue": 2000000000,
  "perCitizenLabel": "~29€ / Français / an",
  "perCitizenValue": 29,
  "context": "Le Ségur du numérique investit 2 Md€…",
  "equivalence": "2 Md€ investis mais 60% des hôpitaux…",
  "sources": [
    { "label": "ANS", "url": "https://esante.gouv.fr" }
  ],
  "locale": "national",
  "year": 2026
}`;

export default function ContribuerPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <NavbarLanding />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Contribuer au projet
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
          Budget Swipe est open source. Tout le monde peut proposer des cartes
          ou des decks complets de dépenses publiques.
        </p>

        {/* Ce qu'on cherche */}
        <Section title="Ce qu'on cherche">
          <ul className="space-y-2">
            {[
              "Des cartes factuelles et sourcées sur les finances publiques françaises",
              "Des decks régionaux (chaque région mérite son deck de 20 cartes)",
              "Des decks villes (Paris existe, Lyon, Marseille, Toulouse, Bordeaux à créer)",
              "Des decks thématiques sur un sujet précis",
              "Des mises à jour quand les chiffres changent (PLF/PLFSS)",
              "Des corrections si une donnée est erronée ou périmée",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-landing-primary mt-0.5 shrink-0">&#9679;</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Règles éditoriales */}
        <Section title="Règles éditoriales">
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-900">Factuel, pas militant.</strong>{" "}
              La carte présente les faits et les deux côtés du débat.
            </p>
            <p>
              <strong className="text-slate-900">Concret, pas abstrait.</strong>{" "}
              Toujours ramener au coût par habitant et à une équivalence parlante.
            </p>
            <p>
              <strong className="text-slate-900">Compréhensible en 5 secondes.</strong>{" "}
              Le titre et le montant doivent suffire à comprendre.
            </p>
            <p>
              <strong className="text-slate-900">Sourcé, toujours.</strong>{" "}
              Pas de &laquo;&nbsp;on estime que&nbsp;&raquo; sans dire qui estime.
            </p>
          </div>
        </Section>

        {/* Sources acceptées */}
        <Section title="Sources acceptées">
          <ol className="space-y-2 list-decimal list-inside">
            {sources.map((s) => (
              <li key={s} className="text-sm text-slate-600">{s}</li>
            ))}
          </ol>
          <p className="text-sm text-slate-500 mt-3 italic">
            Sources refusées : blogs personnels, forums, réseaux sociaux, sites militants sans données sourcées.
          </p>
        </Section>

        {/* Format d'une carte */}
        <Section title="Format JSON d'une carte">
          <pre className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 overflow-x-auto leading-relaxed">
            {cardExample}
          </pre>
          <p className="text-sm text-slate-500 mt-3">
            Le guide complet détaille tous les champs (obligatoires et optionnels),
            les conventions de nommage des IDs, le format des decks, et le schéma JSON de validation.
          </p>
        </Section>

        {/* Checklist */}
        <Section title="Checklist de validation">
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-slate-400 shrink-0">&#9744;</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Comment soumettre */}
        <Section title="Comment soumettre">
          <div className="space-y-4">
            <SubmitOption
              step="1"
              title="Pull Request (contributeurs tech)"
              description="Fork le repo, créez vos cartes en JSON, ouvrez une PR."
            />
            <SubmitOption
              step="2"
              title="Issue GitHub (contributeurs non-tech)"
              description="Ouvrez une Issue avec le template « Proposition de carte(s) ». Un mainteneur mettra en forme le JSON."
            />
            <SubmitOption
              step="3"
              title="Nous contacter directement"
              description="Envoyez-nous votre proposition via le formulaire de contact."
            />
          </div>
        </Section>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href="/CONTRIBUER.md"
            download
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-landing-primary text-white font-semibold text-sm hover:bg-landing-primary-light transition-colors"
          >
            <DownloadIcon />
            Télécharger le guide complet
          </a>
          <a
            href="https://pixeeplay.fr/?intent=contribuer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Nous contacter
            <span>&#8594;</span>
          </a>
        </div>

        {/* Licence */}
        <p className="mt-10 text-xs text-slate-400">
          Les cartes contribuées sont publiées sous licence Creative Commons BY-SA 4.0.
          En soumettant une carte, vous acceptez cette licence.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-landing-primary hover:underline"
          >
            &larr; Retour à l&apos;accueil
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-slate-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function SubmitOption({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-landing-primary/10 text-landing-primary flex items-center justify-center text-sm font-bold shrink-0">
        {step}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
