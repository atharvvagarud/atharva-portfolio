import { defineField, defineType } from "sanity";

export const cmsConnectionTest = defineType({
  name: "cmsConnectionTest",
  title: "CMS connection test",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
