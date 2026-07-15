import { defineField, defineType } from "sanity";

const photoCategories = [
  { title: "Landscape", value: "Landscape" },
  { title: "Street", value: "Street" },
  { title: "Travel", value: "Travel" },
  { title: "Black & White", value: "Black & White" },
  { title: "Architecture", value: "Architecture" },
  { title: "Details", value: "Details" },
  { title: "Candid", value: "Candid" },
  { title: "Night", value: "Night" },
];

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
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
      validation: (rule) => rule.required().error("A photo title is required."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required().error("Generate a slug before publishing."),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      validation: (rule) => rule.required().error("A photograph is required."),
    }),
    defineField({
      name: "altText",
      title: "Alt text",
      type: "string",
      group: "content",
      description: "Describe the photograph's meaningful visual content.",
      validation: (rule) => rule.required().error("Accessible alt text is required."),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "content",
      validation: (rule) =>
        rule.required().integer().min(1900).max(2100).error("Enter a four-digit year."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: { list: photoCategories },
      validation: (rule) => rule.required().error("Choose a photography category."),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short caption used in gallery and viewer introductions.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 7,
      group: "content",
      description: "Longer plain-text description used in the photography viewer.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "publishing",
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
      name: "published",
      title: "Published",
      type: "boolean",
      group: "publishing",
      description: "Controls whether the public site may include this photo after migration.",
      initialValue: false,
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
      media: "image",
    },
    prepare: ({ title, category, year, media }) => ({
      title,
      subtitle: [category, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
