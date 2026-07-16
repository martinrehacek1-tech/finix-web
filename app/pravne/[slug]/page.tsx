import { notFound } from "next/navigation";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { Cookie } from "lucide-react";

import { client, queries } from "@/lib/sanity";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-sm leading-7 text-slate-700 sm:text-base">
        {children}
      </p>
    ),

    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-serif text-2xl leading-tight text-brand-navy first:mt-0">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mb-3 mt-7 font-serif text-xl leading-snug text-brand-navy">
        {children}
      </h3>
    ),

    h4: ({ children }) => (
      <h4 className="mb-3 mt-6 text-base font-semibold text-brand-navy">
        {children}
      </h4>
    ),

    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-4 border-brand-teal pl-5 italic leading-7 text-slate-600">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-5 list-disc space-y-2 text-sm text-slate-700 marker:text-brand-teal sm:text-base">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="mb-6 ml-5 list-decimal space-y-2 text-sm text-slate-700 marker:font-semibold marker:text-brand-navy sm:text-base">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 leading-7">
        {children}
      </li>
    ),

    number: ({ children }) => (
      <li className="pl-1 leading-7">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em className="italic">
        {children}
      </em>
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

export async function generateStaticParams() {
  const pages = await client.fetch<
    Array<{ slug: string }>
  >(
    `*[
      _type == "legalPage" &&
      active != false &&
      defined(slug.current)
    ]{
      "slug": slug.current
    }`,
  );

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await client.fetch(
    queries.legalPageBySlug,
    { slug },
  );

  if (!page) {
    notFound();
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-white">
        {/* HERO PRÁVNEJ STRÁNKY */}
        <section className="border-b border-slate-100 bg-slate-50/70">
          <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-12 text-center sm:py-14">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/10">
              <Cookie
                aria-hidden="true"
                className="h-6 w-6 text-brand-blue"
              />
            </div>

            <h1 className="mt-4 font-serif text-3xl leading-tight text-brand-navy sm:text-4xl">
              {page.title}
            </h1>

            {page.intro && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {page.intro}
              </p>
            )}
          </div>
        </section>

        {/* OBSAH */}
        <section className="mx-auto max-w-3xl px-6 py-12 sm:py-14">
          {page.content && (
            <PortableText
              value={page.content}
              components={portableTextComponents}
            />
          )}

          {page.updatedAt && (
            <div className="mt-12 border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-500">
                Posledná aktualizácia:{" "}
                {new Date(page.updatedAt).toLocaleDateString(
                  "sk-SK",
                )}
              </p>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}