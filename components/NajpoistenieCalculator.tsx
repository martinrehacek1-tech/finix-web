import { cookies } from "next/headers";
import { client } from "@/lib/sanity";


const DEFAULT_NAJPOISTENIE_CODE = "110820004";

type NajpoistenieCalculatorProps = {
  calculatorPath: string;
  title: string;
  description?: string;
  hash?: string;
};

export default async function NajpoistenieCalculator({
  calculatorPath,
  title,
  description,
  hash,
}: NajpoistenieCalculatorProps) {
  const cookieStore = await cookies();
  const advisorSlug = cookieStore.get("finix_advisor_slug")?.value;

  let advisorCode = DEFAULT_NAJPOISTENIE_CODE;

  if (advisorSlug) {
    const sanityCode: string | null = await client.fetch(
      `*[
        _type == "teamMember" &&
        slug.current == $advisorSlug &&
        active == true
      ][0].najpoistenieCode`,
      { advisorSlug },
      {
        cache: "no-store",
      },
    );

    if (sanityCode?.trim()) {
      advisorCode = sanityCode.trim();
    }
  }

  const normalizedPath = calculatorPath.replace(/^\/+|\/+$/g, "");

  const calculatorUrl =
    `https://najpoistenie.sk/${normalizedPath}/` +
    `?layout=simple&kod=${encodeURIComponent(advisorCode)}` +
    (hash ? `#${encodeURIComponent(hash)}` : "");

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-brand-navy">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <iframe
          id={`iframe-najpoistenie-${normalizedPath}`}
          src={calculatorUrl}
          title={title}
          className="block h-[900px] w-full border-0 sm:h-[900px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}