import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { media } from "sanity-plugin-media";
import { dashboardTool } from "@sanity/dashboard";
import { presentationTool } from "sanity/presentation";

// Toto je konfigurácia tvojho admin rozhrania (Sanity Studio).
// Po spustení pobeží na /studio - presne tam budeš pridávať články a poradcov.
export default defineConfig({
  name: "finix",
  title: "FINIX - administrácia obsahu",
  basePath: "/studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "y5p16js7",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Obsah")
          .items([
            S.listItem()
              .title("Nastavenia webu")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.documentTypeListItem("post").title("Články"),
            S.documentTypeListItem("category").title("Kategórie blogu"),
            S.divider(),
            S.documentTypeListItem("teamMember").title("Poradcovia / tím"),
            S.documentTypeListItem("testimonial").title("Referencie klientov"),
            S.divider(),
            S.documentTypeListItem("service").title("Služby"),
            S.divider(),
            S.documentTypeListItem("legalPage").title("Právne stránky"),
          ]),
    }),
    dashboardTool({
    widgets: [],
  }),
    media(),
    presentationTool({
    previewUrl: {
      origin: "http://localhost:3000",
    },
  }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
