import { defineField, defineType } from "sanity";

const offScreenTypes = [
  { title: "Image", value: "image" },
  { title: "Music", value: "music" },
  { title: "Text", value: "text" },
];

export const offScreenItem = defineType({
  name: "offScreenItem",
  title: "Off Screen item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("An item title is required."),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: offScreenTypes, layout: "radio" },
      initialValue: "image",
      validation: (rule) => rule.required().error("Choose an item type."),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          return parent?.type !== "image" || value
            ? true
            : "An image is required when the item type is Image.";
        }),
    }),
    defineField({
      name: "smallLabel",
      title: "Small label",
      type: "string",
      description: "Short metadata shown above or beside the main text.",
    }),
    defineField({
      name: "primaryText",
      title: "Primary text",
      type: "string",
      validation: (rule) => rule.required().error("Primary text is required."),
    }),
    defineField({
      name: "secondaryText",
      title: "Secondary text",
      type: "string",
    }),
    defineField({
      name: "externalLink",
      title: "External URL",
      type: "externalLink",
      description: "Optional destination for this item.",
    }),
    defineField({
      name: "altText",
      title: "Accessible alt text",
      type: "string",
      description: "Describe the image's meaningful content; do not start with “Image of”.",
      hidden: ({ parent }) => parent?.type !== "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          return parent?.type !== "image" || value
            ? true
            : "Alt text is required when the item type is Image.";
        }),
    }),
  ],
  preview: {
    select: { title: "title", type: "type", media: "image" },
    prepare: ({ title, type, media }) => ({
      title,
      subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) : undefined,
      media,
    }),
  },
});
