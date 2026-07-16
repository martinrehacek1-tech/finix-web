import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const RESERVED_SLUGS = new Set([
  "blog",
  "tim",
  "sluzby",
  "kontakt",
  "studio",
  "api",
  "kalkulacky",
  "favicon.ico",
]);

function getHomeRedirectUrl(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";
  redirectUrl.hash = "";

  return redirectUrl;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ advisorSlug: string }> }
) {
  const { advisorSlug } = await params;

  if (RESERVED_SLUGS.has(advisorSlug)) {
    return NextResponse.redirect(getHomeRedirectUrl(request));
  }

  const advisor = await client.fetch(
    `*[
      _type == "teamMember" &&
      slug.current == $advisorSlug &&
      active == true
    ][0]{
      _id,
      name,
      titleBefore,
      titleAfter,
      slug,
      najpoistenieCode
    }`,
    { advisorSlug },
    {
      cache: "no-store",
    }
  );

  if (!advisor?.slug?.current || !advisor?.najpoistenieCode) {
    return NextResponse.redirect(getHomeRedirectUrl(request));
  }

  const response = NextResponse.redirect(getHomeRedirectUrl(request));

  response.cookies.set("finix_advisor_slug", advisor.slug.current, {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}