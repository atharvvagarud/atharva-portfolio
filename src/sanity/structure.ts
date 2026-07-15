import type { StructureBuilder, StructureResolver } from "sanity/structure";

const singletonItem = (
  structureBuilder: StructureBuilder,
  title: string,
  schemaType: string,
  documentId: string,
) =>
  structureBuilder
    .listItem()
    .id(schemaType)
    .title(title)
    .child(
      structureBuilder
        .document()
        .id(documentId)
        .schemaType(schemaType)
        .documentId(documentId)
        .title(title),
    );

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Content")
    .items([
      singletonItem(
        structureBuilder,
        "Site Settings",
        "siteSettings",
        "siteSettings",
      ),
      singletonItem(structureBuilder, "Homepage", "homepage", "homepage"),
      singletonItem(
        structureBuilder,
        "About Page",
        "aboutPage",
        "aboutPage",
      ),
      structureBuilder.divider(),
      structureBuilder
        .listItem()
        .id("projects")
        .title("Projects")
        .child(
          structureBuilder
            .documentTypeList("project")
            .title("Projects")
            .defaultOrdering([
              { field: "displayOrder", direction: "asc" },
              { field: "year", direction: "desc" },
            ]),
        ),
      structureBuilder
        .listItem()
        .id("photography")
        .title("Photography")
        .child(
          structureBuilder
            .documentTypeList("photo")
            .title("Photography")
            .defaultOrdering([
              { field: "displayOrder", direction: "asc" },
              { field: "year", direction: "desc" },
            ]),
        ),
    ]);
