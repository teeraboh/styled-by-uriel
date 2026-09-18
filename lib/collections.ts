// ============================================
// Styled by Uriel — Collection catalog (placeholder)
// Temporary dev data. Replaced by Supabase queries when the backend lands.
// Stitch-generated imagery and copy are placeholders (PRD §15).
// ============================================

export interface CollectionProduct {
  slug: string;
  name: string;
  price: number;
  colour: string;
  description: string;
  sizes: string[];
  imageUrl: string;
  /** Filter-tab category id this product belongs to */
  category: string;
  /** Optional neutral badge (e.g. "New Drop") */
  badge?: string;
}

export interface CollectionFilter {
  id: string;
  label: string;
}

export interface Collection {
  slug: string;
  name: string;
  edition: string;
  description: string;
  ageRange: string;
  fromPrice: number;
  origin: string;
  heroImage: string;
  heroLabel: string;
  heroPrice: number;
  filters: CollectionFilter[];
  products: CollectionProduct[];
}

const IMG_TRACKSUIT =
  "https://lh3.googleusercontent.com/aida/AEtjO1Xgzlvx5oI4TZhJrEZglLEzJltz-LpPJ6KKwatmoNQ5wPPTpwapFY9QrpQf6NVb152Yfx7o-4VcD1yVUWbXR4ljhHRIqg9S0tF198a5TMXadgn-AKKmx2mRAfKLVJ8RLZmJ61He5sGOUIV23vlOdglwXV1Edh10UX7LwEVjsXCNLuWqwOKn5odHMRLIOdTnU8kJDFA3vY7z4iKjah3-aag8BbafBIcniNnU5yQnLu9K1PyosXdV1EPkKy8";
const IMG_TEE =
  "https://lh3.googleusercontent.com/aida/AEtjO1UNGbh2Vydr4Elt1NIZop3F6TtBSVg95Qdi-m6yvH2DNFDJD_aP4L4dseK5CYqQsUzQiNJ7Z_wLZQYItoT9UUANh_mkZKW2aaQUwTOw2NKemf-Ncex5grs1N29ABimQ-s2Z1ChDTINMI7ZrxLdD0bkQ0AIkKA1zyEvsQQF0taWNPNrlTN7Cim9OzjQG2ByaNab_fipnsGXcblMuNcwVst2sZwgY23guuBFWMI0dGTugSE_F44ayA9V7EVs";
const IMG_DENIM =
  "https://lh3.googleusercontent.com/aida/AEtjO1VZFGAF20LCOV1QXdhtNxhydXUSDcVQbN3g_RGl_JLEtVj2F-7RbNQ2aJgOPQtKDi87ii4J1r4VFM9q31P20XeLSrAIxrfTtvrJV6uks_Ck36Ah4RC39jBV8zL2OdURjaMM11AE26HyeSZM1qJBkMpFnjsLQ_9grVzifAyt6-BwjQOz7IP7SlWRV_a_B--rmzv3J0O62UG0wkHdYd6xxKuoVDQFeisgKy6yiGtcaZpq4QbDeLUqMI8miL0";
const IMG_CARGO_SET =
  "https://lh3.googleusercontent.com/aida/AEtjO1X14Ge7JzgTfg_YnNkpFzA4834yb99ZXiZ9TwB8TztYn6KecTnsfPoYJxz3CUJhXW_UmJ7vGG3K-rh_frcLUFty_JtXWUZBzrgmBwLzqvxU9A94Zd_X2cpji1SpuHUb6wA4z5ZEyfelbHZYk3KxrzfKG15CM5eS-YR_p29p9_iTTGwmbRGYCqJvJb-vIcXLmeKfzDYmPkC15JFuB8U744GArFo3VkzOm4uuZIXU379rnFqR7VnkR6GAMy0";
