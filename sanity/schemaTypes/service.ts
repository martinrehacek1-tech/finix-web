import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Služba (napr. Hypotéka, Poistenie auta)",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Názov služby", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "URL adresa",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikona",
      type: "string",
      description:
        "Napíš presne jeden z týchto názvov: home, heart, trending-up, car, shield, piggy-bank, wallet, landmark, calculator, umbrella, users, file-text, credit-card, building, heart-handshake, graduation-cap, plane, briefcase",
    }),
    defineField({
      name: "shortDescription",
      title: "Krátky popis (1-2 vety)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "content",
      title: "Podrobný text na podstránke služby (voliteľné)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "order", title: "Poradie zobrazenia", type: "number", initialValue: 100 }),

    defineField({
  name: "showOnHomepage",
  title: "Zobraziť na homepage",
  type: "boolean",
  initialValue: true,
  description:
    "Ak je vypnuté, služba zostane publikovaná a dostupná cez priamy odkaz, ale nebude sa zobrazovať medzi službami na hlavnej stránke.",
}),
    

  ],
});