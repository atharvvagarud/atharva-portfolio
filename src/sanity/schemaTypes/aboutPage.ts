import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "introduction", title: "Introduction", default: true },
    { name: "background", title: "Background" },
    { name: "focus", title: "Focus & availability" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "sectionLabel",
      title: "Section label",
      type: "string",
      group: "introduction",
      description: "Numbered label shown above the page heading, for example 01 / ABOUT.",
      initialValue: "01 / ABOUT",
      validation: (rule) => rule.required().error("A section label is required."),
    }),
    defineField({
      name: "mainHeading",
      title: "Main heading",
      type: "string",
      group: "introduction",
      validation: (rule) => rule.required().error("A main heading is required."),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "introduction",
      validation: (rule) => rule.required().error("An introduction is required."),
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait image",
      type: "image",
      group: "introduction",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitAltText",
      title: "Portrait alt text",
      type: "string",
      group: "introduction",
      description: "Describe the portrait's meaningful content for screen-reader users.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { portraitImage?: unknown } | undefined;
          return !parent?.portraitImage || value
            ? true
            : "Alt text is required when a portrait image is present.";
        }),
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "array",
      group: "background",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required().error("A biography is required."),
    }),
    defineField({
      name: "educationEntries",
      title: "Education entries",
      type: "array",
      group: "background",
      of: [defineArrayMember({ type: "educationEntry" })],
    }),
    defineField({
      name: "areasIBuild",
      title: "What I Build",
      type: "array",
      group: "background",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      group: "background",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "currentFocusEntries",
      title: "Current-focus entries",
      type: "array",
      group: "focus",
      of: [defineArrayMember({ type: "currentFocusItem" })],
    }),
    defineField({
      name: "availabilityText",
      title: "Availability text",
      type: "string",
      group: "focus",
      validation: (rule) => rule.required().error("Availability text is required."),
    }),
    defineField({
      name: "cvCallToActionLabel",
      title: "CV call-to-action label",
      type: "string",
      group: "focus",
      initialValue: "Download CV",
      validation: (rule) => rule.required().error("A CV call-to-action label is required."),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { heading: "mainHeading" },
    prepare: ({ heading }) => ({ title: "About Page", subtitle: heading }),
  },
});