const IMG_JACKET =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAX2dOlNhOQer59jo-Zmer7ytJ6Gegx7TRUY8RjCSQMSqKBw3p7h0RbTubp4yqadvCHrdRf8B1KSsg9XI5gryiy-e9_eq2MPH9DjC2LbQLMpJ35J0YLydAA2dkzp-xr1y0ZRUTd9Y21yWJvzOIAFMecQogJ59M0FUlHgUg8ZNCGz5KGZ1XMqPOOvKMMDS-StjfqgadcMZ7XlKuhyUtKXEEzB8TmE4s0XCKfdZmcfTe_CTM3Yckee-z5";
const IMG_JOGGER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-xwoPwBsMQnAnWZUQ-txbgUNDwH66Nv5OfWnB5i83AI_2Gto6xiDaCyXXxniSewQQl3z5iL5CEQAgkmPPXEh6iuwFBaQR5k0BdUwrkse345c8gsRFt4HYqDfZUA6kWFRXftqb70-1mFvV1u3UNPYZQiwNrx0jo9oIJWVT2tTSgD2cTwpqTpZPxHqasmIqy3qcKMAUo1T_iUe--I-4nGU4kC8b5xemd02ESMQZbyE6GY1QzOZcOKf";
const IMG_POUCH =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBSARkbnG2Z-pWF4rnf8Jit2XQZDdAKFfB-O-tjZoZpPXRWPH4G7jZ375MzBpnWHiTB6jyfYq0TYJ2lgYGTPZCWPB2kezdVT8AV7r_RpKSz2kUyDQhVNxFWmpVd9DKQetXJDTVsG0X99xtABHy1yscKEmLLdHNuhejlhBVuJagIvSD4Qh6Rv4sLap8xyWLaLt4oPrKKGiTvhYlFDsapOfBndri1OQQ5DrPj3KowuRkQiy6_2ZdbWPt0";
const IMG_NAVY =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkBAEbLYmao4PRZUBu8OU6Dwe5jC67fNhJM6BqQ_8Qsr4h7Qa_yUDCO0RqQkHuG9Miw2eOE0T0Xessv4akzfMOZvacCOMFkGTGJQZ0vP10Zwxn9jmoSXQVSt3FpAYxUrc5YR3gat82Y9zWy2q3UaAU_uuFUNxUUY9n-qrorNiWPwH7JDe2pNqAneb1A2jDbVjsJdsS0IuL7ROOcDPci2yBjxtEzGa450WYHz7nNoSjkRUd0kwPBwgV";
const IMG_CHARCOAL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAHpD1pRMSk6m4vHHWG5whVsEyUVL-itrqzqZ7Dpn4dM_CB8NtEkkEjK_WWrJz7T0BewmJD0ZCgZpjUcI-JJl4YHxjT5W_FKvJ9B34wJgobrfYeR2P5GovWbKH2GOEjpzJukTSBGgrUTFG-mMEHvL9b6pqImK_TH5WYhKGLOHI2BX2mtif42neu1BU7v3OgahHMsmQFK8NQrezypJl2YMnkAybjduHNm8HSviiY4EPveiybEjMdMEVU";
const IMG_EVERYDAY =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-6zhL61Fow1fwb1b5R0PF7lL3M5wQCaoABZLd45LFLWXkrz67wPwG_H1sW8AY8jDEWBexZ2nhRODd0WrWwMoLlKKrTpYYqzY8DtUcxk1lNXe4kcNALmm8dQIlq5yZjTzit77Lq7aniDsycjaFtsRTS4dUUripMWqlFThQHrMkJ9QsamIDqQZc8VepOPR39KQrjS4Neuy-iSsPVzkOKilXeiKHhQGHcgnYdcDhZmaDucyqFo_IYWUC";
const IMG_SUN =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAB6DyeIwbcZRolzieZInYxMOfqkf6XICCQGeTEK_Lh8kUk8EOKdb-JZTyr4Z5C4sDLvEt-AAQ-NIAgGgDzEx7QDn3dhWnRkD3oZY5CUexLvGmpNMkVgynTgews4EFmFAccqjMyNWfSB3dAgDXRtSbDu_lPVoYCOTkXcJLyucnEL3lwAvqELdvPzvVZczZOmjcsLL8p1IlIaGi4eROyqLUsA9GD9KyGhoT_xyhh-Yvb_5mC1RnSss_k";

