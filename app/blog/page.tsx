import { client, urlFor } from "@/lib/sanity";
import SiteHeader from "@/components/SiteHeader";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 60;

type Category = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
};

type Post = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  category?: {
    title: string;
    slug: {
      current: string;
    };
  };
  author?: {
    name: string;
    slug?: {
      current: string;
    };
  };
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: {
    kategoria?: string;
  };
}) {
  const kategoria = searchParams?.kategoria;

  const categoriesQuery = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug
    }
  `;

  const allPostsQuery = `
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      category->{
        title,
        slug
      },
      author->{
        name,
        slug
      }
    }
  `;

  const postsByCategoryQuery = `
    *[
      _type == "post" &&
      category->slug.current == $categorySlug
    ] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage,
      publishedAt,
      category->{
        title,
        slug
      },
      author->{
        name,
        slug
      }
    }
  `;

  const [categories, posts]: [Category[], Post[]] = await Promise.all([
    client.fetch(categoriesQuery),
    kategoria
      ? client.fetch(postsByCategoryQuery, {
          categorySlug: kategoria,
        })
      : client.fetch(allPostsQuery),
  ]);

  

  return (

    <>
    <SiteHeader />
    <main>
      

      <section className="mx-auto max-w-5xl px-6 py-14">
        {/* Nadpis a kategórie */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-brand-navy">
              Články
            </h1>
          </div>

          {/* Na mobile je možné kategórie posúvať vodorovne */}
          <nav
            aria-label="Kategórie článkov"
            className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max items-center gap-2">
              <Link
                href="/blog"
                aria-current={!kategoria ? "page" : undefined}
                className={
                  !kategoria
                    ? "rounded-full border border-brand-navy bg-brand-navy px-3.5 py-1.5 text-xs font-medium text-white transition"
                    : "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                }
              >
                Všetky
              </Link>

              {categories.map((category) => {
                const isActive =
                  category.slug.current === kategoria;

                return (
                  <Link
                    key={category._id}
                    href={`/blog?kategoria=${category.slug.current}`}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "rounded-full border border-brand-navy bg-brand-navy px-3.5 py-1.5 text-xs font-medium text-white transition"
                        : "rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-blue hover:text-brand-blue"
                    }
                  >
                    {category.title}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Články */}
        {posts.length > 0 ? (
          <div className="space-y-10">
            {posts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col gap-6 border-b border-slate-200 pb-10 md:flex-row"
              >
                {post.coverImage && (
                  <div className="md:w-1/3">
                    <Link href={`/blog/${post.slug.current}`}>
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={urlFor(post.coverImage)
                            .width(700)
                            .height(440)
                            .fit("crop")
                            .auto("format")
                            .url()}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 330px"
                          className="object-cover transition duration-500 hover:scale-[1.02]"
                        />
                      </div>
                    </Link>
                  </div>
                )}

                <div
                  className={
                    post.coverImage ? "md:w-2/3" : "w-full"
                  }
                >
                  {post.category?.title && (
                    <p className="mb-2 text-xs font-medium text-brand-teal">
                      {post.category.title}
                    </p>
                  )}

                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="group block"
                  >
                    <h2 className="font-serif text-2xl leading-snug text-brand-navy transition group-hover:text-brand-blue">
                      {post.title}
                    </h2>
                  </Link>

                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    {post.author?.name && (
                      <span>{post.author.name}</span>
                    )}

                    {post.publishedAt && (
                      <span>
                        {new Date(
                          post.publishedAt,
                        ).toLocaleDateString("sk-SK", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <p className="font-serif text-xl text-brand-navy">
              V tejto kategórii zatiaľ nie sú žiadne články.
            </p>

            <Link
              href="/blog"
              className="mt-4 inline-flex text-sm font-medium text-brand-blue"
            >
              Zobraziť všetky články →
            </Link>
          </div>
        )}
      </section>
    </main>

    <SiteFooter />
  </>
  );
}