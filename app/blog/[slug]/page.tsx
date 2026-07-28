import { client, queries, urlFor } from "@/lib/sanity";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import SiteHeader from "@/components/SiteHeader";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";


export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await client.fetch(queries.recentPosts);

  return posts.map((post: any) => ({
    slug: post.slug.current,
  }));
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-8 text-slate-700">{children}</p>
    ),

    h2: ({ children }) => (
      <h2 className="mt-14 mb-5 font-serif text-2xl text-brand-navy md:text-3xl">
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-serif text-xl text-brand-navy md:text-2xl">
        {children}
      </h3>
    ),

    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-brand-teal pl-6 italic text-slate-600">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc space-y-2 pl-6 text-slate-700">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 text-slate-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },

  marks: {
    link: ({ children, value }) => {
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

    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-10">
          <Image
  src={urlFor(value)
    .width(1400)
    .fit("max")
    .auto("format")
    .url()}
  alt={value.alt || ""}
  width={1400}
  height={848}
  sizes="(max-width: 768px) 100vw, 768px"
  className="h-auto w-full rounded-2xl"
/>

          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-slate-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    table: ({ value }) => {
      const rows: string[][] = (value.rawData || "")
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((line: string) =>
          line.includes("\t")
            ? line.split("\t")
            : line.split("|").map((cell: string) => cell.trim())
        );

      if (rows.length === 0) return null;

      return (
        <div className="my-10 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    value.hasHeaderRow && rowIndex === 0
                      ? "bg-brand-navy text-white"
                      : "border-b border-slate-200 last:border-b-0"
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-left align-top"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },

    callout: ({ value }) => {
      const colorMap: Record<string, string> = {
        green:
          "border-brand-teal bg-brand-teal/10 text-slate-700",
        blue:
          "border-brand-blue bg-brand-blue/10 text-slate-700",
        yellow:
          "border-amber-400 bg-amber-50 text-slate-700",
      };

      const classes = colorMap[value.color] || colorMap.green;

      return (
        <aside
          className={`my-8 rounded-xl border-l-4 px-5 py-5 ${classes}`}
        >
          {value.heading && (
            <p className="mb-2 font-bold text-brand-navy">
              {value.heading}
            </p>
          )}

          {value.text && (
            <p className="m-0 text-sm leading-7">{value.text}</p>
          )}
        </aside>
      );
    },
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch(queries.postBySlug, { slug });

  if (!post) {
    return notFound();
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
  <>
    <SiteHeader />
    <main className="min-h-screen bg-white">
      

      <article className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        {/* Hlavička článku */}
        <header className="mx-auto mb-10 max-w-3xl">
          {post.category?.title && (
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-brand-teal">
              {post.category.title}
            </p>
          )}

          <h1 className="mb-5 font-serif text-3xl leading-tight tracking-tight text-brand-navy md:text-5xl md:leading-[1.1]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-7 text-lg leading-8 text-slate-600 md:text-xl">
              {post.excerpt}
            </p>
          )}

          {(post.author?.name || formattedDate) && (
            <div className="flex items-center gap-3">
              {post.author?.photo && (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
                  <Image
                    src={urlFor(post.author.photo)
                      .width(120)
                      .height(120)
                      .url()}
                    alt={post.author.name || "Autor článku"}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="text-sm">
                {post.author?.name && post.author?.slug?.current && (
                  <Link
                    href={`/tim/${post.author.slug.current}`}
                    className="font-medium text-slate-900 transition hover:text-brand-blue"
                  >
                    {post.author.name}
                  </Link>
                )}

                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {formattedDate && <span>{formattedDate}</span>}

                  {formattedDate && post.readingTime && (
                    <span aria-hidden="true">·</span>
                  )}

                  {post.readingTime && (
                    <span>{post.readingTime} min čítania</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hlavný obrázok */}
        {post.coverImage && (
          <div className="relative mb-12 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={urlFor(post.coverImage)
                .width(1600)
                .auto("format")
                .url()}
              alt={post.coverImage.alt || post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        )}

        {/* Obsah článku */}
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-slate max-w-none md:prose-lg prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-blue">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        </div>

        {/* Autor pod článkom */}
        {post.author?.name && post.author?.slug?.current && (
          <section className="mx-auto mt-16 max-w-3xl border-t border-slate-200 pt-8">
            <div className="flex flex-col gap-5 rounded-2xl bg-slate-50 p-6 sm:flex-row sm:items-center">
              {post.author.photo && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white">
                  <Image
                    src={urlFor(post.author.photo)
                      .width(200)
                      .height(200)
                      .url()}
                    alt={post.author.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-teal">
                  Autor článku
                </p>

                <h2 className="font-serif text-xl text-brand-navy">
                  {post.author.name}
                </h2>

                {post.author.shortBio && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.author.shortBio}
                  </p>
                )}
              </div>

              <Link
                href={`/tim/${post.author.slug.current}`}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-brand-blue px-4 py-2 text-sm font-medium text-brand-blue transition hover:bg-brand-blue hover:text-white"
              >
                Profil poradcu
              </Link>
            </div>
          </section>
        )}
      </article>

      
     
   </main>

      <SiteFooter />
    </>

  );
}