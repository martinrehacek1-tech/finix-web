import { client, queries } from "@/lib/sanity";
import ServiceIcon from "@/components/ServiceIcon";
import { PortableText, type PortableTextComponents,} from "@portabletext/react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import NajpoistenieCalculator from "@/components/NajpoistenieCalculator";
import SiteFooter from "@/components/SiteFooter";

const portableTextComponents: PortableTextComponents = {
  block: {
  normal: ({ children }) => (
    <p className="mb-5 leading-7 text-slate-700">
      {children}
    </p>
  ),

  h1: ({ children }) => (
    <h1 className="mb-5 mt-12 font-serif text-3xl leading-tight text-brand-navy first:mt-0">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 font-serif text-2xl leading-tight text-brand-navy first:mt-0">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-serif text-xl leading-snug text-brand-navy">
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="mb-3 mt-7 text-lg font-semibold leading-snug text-brand-navy">
      {children}
    </h4>
  ),

  h5: ({ children }) => (
    <h5 className="mb-2 mt-6 text-base font-semibold text-brand-navy">
      {children}
    </h5>
  ),

  h6: ({ children }) => (
    <h6 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-brand-navy">
      {children}
    </h6>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-brand-teal pl-5 italic leading-7 text-slate-600">
      {children}
    </blockquote>
  ),
},

  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-5 list-disc space-y-2 text-slate-700 marker:text-brand-teal">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="mb-6 ml-5 list-decimal space-y-2 text-slate-700 marker:font-semibold marker:text-brand-navy">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 leading-7">{children}</li>
    ),

    number: ({ children }) => (
      <li className="pl-1 leading-7">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),

    link: ({ value, children }) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");

      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-brand-blue underline decoration-brand-blue/30 underline-offset-4 transition hover:decoration-brand-blue"
        >
          {children}
        </a>
      );
    },
  },
};


export const revalidate = 60;

const NAJPOISTENIE_CALCULATORS: Record<
  string,
  {
    calculatorPath: string;
    title: string;
    description: string;
    hash?: string;
  }
> = {
  "najlacnejsie-pzp": {
    calculatorPath: "pzp",
    hash: "pzp",
    title: "Vypočítajte si cenu PZP",
    description:
      "Porovnajte ponuky poisťovní a vyberte si PZP, ktoré vám najviac vyhovuje.",
  },

  "cestovne-poistenie": {
    calculatorPath: "cestovne-poistenie",
    title: "Vypočítajte si cestovné poistenie",
    description:
      "Porovnajte cestovné poistenie podľa destinácie, dĺžky pobytu a účelu vašej cesty.",
  },

  "havarijne-poistenie": {
    calculatorPath: "havarijne-poistenie",
    title: "Vypočítajte si havarijné poistenie",
    description:
      "Porovnajte ponuky havarijného poistenia pre vaše vozidlo na jednom mieste.",
  },

  "poistenie-majetku": {
    calculatorPath: "poistenie-domu-bytu-domacnosti",
    title: "Vypočítajte si poistenie majetku",
    description:
      "Porovnajte poistenie domu, bytu a domácnosti od dostupných poisťovní.",
  },

  "poistenie-zodpovednosti": {
    calculatorPath: "poistenie-zodpovednosti-zamestnanca-za-skodu",
    title: "Vypočítajte si poistenie zodpovednosti",
    description:
      "Porovnajte poistenie zodpovednosti za škodu spôsobenú pri výkone povolania.",
  },

  "poistenie-podnikatelov": {
    calculatorPath: "poistenie-podnikatelov",
    title: "Vypočítajte si poistenie podnikateľov",
    description:
      "Poistenie firemného majetku, prevádzky a zodpovednosti pre podnikateľov.",
  },
};

export async function generateStaticParams() {
  const services = await client.fetch(queries.services);
  return services.map((s: any) => ({ slug: s.slug.current }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await client.fetch(queries.serviceBySlug, { slug });

  if (!service) return notFound();
  
  const calculator = NAJPOISTENIE_CALCULATORS[slug];

  return (
    <main>
      <SiteHeader />


     <section className="border-b border-slate-100 bg-slate-50/70">
  <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-12 text-center sm:py-14">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10">
      <ServiceIcon
        name={service.icon}
        className="h-6 w-6 text-brand-blue"
      />
    </div>

    <h1 className="mt-4 font-serif text-3xl leading-tight text-brand-navy sm:text-4xl">
      {service.title}
    </h1>

    {service.shortDescription && (
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        {service.shortDescription}
      </p>
    )}
  </div>
</section>

  {service.content && (
  <section className="mx-auto max-w-3xl px-6 pb-14">
    <PortableText
      value={service.content}
      components={portableTextComponents}
    />
  </section>
)}

{calculator && (
  <NajpoistenieCalculator
    calculatorPath={calculator.calculatorPath}
    title={calculator.title}
    description={calculator.description}
    hash={calculator.hash}
  />
)}

  
</main>

      <SiteFooter />
    </>
  );
}