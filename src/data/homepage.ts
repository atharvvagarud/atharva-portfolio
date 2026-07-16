import { siteOwnerName } from "@/config/site";

export type OffScreenImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HomepageData = {
  name: string;
  introduction: readonly [string, string];
  profile: string;
  highlights: readonly { value: string; label: string }[];
  currently: readonly { label: string; value: string }[];
  offScreenImages: readonly OffScreenImage[];
};

export const homepageData = {
  name: siteOwnerName,
  introduction: [
    "I build thoughtful software across full-stack systems, data and applied AI.",
    "First-Class Computer Science graduate creating products that are technically strong, visually considered and genuinely useful.",
  ],
  profile:
    "I am a First-Class Computer Science graduate and software engineer based in London. I enjoy building complete products, from architecture and APIs to interaction design, performance and deployment.",
  highlights: [
    { value: "01", label: "First-Class degree" },
    { value: "02", label: "Selected projects" },
    { value: "01", label: "London base" },
  ],
  currently: [
    { label: "Building", value: "Pulse health analytics" },
    { label: "Learning", value: "Swift and native iOS development" },
    { label: "Exploring", value: "AI agents, local models and developer tooling" },
  ],
  offScreenImages: [
    {
      src: "/images/off-screen-highlands.png",
      alt: "A quiet mountain road winding through a cloudy Highland valley",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-training.png",
      alt: "Black and white photograph of a person training in a quiet gym",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-sketchbook.png",
      alt: "An open sketchbook containing interface and product diagrams",
      width: 1000,
      height: 750,
    },
    {
      src: "/images/off-screen-london.png",
      alt: "A subdued London skyline beneath a deep blue evening sky",
      width: 1000,
      height: 750,
    },
  ],
} as const satisfies HomepageData;
