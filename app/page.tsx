import { client, queries, urlFor } from "@/lib/sanity";
import TeamCarousel from "@/components/TeamCarousel";
import TestimonialSlider from "@/components/TestimonialSlider";
import ServiceIcon from "@/components/ServiceIcon";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingAdvisorBadge from "@/components/FloatingAdvisorBadge";
import SiteFooter from "@/components/SiteFooter";
import HomeExperience from "@/components/home/HomeExperience";
import { cookies } from "next/headers";


export const revalidate = 60;

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasReferral = Boolean(
    cookieStore.get("finix_advisor_slug")?.value,
  );

  const [settings, team, services, posts, testimonials] = await Promise.all([
    client.fetch(queries.siteSettings),
    client.fetch(queries.teamMembers),
    client.fetch(queries.services),
    client.fetch(queries.recentPosts),
    client.fetch(queries.testimonials),
  ]);

  return (
    <HomeExperience hasReferral={hasReferral}>
      <main>
      <SiteHeader />

      <section className="relative mx-auto grid max-w-6xl items-start gap-8 overflow-hidden px-6 py-14 md:grid-cols-2">
        {/* Mobilné pozadie */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block md:hidden"
          style={{
            backgroundImage: "url('/logo_main.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 200%",
            backgroundSize: "150% auto",
            WebkitMaskImage:
              "linear-gradient(180deg, black 0%, black 35%, transparent 80%)",
            maskImage:
              "linear-gradient(180deg, black 0%, black 35%, transparent 80%)",
            opacity: 0.07,
          }}
        />

        {/* Desktopové pozadie */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage: "url('/logo_main.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "100% center",
            backgroundSize: "auto 280%",
            WebkitMaskImage:
              "linear-gradient(100deg, transparent 0%, transparent 40%, black 75%, black 100%)",
            maskImage:
              "linear-gradient(100deg, transparent 0%, transparent 40%, black 75%, black 100%)",
            opacity: 0.16,
          }}
        />

        {/* Plávajúci poradca */}
        <div className="absolute right-4 top-3 z-30 sm:right-6 sm:top-4">
          <FloatingAdvisorBadge />
        </div>

        {/* Obsah hero */}
        {/* Obsah hero - text (ľavý stĺpec) */}
        <div className="relative z-10 pt-20 md:pt-0">
          <h1 className="mb-0.5 font-serif text-4xl leading-tight text-brand-navy">
            {settings?.heroHeadline || "Vaše financie v jasných číslach."}
          </h1>

          <p className="mb-8 max-w-sm text-slate-600">
            {settings?.heroSubtext ||
              "Hypotéky, poistenie a investície bez skrytých háčikov. Tam, kde iný končí, my začíname."}
          </p>
        </div>

        {/* CTA - pravý stĺpec, pritlačené k spodnému okraju hero sekcie */}
        <div className="relative z-10 md:self-end md:justify-self-end">
          <div className="inline-flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-5">
            <p className="text-sm font-medium text-slate-700">
              Máte záujem o bezplatnú konzultáciu?
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-brand-blue px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-blue/90"
            >
              Dohodnúť stretnutie
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 border-y border-slate-100 bg-white px-4 py-7 shadow-[0_-4px_12px_rgba(15,23,42,0.02),0_10px_26px_rgba(15,23,42,0.07)] sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-start gap-x-4 gap-y-6 text-center sm:grid-cols-3 md:grid-cols-5 md:gap-4">
          <div className="col-span-1 md:border-r md:border-slate-100">
            <p className="font-serif text-xl font-medium tracking-tight text-brand-navy sm:text-2xl">
              {settings?.statClients ?? "1 339"}
            </p>
            <p className="mt-1 px-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              spokojných klientov
            </p>
          </div>

          <div className="col-span-1 md:border-r md:border-slate-100">
            <p className="font-serif text-xl font-medium tracking-tight text-brand-navy sm:text-2xl">
              {settings?.statFirstHomes ?? "400+"}
            </p>
            <p className="mt-1 px-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              prvé bývanie
            </p>
          </div>

          <div className="col-span-1 md:border-r md:border-slate-100">
            <p className="font-serif text-xl font-medium tracking-tight text-brand-navy sm:text-2xl">
              {settings?.statMortgageVolume ?? "500M"}
            </p>
            <p className="mt-1 px-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              sprostredkovaný objem hypoték
            </p>
          </div>

          <div className="col-span-1 md:border-r md:border-slate-100">
            <p className="font-serif text-xl font-medium tracking-tight text-brand-teal sm:text-2xl">
              {settings?.statSavedEur
                ? `${(settings.statSavedEur / 1_000_000).toFixed(1)}M €`
                : "46,3M"}
            </p>
            <p className="mt-1 px-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              ušetrené na úrokoch
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="font-serif text-xl font-medium tracking-tight text-brand-navy sm:text-2xl">
              {settings?.statInvestedVolume ?? "10M"}
            </p>
            <p className="mt-1 px-1 text-[11px] leading-tight text-slate-500 sm:text-xs">
              investovaných € v správe
            </p>
          </div>
        </div>
      </section>

     <section id="sluzby" className="px-6 py-12 max-w-6xl mx-auto">
  <h2 className="font-serif text-lg text-brand-navy mb-4 text-center">
    Vyberte si oblasť, ktorá vás zaujíma
  </h2>

  <div className="flex flex-wrap justify-center gap-4">
    {services.map((s: any) => (
      <Link
        key={s._id}
        href={`/sluzby/${s.slug.current}`}
        className="group w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(15%-0.5rem)] flex flex-col items-center justify-center text-center gap-1 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm hover:border-brand-blue/30 hover:shadow-lg transition-[border-color,box-shadow] duration-300"
      >
        <span className="w-12 h-12 rounded-full bg-brand-teal/10 group-hover:bg-brand-blue/10 flex items-center justify-center transition-colors duration-300">
  <ServiceIcon
    name={s.icon}
    className="w-6 h-6 text-brand-blue group-hover:text-brand-teal transition-colors duration-300"
  />
</span>

        <p className="text-sm font-bold text-slate-900">
          {s.title}
        </p>

        {s.shortDescription && (
          <p className="text-xs text-slate-500 line-clamp-2">
            {s.shortDescription}
          </p>
        )}
      </Link>
    ))}
  </div>
</section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="font-serif text-lg text-brand-navy mb-1 text-center">Naši odborníci</h2>
        <TeamCarousel members={team} />
      </section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
  <TestimonialSlider testimonials={testimonials} />
</section>


<section className="mx-auto max-w-6xl px-6 py-14">
  <div className="mb-6 flex items-center justify-between gap-4">
    <h2 className="font-serif text-2xl text-brand-navy">
      Mohlo by vás zaujímať
    </h2>

    <Link
      href="/blog"
      className="text-sm font-medium text-brand-blue transition hover:opacity-70"
    >
      Všetky články →
    </Link>
  </div>

  <div className="grid gap-5 md:grid-cols-3">
    {posts.slice(0, 3).map((post: any) => (
      <Link
        key={post._id}
        href={`/blog/${post.slug.current}`}
        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
      >
        {post.coverImage && (
          <div className="relative h-32 w-full overflow-hidden bg-slate-100">
            <Image
              src={urlFor(post.coverImage)
                .width(700)
                .height(320)
                .fit("crop")
                .auto("format")
                .url()}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="p-5">
          {post.category?.title && (
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-teal">
              {post.category.title}
            </p>
          )}

          <h3 className="line-clamp-2 min-h-[44px] text-sm font-semibold leading-5 text-brand-navy">
            {post.title}
          </h3>

          <span className="mt-4 inline-flex text-xs font-medium text-brand-blue">
            Čítať článok →
          </span>
        </div>
      </Link>
    ))}
  </div>
</section>      

        <SiteFooter />
      </main>
    </HomeExperience>
  );
}