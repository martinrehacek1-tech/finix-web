import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}

export const queries = {
  siteSettings: `*[_type == "siteSettings"][0]`,
  teamMembers: `*[_type == "teamMember" && active == true] | order(order asc){
    _id, name, titleBefore, titleAfter, slug, photo, specialization,specializationOther,serviceArea,najpoistenieCode
  }`,
  services: `*[_type == "service" &&
  showOnHomepage != false] | order(order asc){ _id, title, slug, icon, shortDescription }`,
  serviceBySlug: `*[_type == "service" && slug.current == $slug][0]{ _id, title, icon, shortDescription, content }`,
  recentPosts: `*[_type == "post"] | order(publishedAt desc)[0...6]{_id, title, slug, excerpt, coverImage, publishedAt,category->{title, slug},author->{name, slug} }`,
  postBySlug: `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  excerpt,
  readingTime,
  coverImage,
  publishedAt,
  body,
  category->{
    title,
    slug
  },
  author->{
    name,
    slug,
    photo,
    shortBio
  }
}`,

  // ÚPRAVA: Detail poradcu teraz sťahuje iba jemu priradené referencie
  teamMemberBySlug: `*[_type == "teamMember" && slug.current == $slug][0]{
    _id, 
    name, 
    titleBefore,
    titleAfter, 
    photo, 
    specialization,
    specializationOther, 
    bio, 
    nbsLicense, 
    phone, 
    email,
    najpoistenieCode,
    "testimonials": *[_type == "testimonial" && advisor._ref == ^._id] | order(_createdAt desc){
      _id,
      clientName,
      clientRole,
      clientPhoto,
      quote
    }
  }`,
  postsByAuthorSlug: `*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc){
    _id, title, slug, excerpt, coverImage, publishedAt,
    category->{title, slug}
  }`,
  testimonials: `*[_type == "testimonial"] | order(featured desc, _createdAt desc){
    _id,
    clientName,
    clientRole,
    clientPhoto,
    quote,
    advisor->{
      name,
titleBefore,
titleAfter
    }
  }`,

legalPageBySlug: `*[
  _type == "legalPage" &&
  slug.current == $slug &&
  active != false
][0]{
  _id,
  title,
  intro,
  content,
  updatedAt
}`,

};