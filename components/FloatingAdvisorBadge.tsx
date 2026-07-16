import { cookies } from "next/headers";
import { client, urlFor } from "@/lib/sanity";
import FloatingAdvisorBadgeClient from "./FloatingAdvisorBadgeClient";

type Advisor = {
  name: string;
  titleBefore?: string;
  titleAfter?: string;
  slug?: {
    current?: string;
  };
  photo?: any;
};

export default async function FloatingAdvisorBadge() {
  const cookieStore = await cookies();
  const advisorSlug = cookieStore.get("finix_advisor_slug")?.value;

  if (!advisorSlug) {
    return null;
  }

  const advisor: Advisor | null = await client.fetch(
    `*[
      _type == "teamMember" &&
      slug.current == $advisorSlug &&
      active == true
    ][0]{
      name,
      titleBefore,
      titleAfter,
      slug,
      photo
    }`,
    { advisorSlug },
    {
      cache: "no-store",
    }
  );

  if (!advisor?.name || !advisor.slug?.current) {
    return null;
  }

  const displayName =
    `${[advisor.titleBefore, advisor.name]
      .filter(Boolean)
      .join(" ")}${advisor.titleAfter ? `, ${advisor.titleAfter}` : ""}`;

  const photoUrl = advisor.photo
    ? urlFor(advisor.photo)
        .width(160)
        .height(160)
        .fit("crop")
        .auto("format")
        .url()
    : undefined;

  return (
    <FloatingAdvisorBadgeClient
      displayName={displayName}
      profileHref={`/tim/${advisor.slug.current}`}
      photoUrl={photoUrl}
    />
  );
}