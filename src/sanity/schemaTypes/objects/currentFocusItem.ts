import { defineField, defineType } from "sanity";

export const currentFocusItem = defineType({
  name: "currentFocusItem",
  title: "Current-focus item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Focus",
      type: "string",
      validation: (rule) => rule.required().error("A focus title is required."),
    }),
    defineField({
      name: "description",
      title: "Supporting detail",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
