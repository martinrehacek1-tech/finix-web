import { defineField, defineType } from "sanity";

export default defineType({
  name: "table",
  title: "Tabuľka",
  type: "object",
  fields: [
    defineField({
      name: "rawData",
      title: "Obsah tabuľky",
      description:
        "Skopíruj tabuľku z Excelu/Google Sheets a vlož sem (Ctrl+V) - stĺpce sa rozpoznajú automaticky. Alebo píš ručne: každý riadok na nový riadok (Enter), stĺpce odděľ znakom |",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "hasHeaderRow",
      title: "Prvý riadok je hlavička (tmavé pozadie, biely text)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { rawData: "rawData" },
    prepare({ rawData }: any) {
      const rowCount = (rawData || "").split("\n").filter(Boolean).length;
      return { title: `Tabuľka (${rowCount} riadkov)` };
    },
  },
});