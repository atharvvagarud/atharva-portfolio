export type NotFoundContent = {
  code: string;
  heading: string;
  supportingText: readonly [string, string];
  action: {
    label: string;
    href: string;
  };
};

export const notFoundContent = {
  code: "404",
  heading: "Page not found.",
  supportingText: [
    "Looks like this page has taken a different route.",
    "Let’s get you back on track.",
  ],
  action: {
    label: "Go home",
    href: "/",
  },
} as const satisfies NotFoundContent;
