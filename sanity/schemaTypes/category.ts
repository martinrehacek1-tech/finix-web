import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Kategória blogu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Názov (napr. Hypotéky, Poistenie, Investovanie)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL adresa",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
  ],
});
