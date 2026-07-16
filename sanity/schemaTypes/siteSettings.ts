import { defineField, defineType } from "sanity";

// Toto je "jeden formulár pre celý web" - čísla v hero sekcii, kontaktné údaje atď.
// V administrácii sa zobrazí ako jedna položka "Nastavenia webu", nie zoznam.
export default defineType({
  name: "siteSettings",
  title: "Nastavenia webu",
  type: "document",
  fields: [
    defineField({ name: "heroHeadline", title: "Hlavný nadpis na úvodnej stránke", type: "string" }),
    defineField({ name: "heroSubtext", title: "Podnadpis pod hlavným nadpisom", type: "text", rows: 2 }),
    defineField({ name: "statClients", title: "Počet spokojných klientov", type: "number" }),
    defineField({ name: "statFirstHomes", title: "Počet klientov pri prvom bývaní", type: "number" }),
    defineField({ name: "statMortgageVolume", title: "Objem sprostredkovaných hypoték", type: "string", }),
    defineField({ name: "statSavedEur", title: "Ušetrené na úrokoch (v eurách)", type: "number" }),
    defineField({ name: "statInvestedVolume", title: "Objem investícií v správe", type: "string",}),
    defineField({ name: "contactAddress", title: "Adresa", type: "text", rows: 3 }),
    defineField({ name: "contactPhone", title: "Telefón (asistentka)", type: "string" }),
    defineField({ name: "contactEmail", title: "Kontaktný email", type: "string" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url",}),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url",}),
  ],
});
