import { defineField, defineType } from "sanity";

const requiredUrl = (label: string) =>
  `${label} must be a complete URL beginning with http:// or https://.`;

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact & availability" },
    { name: "seo", title: "SEO defaults" },
    { name: "assets", title: "Assets" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      group: "identity",
      description: "The public name of the portfolio website.",
      validation: (rule) => rule.required().error("A site title is required."),
    }),
    defineField({
      name: "defaultSeoTitle",
      title: "Default SEO title",
      type: "string",
      group: "seo",
      description: "Fallback title for pages without page-specific SEO metadata.",
      validation: (rule) =>
        rule.max(70).warning("SEO titles longer than 70 characters may be truncated."),
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Fallback search and social description for the site.",
      validation: (rule) =>
        rule
          .max(170)
          .warning("SEO descriptions longer than 170 characters may be truncated."),
    }),
    defineField({
      name: "productionSiteUrl",
      title: "Production site URL",
      type: "url",
      group: "seo",
      description: "Canonical public origin, for example https://example.com.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .error(requiredUrl("Production site URL")),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      group: "contact",
      description: "Public contact email displayed across the portfolio.",
      validation: (rule) =>
        rule.required().email().error("Enter a valid public email address."),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "contact",
      description: "Short public location label, such as London, UK.",
    }),
    defineField({
      name: "availabilityLabel",
      title: "Availability label",
      type: "string",
      group: "contact",
      description: "Concise status shown beside the green availability indicator.",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      group: "contact",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).error(requiredUrl("GitHub URL")),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      group: "contact",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).error(requiredUrl("LinkedIn URL")),
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).error(requiredUrl("Instagram URL")),
    }),
    defineField({
      name: "cvFile",
      title: "CV file",
      type: "file",
      group: "assets",
      description: "Upload the current public CV as a PDF.",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "defaultOpenGraphImage",
      title: "Default Open Graph image",
      type: "image",
      group: "seo",
      description: "Fallback image used when sharing pages on social platforms.",
      options: { hotspot: true },
    }),
    defineField({
      name: "footerMessage",
      title: "Footer message",
      type: "string",
      group: "identity",
      description: "Short reusable message displayed in the public footer.",
    }),
  ],
  preview: {
    select: { title: "siteTitle", subtitle: "productionSiteUrl" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Site Settings",
      subtitle,
    }),
  },
});
