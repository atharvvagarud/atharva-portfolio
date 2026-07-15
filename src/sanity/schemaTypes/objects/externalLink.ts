import { defineField, defineType } from "sanity";

export const externalLink = defineType({
  name: "externalLink",
  title: "External link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Link label",
      type: "string",
      description: "Optional editor-facing or visible label for the destination.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .error("Enter a complete URL beginning with http:// or https://."),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "External link",
      subtitle,
    }),
  },
});
