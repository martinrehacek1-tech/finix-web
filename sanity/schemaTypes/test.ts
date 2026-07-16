import { defineField, defineType } from "sanity";

export default defineType({
  name: "testBlock",
  title: "TEST blok",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
    }),
  ],
});