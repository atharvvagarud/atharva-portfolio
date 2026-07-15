import { defineField, defineType } from "sanity";

export const educationEntry = defineType({
  name: "educationEntry",
  title: "Education entry",
  type: "object",
  fields: [
    defineField({
      name: "qualification",
      title: "Qualification",
      type: "string",
      validation: (rule) => rule.required().error("A qualification is required."),
    }),
    defineField({
      name: "institution",
      title: "Institution",
      type: "string",
      validation: (rule) => rule.required().error("An institution is required."),
    }),
    defineField({
      name: "result",
      title: "Result",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) =>
        rule.required().integer().min(1900).max(2100).error("Enter a four-digit year."),
    }),
  ],
  preview: {
    select: {
      qualification: "qualification",
      institution: "institution",
      year: "year",
    },
    prepare: ({ qualification, institution, year }) => ({
      title: qualification,
      subtitle: [institution, year].filter(Boolean).join(" · "),
    }),
  },
});
