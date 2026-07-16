import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Referencia klienta",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Meno klienta", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "clientRole", title: "Pozícia / firma klienta", type: "string" }),
    
    // NOVÉ POLE PRE FOTOGRAFIU KLIENTA
    defineField({
      name: "clientPhoto",
      title: "Fotografia klienta",
      type: "image",
      options: {
        hotspot: true, // Umožní adminovi vybrať stred výrezu priamo v rozhraní Sanity
      },
      description: "Ideálne štvorcový formát. Ak fotku nezadáte, zobrazí sa neutrálna iniciálka.",
    }),

    defineField({ name: "quote", title: "Text referencie", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({
      name: "advisor",
      title: "Ktorého poradcu sa referencia týka",
      type: "reference",
      to: [{ type: "teamMember" }],
    }),
    defineField({ name: "featured", title: "Zobraziť na homepage", type: "boolean", initialValue: false }),
  ],
});