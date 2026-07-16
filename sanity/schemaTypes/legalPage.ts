import {
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";

export default defineType({
  name: "legalPage",
  title: "Právna stránka",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Názov stránky",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL adresa",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

     defineField({
      name: "content",
      title: "Obsah",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normálny text", value: "normal" },
            { title: "Nadpis 2", value: "h2" },
            { title: "Nadpis 3", value: "h3" },
            { title: "Citácia", value: "blockquote" },
          ],
          lists: [
            { title: "Odrážky", value: "bullet" },
            { title: "Číslovaný zoznam", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Tučné", value: "strong" },
              { title: "Kurzíva", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Odkaz",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),

    defineField({
      name: "updatedAt",
      title: "Dátum poslednej aktualizácie",
      type: "date",
    }),

    defineField({
      name: "active",
      title: "Zobraziť na webe",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
});