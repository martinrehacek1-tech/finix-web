import { defineField, defineType } from "sanity";

// Formulár pre pridávanie/úpravu článkov v administrácii.
export default defineType({
  name: "post",
  title: "Článok",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titulok",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL adresa (automaticky z titulku)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Krátky perex (zobrazí sa v náhľade článku)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "coverImage",
      title: "Titulná fotografia",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Kategória",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "teamMember" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Dátum publikovania",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
defineField({
  name: "readingTime",
  title: "Čas čítania",
  type: "number",
  description: "Odhadovaný počet minút čítania",
  validation: (rule) => rule.min(1).integer(),
}),
    defineField({
      name: "body",
      title: "Obsah článku",
      type: "array",
      of: [
        { type: "block" },
        { 
          type: "image", 
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        },
       { type: "callout" },
       { type: "table" },
       
      ],
    }),

    defineField({
      name: "seoTitle",
      title: "SEO titulok (voliteľné, inak sa použije Titulok)",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO popis (voliteľné, inak sa použije Perex)",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category.title", media: "coverImage" },
  },
});
