import { createClient } from "next-sanity";
import { notFound } from "next/navigation";
import imageUrlBuilder from "@sanity/image-url";
import TestimonialSlider from "@/components/TestimonialSlider";
import SiteHeader from "@/components/SiteHeader";
import ArticlesCarousel from "@/components/ArticlesCarousel";
import { MapPin } from "lucide-react";

const client = createClient({
  projectId: "y5p16js7",
  dataset: "production",
  apiVersion: "2026-07-11",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export const revalidate = 60;
async function getClenTima(slug: string) {
  const query = `*[_type == "teamMember" && slug.current == $slug][0]{
    _id,
    titleBefore,
    name,
    titleAfter,
    position,
    specialization,
    specializationOther,
    serviceArea,
    photo,
    bio,
    nbsLicense,
    phone,
    email,
    active,
    "testimonials": *[_type == "testimonial" && advisor._ref == ^._id] | order(_createdAt desc){
      _id,
      clientName,
      clientRole,
      clientPhoto,
      quote
    },
    "posts": *[_type == "post" && author._ref == ^._id] | order(publishedAt desc){
      _id,
      title,
      slug,
      coverImage,
      category->{ title }
    }
  }`;

  return await client.fetch(query, { slug });
}

export default async function ClenTimaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clen = await getClenTima(slug);

  if (!clen || clen.active === false) {
    notFound();
  }

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* HLAVNÁ KARTA PORADCU */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row md:items-stretch">
            
            {/* Vizuálna časť - Fotografia bez prechodov a čiar */}
            <div className="w-full md:w-1/3 bg-white relative min-h-[350px] sm:min-h-[400px] md:min-h-full overflow-hidden">
              {clen.photo ? (
                <img
                  src={urlFor(clen.photo).width(450).height(550).fit("crop").url()}
                  alt={clen.name}
                  className="object-cover w-full h-full absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium py-12">
                  Bez fotografie
                </div>
              )}
            </div>

            {/* Informačná časť - Texty, Kontakty, NBS a BIO na jednom mieste */}
            <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-between bg-white relative z-10">
              <div>
                <span className="font-serif text-xs font-bold text-brand-blue tracking-wider uppercase mb-2 block">
                  {clen.position}
                </span>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                  {clen.titleBefore && `${clen.titleBefore} `}
                  {clen.name}
                  {clen.titleAfter && `, ${clen.titleAfter}`}
                </h1>

                {/* Štítky špecializácie */}
                {Array.isArray(clen.specialization) && clen.specialization.length > 0 && (
  <div className="mt-4 flex flex-wrap gap-2">
    {clen.specialization
      .filter((spec: string) => spec !== "Iné")
      .map((spec: string) => (
        <span
          key={spec}
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800"
        >
          {spec}
        </span>
      ))}

    {clen.specialization.includes("Iné") &&
      clen.specializationOther && (
        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800">
          {clen.specializationOther}
        </span>
      )}
  </div>
)}

{/* Vložené BIO (O mne) priamo do voľného priestoru karty */}
                {clen.bio && (
  <div className="mt-8 border-t border-gray-100 pt-6 text-xs leading-relaxed text-gray-700 whitespace-pre-line sm:text-sm">
    {clen.bio}
<div className="mt-6 border-t border-slate-200 pt-6">
</div>

  </div>
)}



                {/* Blok kontaktov rozšírený o jednotne formátované NBS informácie */}
                <div className="mt-8 space-y-3 text-sm text-gray-600">

                  {clen.phone && (
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 w-16">Tel.:</span>
                      <a href={`tel:${clen.phone}`} className="hover:text-brand-blue transition font-medium">
                        {clen.phone}
                      </a>
                    </div>
                  )}

                  {clen.email && (
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 w-16">Email:</span>
                      <a href={`mailto:${clen.email}`} className="hover:text-brand-blue transition font-medium">
                        {clen.email}
                      </a>
                    </div>
                  )}

                  {/* NBS a SFA integrované priamo pod kontakty v rovnakom formáte */}
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 w-16">SFA:</span>
                    <span className="font-medium">Finportal, a.s.</span>
                  </div>

                  {clen.nbsLicense && (
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 w-16">NBS:</span>
                      <span className="font-medium">{clen.nbsLicense}</span>
                    </div>
                  )}
                </div>

                

{clen.serviceArea && (
  <div className="mt-8 overflow-hidden rounded-2xl border border-brand-blue/10 bg-gradient-to-r from-brand-blue/[0.045] to-brand-teal/[0.07]">
    <div className="flex flex-col sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4 px-5 py-4 sm:px-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-blue/10">
          <MapPin
            aria-hidden="true"
            className="h-6 w-6 text-brand-blue"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-brand-navy">
            Pôsobím v regióne
          </p>

          <p className="mt-0.5 text-sm text-slate-600">
            {clen.serviceArea}
          </p>
        </div>
      </div>

      <div className="mx-5 h-px bg-brand-blue/10 sm:mx-0 sm:h-14 sm:w-px" />

      <div className="px-5 py-4 text-sm leading-6 text-slate-600 sm:w-[46%] sm:px-6">
        Osobné stretnutia aj online podľa dohody.
      </div>
    </div>
  </div>
)}
                
              </div>
            </div>

          </div>
        </div>

        {/* SEKCE: ČLÁNKY (Dokonale zarovnaná s rovnakým písmom nadpisu) */}
        {clen.posts && clen.posts.length > 0 && (
          <div className="max-w-5xl mx-auto mb-16">
            
            <ArticlesCarousel posts={clen.posts} />
          </div>
        )}

        {/* SEKCE: REFERENCIE (Dokonale zarovnaná s rovnakým písmom nadpisu) */}
        <div className="max-w-5xl mx-auto">
  <TestimonialSlider 
    testimonials={clen.testimonials} 
    title="Čo o mne povedali moji klienti" 
  />
</div>

      </main>
    </>
  );
}