export const COLLECTIONS: Collection[] = [
  {
    slug: "streetwear-tracksuits",
    name: "Signature Streetwear & Tracksuits",
    edition: "Capsule 01 • Aba Atelier Drop • 2026 Edition",
    description:
      "Tailored luxury streetwear crafted in Aba, Abia State from heavy brushed cotton fleece, varsity chenille embroidery, and relaxed cuts designed for active young dreamers across Nigeria.",
    ageRange: "2Y – 12Y",
    fromPrice: 9500,
    origin: "Aba, Nigeria",
    heroImage: IMG_TRACKSUIT,
    heroLabel: "Signature 3-Piece Sand Suite",
    heroPrice: 25000,
    filters: [
      { id: "all", label: "All Pieces" },
      { id: "tracksuits", label: "Tracksuit Sets" },
      { id: "jackets", label: "Statement Jackets" },
      { id: "joggers", label: "Streetwear Joggers" },
      { id: "accessories", label: "Matching Headwear" },
    ],
    products: [
      {
        slug: "signature-up-down-tracksuit-set",
        name: "Signature Up & Down Tracksuit Set",
        price: 25000,
        colour: "Sand Dune Beige",
        description:
          "Heavy cotton fleece jacket with matching patch joggers and relaxed ribbed collar.",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
        imageUrl: IMG_TRACKSUIT,
        category: "tracksuits",
      },
      {
        slug: "aura-chenille-bomber-track-jacket",
        name: "Aura Chenille Bomber Track Jacket",
        price: 18500,
        colour: "Sand Dune / Cream",
        description:
          "Standalone bomber with heavy gauge zip, tactile arm patch, and ultra-soft neck ribbing.",
        sizes: ["2-4Y", "5-7Y", "8-10Y"],
        imageUrl: IMG_JACKET,
        category: "jackets",
        badge: "New Drop",
      },
      {
        slug: "aura-utility-jogger-pants",
        name: "Aura Utility Jogger Pants",
        price: 14000,
        colour: "Sand Dune Beige",
        description:
          "Ergonomic knee darting, extra-deep kid pockets, and heavy-duty double needle seam reinforcement.",
        sizes: ["2-3Y", "4-5Y", "6-8Y", "9-12Y"],
        imageUrl: IMG_JOGGER,
        category: "joggers",
      },
      {
        slug: "aura-pouch-beanie-ribbed-set",
        name: "Aura Pouch & Beanie Ribbed Set",
        price: 9500,
        colour: "Matching Sand Dune",
        description:
          "Soft ribbed knit beanie with miniature crossbody zip pouch for essentials and small play treasures.",
        sizes: ["One Size (Elastic)"],
        imageUrl: IMG_POUCH,
        category: "accessories",
      },
      {
        slug: "midnight-navy-signature-set",
        name: "Midnight Navy Signature Set",
        price: 25000,
        colour: "Deep Navy / White Chenille",
        description:
          "Deep navy tone paired with crisp white chenille varsity lettering and plush interior loopback knit.",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "10-12Y"],
        imageUrl: IMG_NAVY,
        category: "tracksuits",
      },
      {
        slug: "slate-charcoal-two-piece-set",
        name: "Slate Charcoal Two-Piece Set",
        price: 25000,
        colour: "Washed Charcoal Grey",
        description:
          "Vintage washed charcoal heavy fleece with muted ton-sur-ton embroidery and tailored slim cuff.",
        sizes: ["4-5Y", "6-7Y", "8-9Y", "10-12Y"],
        imageUrl: IMG_CHARCOAL,
        category: "tracksuits",
      },
    ],
  },
  {
    slug: "everyday-essentials",
    name: "Playground & Everyday Essentials",
    edition: "Capsule 02 • Aba Atelier Drop • 2026 Edition",
    description:
      "Breathable, ultra-soft combed cotton pieces built to survive tumbling, running, and all-day adventures while staying effortlessly crisp.",
    ageRange: "2Y – 12Y",
    fromPrice: 12000,
    origin: "Aba, Nigeria",
    heroImage: IMG_EVERYDAY,
    heroLabel: "Everyday Essentials Capsule",
    heroPrice: 15000,
    filters: [
      { id: "all", label: "All Pieces" },
      { id: "tees", label: "Tees & Polos" },
      { id: "sets", label: "Comfort Sets" },
    ],
    products: [
      {
        slug: "california-ringer-tee",
        name: "California Ringer Tee",
        price: 15000,
        colour: "Cream / Navy Ringer",
        description:
          "Premium vintage cream ringer tee with retro golden typography and contrasting trim.",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-10Y", "11-12Y"],
        imageUrl: IMG_TEE,
        category: "tees",
        badge: "New Arrival",
      },
      {
        slug: "california-state-vintage-polo",
        name: "California State Vintage Polo",
        price: 15000,
        colour: "Cream / Navy Collar",
        description:
          "Contrasting navy collar cream cotton polo with fine stitch details and airy breathability.",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-11Y"],
        imageUrl: IMG_TEE,
        category: "tees",
      },
      {
        slug: "playground-romper-set",
        name: "Playground Romper Set",
        price: 18000,
        colour: "Warm Oatmeal",
        description:
          "One-piece romper with snap buttons and a matching soft cotton cap for breezy playdays.",
        sizes: ["6-12M", "1-2Y", "2-3Y"],
        imageUrl: IMG_EVERYDAY,
        category: "sets",
      },
      {
        slug: "everyday-biker-shorts-set",
        name: "Everyday Biker Shorts Set",
        price: 13000,
        colour: "Cream / Sand",
        description:
          "Stretch cotton biker shorts paired with a relaxed tee for all-day comfort.",
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        imageUrl: IMG_TEE,
        category: "sets",
      },
    ],
  },
  {
    slug: "utility-denim-cargo",
    name: "Utility Denim & Cargo Series",
    edition: "Capsule 03 • Aba Atelier Drop • 2026 Edition",
    description:
      "Reinforced tactical pockets, flexible elastane-cotton blend, and durable triple stitching made for active explorers who like a modern silhouette.",
    ageRange: "4Y – 12Y",
    fromPrice: 17000,
    origin: "Aba, Nigeria",
    heroImage: IMG_DENIM,
    heroLabel: "Utility Denim Capsule",
    heroPrice: 17000,
    filters: [
      { id: "all", label: "All Pieces" },
      { id: "denim", label: "Denim Bottoms" },
      { id: "jackets", label: "Cargo Jackets" },
    ],
    products: [
      {
        slug: "denim-cargo-utility-jeans",
        name: "Denim Cargo Utility Jeans",
        price: 17000,
        colour: "Washed Dark Charcoal",
        description:
          "Washed dark charcoal denim trousers with flap cargo utility pockets and comfortable elastic waist.",
        sizes: ["4-5Y", "6-7Y", "8-10Y", "11-12Y"],
        imageUrl: IMG_DENIM,
        category: "denim",
      },
      {
        slug: "urban-cargo-street-trousers",
        name: "Urban Cargo Street Trousers",
        price: 17000,
        colour: "Washed Black",
        description:
          "Reinforced knee stitching, relaxed fit washed black denim with adjustable interior waistband.",
        sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
        imageUrl: IMG_DENIM,
        category: "denim",
      },
      {
        slug: "cargo-track-jacket",
        name: "Cargo Track Jacket",
        price: 21000,
        colour: "Slate Grey",
        description:
          "Multi-pocket structured jacket with enzyme-washed finish and utility detailing.",
        sizes: ["4-5Y", "6-7Y", "8-10Y"],
        imageUrl: IMG_JACKET,
        category: "jackets",
      },
      {
        slug: "cargo-dungarees",
        name: "Cargo Dungarees",
        price: 19500,
        colour: "Charcoal Wash",
        description:
          "Multi-pocket dungarees with adjustable straps and durable triple-stitched seams.",
        sizes: ["3-4Y", "5-6Y", "7-8Y"],
        imageUrl: IMG_DENIM,
        category: "denim",
      },
    ],
  },
  {
    slug: "sun-neutral-sets",
    name: "Sun & Neutral Sets",
    edition: "Capsule 04 • Aba Atelier Drop • 2026 Edition",
    description:
      "Earth-toned coords and versatile separates that mix and match effortlessly for breezy tropical daytime styling and cozy evening layers.",
    ageRange: "3Y – 10Y",
    fromPrice: 20000,
    origin: "Aba, Nigeria",
    heroImage: IMG_SUN,
    heroLabel: "Sun & Neutral Capsule",
    heroPrice: 22000,
    filters: [
      { id: "all", label: "All Pieces" },
      { id: "sets", label: "Coord Sets" },
      { id: "accessories", label: "Accessories" },
    ],
    products: [
      {
        slug: "beige-cargo-jogger-shorts-set",
        name: "Beige Cargo Jogger & Shorts Set",
        price: 22000,
        colour: "Neutral Tan",
        description:
          "Minimalist neutral tan streetwear jogger combo with utility crossbody bag and knit beanie.",
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        imageUrl: IMG_CARGO_SET,
        category: "sets",
      },
      {
        slug: "tan-cargo-shorts",
        name: "Tan Cargo Shorts",
        price: 12000,
        colour: "Warm Tan",
        description:
          "Lightweight cargo shorts with deep side pockets for sunny-day adventures.",
        sizes: ["3-4Y", "5-6Y", "7-8Y"],
        imageUrl: IMG_CARGO_SET,
        category: "sets",
      },
      {
        slug: "neutral-crossbody-pouch",
        name: "Neutral Crossbody Pouch",
        price: 9000,
        colour: "Sand Beige",
        description:
          "Miniature canvas crossbody pouch with embroidered emblem for little treasures.",
        sizes: ["One Size (Adjustable)"],
        imageUrl: IMG_POUCH,
        category: "accessories",
      },
      {
        slug: "knit-beanie",
        name: "Knit Beanie",
        price: 8000,
        colour: "Sand Beige",
        description:
          "Soft ribbed knit beanie in earth tone for cozy evening layers.",
        sizes: ["One Size (Elastic)"],
        imageUrl: IMG_POUCH,
        category: "accessories",
      },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}
