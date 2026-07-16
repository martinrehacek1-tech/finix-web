import { defineField, defineType } from "sanity";

// Toto je formulár, ktorý uvidíš v administrácii pri pridávaní/úprave poradcu.
// Každé "field" nižšie = jeden riadok vo formulári.
export default defineType({
  name: "teamMember",
  title: "Poradca / člen tímu",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Meno a priezvisko",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "URL adresa (automaticky z mena)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "titleBefore",
      title: "Titul pred menom (napr. Ing.)",
      type: "string",
    }),

    defineField({
      name: "titleAfter",
      title: "Titul za menom (napr. PhD., MBA)",
      type: "string",
    }),

    defineField({
      name: "photo",
      title: "Fotografia",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
 }),

defineField({
      name: "bio",
      title: "O mne (dlhší text na profilovej stránke)",
      type: "text",
      rows: 5,
    }),

defineField({
  name: "position",
  title: "Pozícia",
  type: "string",
  options: {
    layout: "dropdown",
    list: [
      { title: "Partner", value: "Partner" },
      { title: "Územný riaditeľ", value: "Územný riaditeľ" },
      { title: "Regionálny riaditeľ", value: "Regionálny riaditeľ" },
      { title: "Oblastný riaditeľ", value: "Oblastný riaditeľ" },
      { title: "Manažér", value: "Manažér" },

      {
        title: "O7 – Finančný sprostredkovateľ Expert",
        value: "Finančný sprostredkovateľ Expert",
      },
      {
        title: "O6 – Exkluzívny finančný sprostredkovateľ",
        value: "Exkluzívny finančný sprostredkovateľ",
      },
      {
        title: "O5 – Top finančný sprostredkovateľ",
        value: "Top finančný sprostredkovateľ",
      },
      {
        title: "O4 – Finančný sprostredkovateľ Senior",
        value: "Finančný sprostredkovateľ Senior",
      },
      {
        title: "O3 – Finančný sprostredkovateľ",
        value: "Finančný sprostredkovateľ",
      },
      {
        title: "O2 – Finančný sprostredkovateľ Junior",
        value: "Finančný sprostredkovateľ Junior",
      },
      {
        title: "O1 – Trainee",
        value: "Trainee",
      },
    ],
  },
}),

    defineField({
  name: "specialization",
  title: "Špecializácia",
  type: "array",
  description: "Môžete označiť viac možností.",
  of: [{ type: "string" }],
  options: {
    list: [
      { title: "Hypotéky", value: "Hypotéky" },
      { title: "Investície", value: "Investície" },
      { title: "Poistenie", value: "Poistenie" },
      { title: "Dôchodok", value: "Dôchodok" },
      { title: "Reality", value: "Reality" },
      { title: "Iné", value: "Iné" },
    ],
  },
}),

defineField({
  name: "specializationOther",
  title: "Iná špecializácia",
  type: "string",
  description: "Napíšte vlastnú špecializáciu.",
  hidden: ({ parent }) =>
    !Array.isArray(parent?.specialization) ||
    !parent.specialization.includes("Iné"),
  validation: (rule) =>
    rule.custom((value, context) => {
      const parent = context.parent as {
        specialization?: string[];
      };

      if (parent?.specialization?.includes("Iné") && !value?.trim()) {
        return "Ak ste vybrali možnosť Iné, doplňte vlastnú špecializáciu.";
      }

      return true;
    }),
}),

defineField({
  name: "serviceArea",
  title: "Miesto pôsobenia",
  type: "string",
  description:
    'Napríklad „Košice a okolie“, „Prešovský kraj“ alebo „Online – celé Slovensko“.',
}),

defineField({
  name: "najpoistenieCode",
  title: "Finportal ID (pre párovanie zmlúv uzavretých cez Najpoistenie)",
  type: "string",
  validation: (rule) =>
    rule
      .required()
      .regex(/^\d+$/, {
        name: "číselný kód",
        invert: false,
      })
      .error("Kód môže obsahovať iba číslice."),
}),      

 
    defineField({
      name: "nbsLicense",
      title: "Licencia NBS",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Telefón",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Poradie zobrazenia (menšie číslo = vpredu)",
      type: "number",
      initialValue: 100,
    }),
    defineField({
      name: "active",
      title: "Zobraziť na webe",
      type: "boolean",
      initialValue: true,
      description: "Vypni, ak poradca už vo firme nepracuje - zmizne z webu, ale história zostane zachovaná.",
    }),
  ],

  preview: {
  select: {
    title: "name",
    specialization: "specialization",
    specializationOther: "specializationOther",
    media: "photo",
  },

  prepare({
    title,
    specialization,
    specializationOther,
    media,
  }) {
    const items = Array.isArray(specialization)
      ? specialization
          .filter((item: string) => item !== "Iné")
          .concat(
            specialization.includes("Iné") && specializationOther
              ? [specializationOther]
              : [],
          )
      : [];

    return {
      title: title || "Poradca bez mena",
      subtitle: items.length > 0 ? items.join(", ") : "Bez špecializácie",
      media,
    };
  },
},

});
