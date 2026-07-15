import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  description: "Optional page-specific metadata. Site Settings provides the fallback values.",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description: "Keep this concise; search engines may truncate long titles.",
      validation: (rule) =>
        rule.max(70).warning("SEO titles longer than 70 characters may be truncated."),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .max(170)
          .warning("SEO descriptions longer than 170 characters may be truncated."),
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "image",
      description: "Optional social-sharing image for this page.",
      options: { hotspot: true },
    }),
  ],
});
