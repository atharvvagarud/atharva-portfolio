import { defineField, defineType } from "sanity";

export const statistic = defineType({
  name: "statistic",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (rule) => rule.required().error("A statistic value is required."),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().error("A statistic label is required."),
    }),
  ],
  preview: {
    select: { value: "value", label: "label" },
    prepare: ({ value, label }) => ({ title: value, subtitle: label }),
  },
});
