import { defineField, defineType } from "sanity";

export default defineType({
  name: "callout",
  title: "Zvýraznený rámček",
  type: "object",
  options: {
    modal: { type: "popover", width: 4 },
  },
  fields: [
    defineField({
      name: "heading",
      title: "Nadpis",
      type: "string",
    }),
    defineField({
      name: "color",
      title: "Farba rámčeka",
      type: "string",
      options: {
        list: [
          { title: "Zelená", value: "green" },
          { title: "Modrá", value: "blue" },
          { title: "Žltá", value: "yellow" },
          { title: "Červená", value: "red" },
        ],
        layout: "radio",
      },
      initialValue: "green",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 6,
    }),
  ],
});