export const photoCategories = [
  "Landscape",
  "Street",
  "Travel",
  "Black & White",
] as const;

export type PhotoCategory = (typeof photoCategories)[number];
export type PhotoFilter = "All" | PhotoCategory;

export type Photo = {
  id: string;
  slug: string;
  title: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  location: string;
  year: number;
  category: PhotoCategory;
  summary: string;
  description: string;
};

export const photoFilters: readonly PhotoFilter[] = ["All", ...photoCategories];

// Placeholder photographs and metadata: replace these records as the final
// portfolio edit is supplied. Keeping both here makes future swaps mechanical.
export const photos: readonly Photo[] = [
  {
    id: "photo-01",
    slug: "glencoe-morning",
    title: "Glencoe Morning",
    src: "/images/off-screen-highlands.png",
    alt: "A still Highland valley beneath low cloud",
    width: 1000,
    height: 750,
    location: "Glencoe, Scotland",
    year: 2026,
    category: "Landscape",
    summary: "Low cloud and soft light settling into the Highland valley.",
    description:
      "A quiet morning study of changing weather, open land and the scale of the Highlands. The frame holds on the small shifts in light before the valley disappears into cloud.",
  },
  {
    id: "photo-02",
    slug: "after-the-rain",
    title: "After the Rain",
    src: "/images/photography/london-crossing.png",
    alt: "A lone pedestrian crossing a wet London street",
    width: 1200,
    height: 900,
    location: "London, England",
    year: 2026,
    category: "Street",
    summary: "A brief crossing held in the reflection of late afternoon rain.",
    description:
      "Made while walking through central London after a shower, this frame looks at the city between movements: one figure, a near-empty street and the last light reflected from the road.",
  },
  {
    id: "photo-03",
    slug: "concrete-curve",
    title: "Concrete Curve",
    src: "/images/photography/concrete-curve.png",
    alt: "Curved concrete architecture crossed by a hard shadow",
    width: 1200,
    height: 900,
    location: "London, England",
    year: 2026,
    category: "Street",
    summary: "Geometry, shadow and a single window on a quiet facade.",
    description:
      "An architectural observation reduced to a few elements: a curved surface, one opening and the movement of sunlight. The restrained frame turns an ordinary facade into an abstract study.",
  },
  {
    id: "photo-04",
    slug: "london-blue-hour",
    title: "London Blue Hour",
    src: "/images/off-screen-london.png",
    alt: "London buildings and street lights at blue hour",
    width: 1000,
    height: 750,
    location: "London, England",
    year: 2026,
    category: "Street",
    summary: "The city settling into evening as its lights begin to appear.",
    description:
      "A familiar London view photographed at the point where daylight and artificial light briefly balance. The image is less about a landmark than the particular atmosphere of the hour.",
  },
  {
    id: "photo-05",
    slug: "bridge-in-rain",
    title: "Bridge in Rain",
    src: "/images/photography/bridge-walk.png",
    alt: "Two distant figures walking beneath suspension bridge cables",
    width: 1200,
    height: 900,
    location: "New York, USA",
    year: 2026,
    category: "Black & White",
    summary: "Two figures moving through the repeating lines of a bridge.",
    description:
      "The structure of the bridge creates a precise rhythm around two small figures. Removing colour leaves the rain, scale and geometry to carry the frame.",
  },
  {
    id: "photo-06",
    slug: "harbour-at-dusk",
    title: "Harbour at Dusk",
    src: "/images/photography/coastal-village.png",
    alt: "A coastal hillside village overlooking calm water at dusk",
    width: 1200,
    height: 900,
    location: "Hydra, Greece",
    year: 2026,
    category: "Travel",
    summary: "Stone houses and a quiet harbour held in the last blue light.",
    description:
      "Photographed as the day receded from the harbour, the frame follows the village from the waterline into the hillside. Muted colour and scattered lights hold the stillness of the evening.",
  },
  {
    id: "photo-07",
    slug: "between-stations",
    title: "Between Stations",
    src: "/images/photography/train-window.png",
    alt: "A passenger silhouetted beside a train window",
    width: 1200,
    height: 900,
    location: "Scotland, UK",
    year: 2026,
    category: "Black & White",
    summary: "A passenger, a window and countryside passing out of focus.",
    description:
      "A small observation from a long journey north. The passenger remains still while the landscape becomes a soft trace, making the image feel suspended between one place and the next.",
  },
  {
    id: "photo-08",
    slug: "atlantic-stillness",
    title: "Atlantic Stillness",
    src: "/images/photography/atlantic-shore.png",
    alt: "A solitary figure standing on a broad Atlantic beach",
    width: 1200,
    height: 900,
    location: "Cornwall, England",
    year: 2026,
    category: "Landscape",
    summary: "One figure at the edge of a wide, overcast Atlantic shore.",
    description:
      "The beach opens into a deliberately sparse composition of water, rock and cloud. A distant figure gives the landscape its scale without interrupting its quietness.",
  },
];
