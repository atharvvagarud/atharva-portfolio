import { defineArrayMember, defineField, defineType } from "sanity";

const projectCategories = [
  { title: "Full-stack", value: "Full-stack" },
  { title: "AI / ML", value: "AI / ML" },
  { title: "Data", value: "Data" },
  { title: "Tools", value: "Tools" },
];

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "links", title: "Links" },
    { name: "publishing", title: "Publishing" },
    { name: "seo", title: "SEO" },
  ],
  orderings: [
    {
      title: "Display order, then year",
      name: "displayOrderYear",
      by: [
        { field: "displayOrder", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().error("A project title is required."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "Generated from the title and reserved for future project URLs.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required().error("Generate a slug before publishing."),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Concise summary used in project lists.",
      validation: (rule) => rule.required().error("A short description is required."),
    }),
    defineField({
      name: "fullDescription",
      title: "Full description",
      type: "text",
      rows: 8,
      group: "content",
      description: "Longer overview only; case-study fields will be added separately later.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "content",
      validation: (rule) =>
        rule.required().integer().min(2000).max(2100).error("Enter a four-digit year."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: { list: projectCategories, layout: "radio" },
      validation: (rule) => rule.required().error("Choose a project category."),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "previewImage",
      title: "Preview image",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "previewImageAltText",
      title: "Preview image alt text",
      type: "string",
      group: "media",
      description: "Describe the preview's meaningful content for screen-reader users.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { previewImage?: unknown } | undefined;
          return !parent?.previewImage || value
            ? true
            : "Alt text is required when a preview image is present.";
        }),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      group: "links",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Enter a complete URL beginning with http:// or https://."),
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      group: "links",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .error("Enter a complete URL beginning with http:// or https://."),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "publishing",
      description: "Makes this project eligible for selected-work placements.",
      initialValue: false,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "publishing",
      description: "Controls whether the public site may include this project after migration.",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      group: "publishing",
      description: "Lower numbers appear first.",
      initialValue: 100,
      validation: (rule) => rule.integer().min(0).error("Use a whole number of zero or more."),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      year: "year",
      media: "previewImage",
    },
    prepare: ({ title, category, year, media }) => ({
      title,
      subtitle: [category, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
