export interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  specifications: {
    material: string;
    texture: string;
    closureType: string;
    hardware: string;
    compartments: string[];
    shoulderDrop?: string;
    capacity?: string;
    dimensions?: string;
    idealFor: string;
  };
  features?: string[];
  colors?: Array<{
    name: string;
    value: string;
    available: boolean;
  }>;
  sections?: string[]; // Array of section IDs where this product should appear
}

export const products: Product[] = [
  // VISTARA TOTE - Teal Blue
  {
    id: "vistara-tote-teal-blue",
    name: "VISTARA TOTE",
    category: "Tote Bag",
    color: "Teal Blue",
    price: 4999,
    rating: 4.9,
    reviews: 12,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00539.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00547.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00548.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00554.jpg"
    ],
    description: "VISTARA. Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style. Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper top",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One Main Compartment with Flap and Top Zipper",
        "Padded laptop sleeve",
        "Inner zip pocket",
        "Organizer slip pockets"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 14–16 Liters – fits laptop, diary, wallet, makeup pouch, charger, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality"
    },
    features: [
      "V-shape stitching pattern for bold aesthetic",
      "Structured design maintains shape",
      "Multiple compartments for organization",
      "Gold-tone hardware accents",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha ", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTARA TOTE - Mint Green
  {
    id: "vistara-tote-mint-green",
    name: "VISTARA TOTE",
    category: "Tote Bag",
    color: "Mint Green",
    price: 4999,
    rating: 4.9,
    reviews: 12,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/09-10-2025--livia00572.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/09-10-2025--livia00586.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mint%20Green/09-10-2025--livia00608.jpg"
    ],
    description: "VISTARA (means 'expanse', also hints at the V-shape). Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style. Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper top",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One Main Compartment with Flap and Top Zipper",
        "Padded laptop sleeve",
        "Inner zip pocket",
        "Organizer slip pockets"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 14–16 Liters – fits laptop, diary, wallet, makeup pouch, charger, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality"
    },
    features: [
      "V-shape stitching pattern for bold aesthetic",
      "Structured design maintains shape",
      "Multiple compartments for organization",
      "Gold-tone hardware accents",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha ", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTARA TOTE - Mocha 
  {
    id: "vistara-tote-mocha-tan",
    name: "VISTARA TOTE",
    category: "Tote Bag",
    color: "Mocha",
    price: 4999,
    rating: 4.9,
    reviews: 12,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/09-10-2025--livia00473.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/09-10-2025--livia00487.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/09-10-2025--livia00489.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Mocha%20Tan/09-10-2025--livia00500.jpg"
    ],
    description: "VISTARA. Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style. Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper top",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One Main Compartment with Flap and Top Zipper",
        "Padded laptop sleeve",
        "Inner zip pocket",
        "Organizer slip pockets"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 14–16 Liters – fits laptop, diary, wallet, makeup pouch, charger, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality"
    },
    features: [
      "V-shape stitching pattern for bold aesthetic",
      "Structured design maintains shape",
      "Multiple compartments for organization",
      "Gold-tone hardware accents",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTARA TOTE - Milky Blue
  {
    id: "vistara-tote-milky-blue",
    name: "VISTARA TOTE",
    category: "Tote Bag",
    color: "Milky Blue",
    price: 4999,
    rating: 4.9,
    reviews: 12,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00507.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00515.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00537.jpg"
    ],
    description: "VISTARA (means 'expanse', also hints at the V-shape). Bold. Stylish. Limitless. With its striking V-shape pattern and chic structured body, Vistara brings a fresh vibe to everyday fashion. A bag that's as versatile as you are — from work to weekends, it's your go-to trendsetter. Carry Vistara and own the expanse of possibilities in style. Designed for the modern woman who values elegance and confidence, it balances sophistication with everyday functionality — a true luxury statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper top",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One Main Compartment with Flap and Top Zipper",
        "Padded laptop sleeve",
        "Inner zip pocket",
        "Organizer slip pockets"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 14–16 Liters – fits laptop, diary, wallet, makeup pouch, charger, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Office, meetings, and day-to-evening transitions – a perfect power tote combining elegance with functionality"
    },
    features: [
      "V-shape stitching pattern for bold aesthetic",
      "Structured design maintains shape",
      "Multiple compartments for organization",
      "Gold-tone hardware accents",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // PRIZMA SLING - Teal Blue
  {
    id: "prizma-sling-teal-blue",
    name: "PRIZMA SLING",
    category: "Sling Bag",
    color: "Teal Blue",
    price: 3999,
    rating: 4.8,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/05.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/09-10-2025--livia00834.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/09-10-2025--livia00838.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/09-10-2025--livia00840.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Teal%20Blue/09-10-2025--livia00852.jpg"
    ],
    description: "PRIZMA – Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it's built for the confident woman who loves to stand out. Carry Prizma and shine at every angle.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Square metallic push-lock (gold finish)",
      hardware: "Gold-Tone Accents",
      compartments: [
        "Main compartment (spacious enough for essentials)",
        "Internal zipper pocket",
        "Slip pocket for phone/cards"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Approx. 4–5 Liters – perfect for essentials like wallet, phone, sunglasses, and small accessories",
      idealFor: "Evening outings, brunch, parties, and as a chic companion to formal or festive wear"
    },
    features: [
      "Geometric prism-inspired design",
      "Square metallic push-lock closure",
      "Adjustable crossbody strap",
      "Compact yet spacious interior",
      "Gold-tone hardware accents"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // PRIZMA SLING - Mint Green
  {
    id: "prizma-sling-mint-green",
    name: "PRIZMA SLING",
    category: "Sling Bag",
    color: "Mint Green",
    price: 3999,
    rating: 4.8,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/09-10-2025--livia00862.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/09-10-2025--livia00866.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/09-10-2025--livia00870.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mint%20Green/09-10-2025--livia00871.jpg"
    ],
    description: "PRIZMA – Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it's built for the confident woman who loves to stand out. Carry Prizma and shine at every angle.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Square metallic push-lock (gold finish)",
      hardware: "Gold-Tone Accents",
      compartments: [
        "Main compartment (spacious enough for essentials)",
        "Internal zipper pocket",
        "Slip pocket for phone/cards"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Approx. 4–5 Liters – perfect for essentials like wallet, phone, sunglasses, and small accessories",
      idealFor: "Evening outings, brunch, parties, and as a chic companion to formal or festive wear"
    },
    features: [
      "Geometric prism-inspired design",
      "Square metallic push-lock closure",
      "Adjustable crossbody strap",
      "Compact yet spacious interior",
      "Gold-tone hardware accents"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // PRIZMA SLING - Mocha
  {
    id: "prizma-sling-mocha-tan",
    name: "PRIZMA SLING",
    category: "Sling Bag",
    color: "Mocha",
    price: 3999,
    rating: 4.8,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/05.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/09-10-2025--livia00776.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/09-10-2025--livia00781.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/09-10-2025--livia00783.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20-%20Mocha%20Tan/09-10-2025--livia00793.jpg"
    ],
    description: "PRIZMA – Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it's built for the confident woman who loves to stand out. Carry Prizma and shine at every angle.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Square metallic push-lock (gold finish)",
      hardware: "Gold-Tone Accents",
      compartments: [
        "Main compartment (spacious enough for essentials)",
        "Internal zipper pocket",
        "Slip pocket for phone/cards"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Approx. 4–5 Liters – perfect for essentials like wallet, phone, sunglasses, and small accessories",
      idealFor: "Evening outings, brunch, parties, and as a chic companion to formal or festive wear"
    },
    features: [
      "Geometric prism-inspired design",
      "Square metallic push-lock closure",
      "Adjustable crossbody strap",
      "Compact yet spacious interior",
      "Gold-tone hardware accents"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // PRIZMA SLING - Milky Blue
  {
    id: "prizma-sling-milky-blue",
    name: "PRIZMA SLING",
    category: "Sling Bag",
    color: "Milky Blue",
    price: 3999,
    rating: 4.8,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/09-10-2025--livia00802.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/09-10-2025--livia00806.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/09-10-2025--livia00811.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/PRIZMA%20SLING(%20png%20)/PRIZMA%20SLING%20png%20(milky%20blue%20)/09-10-2025--livia00814.jpg"
    ],
    description: "PRIZMA – Inspired by the brilliance of a prism, this bag reflects bold geometry and refined craftsmanship. Bold. Modern. Unstoppable. With its striking geometric cuts and chic golden hardware, Prizma redefines street-smart luxury. A bag that pairs perfectly with work looks or weekend vibes, it's built for the confident woman who loves to stand out. Carry Prizma and shine at every angle.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Square metallic push-lock (gold finish)",
      hardware: "Gold-Tone Accents",
      compartments: [
        "Main compartment (spacious enough for essentials)",
        "Internal zipper pocket",
        "Slip pocket for phone/cards"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Approx. 4–5 Liters – perfect for essentials like wallet, phone, sunglasses, and small accessories",
      idealFor: "Evening outings, brunch, parties, and as a chic companion to formal or festive wear"
    },
    features: [
      "Geometric prism-inspired design",
      "Square metallic push-lock closure",
      "Adjustable crossbody strap",
      "Compact yet spacious interior",
      "Gold-tone hardware accents"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTAPACK - Teal Blue
  {
    id: "vistapack-teal-blue",
    name: "VISTAPACK",
    category: "Backpack",
    color: "Teal Blue",
    price: 4499,
    rating: 4.9,
    reviews: 18,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/09-10-2025--livia00357.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/09-10-2025--livia00363.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/09-10-2025--livia00371.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Teal%20Blue/09-10-2025--livia00386.jpg"
    ],
    description: "VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Main top zipper closure with Front Flap Pocket: Envelope-style pocket for quick essentials",
      hardware: "Gold-Tone Accents",
      compartments: [
        "1 padded compartment (fits iPad / small tablet, up to 11\")",
        "1 zipper pocket",
        "2 slip pockets (cards, phone, keys)"
      ],
      shoulderDrop: "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
      capacity: "Approx. 10–12 Liters",
      dimensions: "Height: 28 cm",
      idealFor: "College, casual workdays, city travel, and leisure outings"
    },
    features: [
      "Chevron-inspired stitching pattern",
      "Structured leather silhouette",
      "Padded tablet compartment",
      "Ergonomic adjustable straps",
      "Front envelope-style pocket"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTAPACK - Mint Green
  {
    id: "vistapack-mint-green",
    name: "VISTAPACK",
    category: "Backpack",
    color: "Mint Green",
    price: 4499,
    rating: 4.9,
    reviews: 18,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/09-10-2025--livia00450.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/09-10-2025--livia00452.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/09-10-2025--livia00458.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mint%20Green/09-10-2025--livia00465.jpg"
    ],
    description: "VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Main top zipper closure with Front Flap Pocket: Envelope-style pocket for quick essentials",
      hardware: "Gold-Tone Accents",
      compartments: [
        "1 padded compartment (fits iPad / small tablet, up to 11\")",
        "1 zipper pocket",
        "2 slip pockets (cards, phone, keys)"
      ],
      shoulderDrop: "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
      capacity: "Approx. 10–12 Liters",
      dimensions: "Height: 28 cm",
      idealFor: "College, casual workdays, city travel, and leisure outings"
    },
    features: [
      "Chevron-inspired stitching pattern",
      "Structured leather silhouette",
      "Padded tablet compartment",
      "Ergonomic adjustable straps",
      "Front envelope-style pocket"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTAPACK - Mocha Tan
  {
    id: "vistapack-mocha-tan",
    name: "VISTAPACK",
    category: "Backpack",
    color: "Mocha Tan",
    price: 4499,
    rating: 4.9,
    reviews: 18,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/09-10-2025--livia00390.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/09-10-2025--livia00394.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/09-10-2025--livia00398.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Mocha%20Tan/09-10-2025--livia00402.jpg"
    ],
    description: "VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Main top zipper closure with Front Flap Pocket: Envelope-style pocket for quick essentials",
      hardware: "Gold-Tone Accents",
      compartments: [
        "1 padded compartment (fits iPad / small tablet, up to 11\")",
        "1 zipper pocket",
        "2 slip pockets (cards, phone, keys)"
      ],
      shoulderDrop: "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
      capacity: "Approx. 10–12 Liters",
      dimensions: "Height: 28 cm",
      idealFor: "College, casual workdays, city travel, and leisure outings"
    },
    features: [
      "Chevron-inspired stitching pattern",
      "Structured leather silhouette",
      "Padded tablet compartment",
      "Ergonomic adjustable straps",
      "Front envelope-style pocket"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTAPACK - Milky Blue
  {
    id: "vistapack-milky-blue",
    name: "VISTAPACK",
    category: "Backpack",
    color: "Milky Blue",
    price: 4499,
    rating: 4.9,
    reviews: 18,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Milky%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Milky%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Milky%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK%20-%20Milky%20Blue/04.png"
    ],
    description: "VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Main top zipper closure with Front Flap Pocket: Envelope-style pocket for quick essentials",
      hardware: "Gold-Tone Accents",
      compartments: [
        "1 padded compartment (fits iPad / small tablet, up to 11\")",
        "1 zipper pocket",
        "2 slip pockets (cards, phone, keys)"
      ],
      shoulderDrop: "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
      capacity: "Approx. 10–12 Liters",
      dimensions: "Height: 28 cm",
      idealFor: "College, casual workdays, city travel, and leisure outings"
    },
    features: [
      "Chevron-inspired stitching pattern",
      "Structured leather silhouette",
      "Padded tablet compartment",
      "Ergonomic adjustable straps",
      "Front envelope-style pocket"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // SANDESH LAPTOP BAG - Teal Blue
  {
    id: "sandesh-laptop-bag-teal-blue",
    name: "SANDESH LAPTOP BAG",
    category: "Laptop Bag",
    color: "Teal Blue",
    price: 6499,
    rating: 4.9,
    reviews: 10,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00630.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00633.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00637.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Teal%20Blue/09-10-2025--livia00649.jpg"
    ],
    description: "Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between. From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper for secure storage",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One main padded compartment (fits 14\"–15.6\" laptop)",
        "One front envelope-style pocket for documents/tablet",
        "Internal zipper pocket + slip pockets for phone & cards"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity"
    },
    features: [
      "Envelope-inspired geometric design",
      "Padded laptop compartment (14-15.6 inches)",
      "Front document pocket",
      "Magnetic flap with concealed zipper",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // SANDESH LAPTOP BAG - Mint Green
  {
    id: "sandesh-laptop-bag-mint-green",
    name: "SANDESH LAPTOP BAG",
    category: "Laptop Bag",
    color: "Mint Green",
    price: 6499,
    rating: 4.9,
    reviews: 10,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/09-10-2025--livia00662.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/09-10-2025--livia00669.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/09-10-2025--livia00677.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mint%20Green/09-10-2025--livia00688.jpg"
    ],
    description: "Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between. From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper for secure storage",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One main padded compartment (fits 14\"–15.6\" laptop)",
        "One front envelope-style pocket for documents/tablet",
        "Internal zipper pocket + slip pockets for phone & cards"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity"
    },
    features: [
      "Envelope-inspired geometric design",
      "Padded laptop compartment (14-15.6 inches)",
      "Front document pocket",
      "Magnetic flap with concealed zipper",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // SANDESH LAPTOP BAG - Mocha Tan
  {
    id: "sandesh-laptop-bag-mocha-tan",
    name: "SANDESH LAPTOP BAG",
    category: "Laptop Bag",
    color: "Mocha Tan",
    price: 6499,
    rating: 4.9,
    reviews: 10,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/09-10-2025--livia00690.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/09-10-2025--livia00690.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/09-10-2025--livia00703.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Mocha%20Tan/09-10-2025--livia00727.jpg"
    ],
    description: "Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between. From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper for secure storage",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One main padded compartment (fits 14\"–15.6\" laptop)",
        "One front envelope-style pocket for documents/tablet",
        "Internal zipper pocket + slip pockets for phone & cards"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity"
    },
    features: [
      "Envelope-inspired geometric design",
      "Padded laptop compartment (14-15.6 inches)",
      "Front document pocket",
      "Magnetic flap with concealed zipper",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // SANDESH LAPTOP BAG - Milky Blue
  {
    id: "sandesh-laptop-bag-milky-blue",
    name: "SANDESH LAPTOP BAG",
    category: "Laptop Bag",
    color: "Milky Blue",
    price: 6499,
    rating: 4.9,
    reviews: 10,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/09-10-2025--livia00728%20-%20Copy.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/09-10-2025--livia00728%20-%20Copy.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/09-10-2025--livia00760%20-%20Copy.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20LAPTOP%20BAG%20(%20png%20)%202/SANDESH%20LAPTOP%20BAG%20-%20Milky%20Blue/09-10-2025--livia00765%20-%20Copy.jpg"
    ],
    description: "Sandesh Laptop Bag – Carry Your Story. Own Your Style. Inspired by the timeless shape of an envelope, Sandesh blends tradition with trend. Its sharp geometric front and sleek silhouette make it a bold fashion statement, while the smartly designed laptop compartment keeps you ready for work, play, and everything in between. From café catch-ups to boardroom meetings, Sandesh is more than a bag — it's your message to the world.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Magnetic Flap with concealed zipper for secure storage",
      hardware: "Gold-Tone Accents",
      compartments: [
        "One main padded compartment (fits 14\"–15.6\" laptop)",
        "One front envelope-style pocket for documents/tablet",
        "Internal zipper pocket + slip pockets for phone & cards"
      ],
      shoulderDrop: "Detachable long strap (adjustable 50–60 cm) + top handle (8–10 cm drop)",
      capacity: "Approx. 12–14 Liters – fits laptop, diary, charger, wallet, phone, and daily essentials",
      dimensions: "Height: 28 cm",
      idealFor: "Professionals, students, and style-conscious users who want a luxury laptop bag with a bold geometric identity"
    },
    features: [
      "Envelope-inspired geometric design",
      "Padded laptop compartment (14-15.6 inches)",
      "Front document pocket",
      "Magnetic flap with concealed zipper",
      "Detachable adjustable strap"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // LEKHA WALLET (Clutch) - Teal Blue
  {
    id: "lekha-wallet-teal-blue",
    name: "LEKHA WALLET",
    category: "Clutch",
    color: "Teal Blue",
    price: 2199,
    rating: 4.7,
    reviews: 22,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/09-10-2025--livia00964.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/09-10-2025--livia00969.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/09-10-2025--livia00974.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Teal%20Blue/09-10-2025--livia00978.jpg"
    ],
    description: "Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Zip-Around Closure with envelope-style panel design",
      hardware: "Gold-Tone Accents (zipper puller & trims)",
      compartments: [
        "2 main cash compartments",
        "1 center zipper pocket for coins",
        "6–8 card slots",
        "2 slip pockets for bills/receipts"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)",
      idealFor: "Everyday use, evening outings, and as a stylish companion for both casual and professional looks"
    },
    features: [
      "Envelope-inspired geometric design",
      "Zip-around closure for security",
      "Multiple card slots and compartments",
      "Detachable wrist strap",
      "Compact yet spacious interior"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // LEKHA WALLET (Clutch) - Mint Green
  {
    id: "lekha-wallet-mint-green",
    name: "LEKHA WALLET",
    category: "Clutch",
    color: "Mint Green",
    price: 2199,
    rating: 4.7,
    reviews: 22,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/09-10-2025--livia00984.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/09-10-2025--livia00993.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/09-10-2025--livia00997.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mint%20Green/09-10-2025--livia00999.jpg"
    ],
    description: "Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Zip-Around Closure with envelope-style panel design",
      hardware: "Gold-Tone Accents (zipper puller & trims)",
      compartments: [
        "2 main cash compartments",
        "1 center zipper pocket for coins",
        "6–8 card slots",
        "2 slip pockets for bills/receipts"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)",
      idealFor: "Everyday use, evening outings, and as a stylish companion for both casual and professional looks"
    },
    features: [
      "Envelope-inspired geometric design",
      "Zip-around closure for security",
      "Multiple card slots and compartments",
      "Detachable wrist strap",
      "Compact yet spacious interior"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // LEKHA WALLET (Clutch) - Mocha Tan
  {
    id: "lekha-wallet-mocha-tan",
    name: "LEKHA WALLET",
    category: "Clutch",
    color: "Mocha Tan",
    price: 2199,
    rating: 4.7,
    reviews: 22,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/09-10-2025--livia00916.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/09-10-2025--livia00927.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/09-10-2025--livia00932.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/09-10-2025--livia00932.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Mocha%20Tan/09-10-2025--livia00937.jpg"
    ],
    description: "Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Zip-Around Closure with envelope-style panel design",
      hardware: "Gold-Tone Accents (zipper puller & trims)",
      compartments: [
        "2 main cash compartments",
        "1 center zipper pocket for coins",
        "6–8 card slots",
        "2 slip pockets for bills/receipts"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)",
      idealFor: "Everyday use, evening outings, and as a stylish companion for both casual and professional looks"
    },
    features: [
      "Envelope-inspired geometric design",
      "Zip-around closure for security",
      "Multiple card slots and compartments",
      "Detachable wrist strap",
      "Compact yet spacious interior"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // LEKHA WALLET (Clutch) - Milky Blue
  {
    id: "lekha-wallet-milky-blue",
    name: "LEKHA WALLET",
    category: "Clutch",
    color: "Milky Blue",
    price: 2199,
    rating: 4.7,
    reviews: 22,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/09-10-2025--livia00940.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/09-10-2025--livia00945.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/09-10-2025--livia00952.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/lekha%20wallet%20(%20clutch)%203/LEKHA%20WALLET%20-%20Milky%20Blue/09-10-2025--livia00962.jpg"
    ],
    description: "Lekha Wallet – Write Your Style. Inspired by the lines of an envelope, Lekha (meaning writing / record in Sanskrit & Hindi) is a blend of heritage and trend. With its chic geometric cuts, soft leather touch, and vibrant color story, Lekha adds a bold pop to your everyday carry. Compact yet spacious, it's designed to hold more than just essentials — it holds your statement.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Zip-Around Closure with envelope-style panel design",
      hardware: "Gold-Tone Accents (zipper puller & trims)",
      compartments: [
        "2 main cash compartments",
        "1 center zipper pocket for coins",
        "6–8 card slots",
        "2 slip pockets for bills/receipts"
      ],
      shoulderDrop: "26 cm (adjustable strap included)",
      capacity: "Designed to hold cash, coins, cards, and small essentials (Approx. 1.5–2 Liters)",
      idealFor: "Everyday use, evening outings, and as a stylish companion for both casual and professional looks"
    },
    features: [
      "Envelope-inspired geometric design",
      "Zip-around closure for security",
      "Multiple card slots and compartments",
      "Detachable wrist strap",
      "Compact yet spacious interior"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Milky Blue", value: "#B8D4E8.jpg", available: true }
    ]
  },
  // VISTAPACK - Green
  {
    id: "vistapack-green",
    name: "VISTAPACK",
    category: "Backpack",
    color: "Green",
    price: 4499,
    rating: 4.9,
    reviews: 18,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/png_1.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/png_2.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/png_3.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/png_4.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/09-10-2025--livia00421.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/09-10-2025--livia00427.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/09-10-2025--livia00439.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/png%20(VISTAPACK%20)/VISTAPACK(%20green%20)/09-10-2025--livia00445.jpg"
    ],
    description: "VISTAPACK – Where Structure Meets Style. Step into a world of effortless charm with the VISTAPACK, a modern emblem of strength, style, and versatility. Defined by its bold chevron-inspired stitching and structured leather silhouette, this backpack whispers stories of movement, freedom, and self-expression. Designed to carry both your essentials and your spirit with ease, it is more than just a bag—it is a companion for journeys, both near and far.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Main top zipper closure with Front Flap Pocket: Envelope-style pocket for quick essentials",
      hardware: "Gold-Tone Accents",
      compartments: [
        "1 padded compartment (fits iPad / small tablet, up to 11\")",
        "1 zipper pocket",
        "2 slip pockets (cards, phone, keys)"
      ],
      shoulderDrop: "Adjustable 90 – 130 cm (works for both shoulder carry and crossbody)",
      capacity: "Approx. 10–12 Liters",
      dimensions: "Height: 28 cm",
      idealFor: "College, casual workdays, city travel, and leisure outings"
    },
    features: [
      "Chevron-inspired stitching pattern",
      "Structured leather silhouette",
      "Padded tablet compartment",
      "Ergonomic adjustable straps",
      "Front envelope-style pocket"
    ],
    colors: [
      { name: "Teal Blue", value: "#006D77.jpg", available: true },
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Mocha Tan", value: "#9B6B4F", available: true },
      { name: "Green", value: "#228B22", available: true }
    ]
  },
  // Wallet - Mint Green
  {
    id: "wallet-mint-green",
    name: "Wallet",
    category: "Wallet",
    color: "Mint Green",
    price: 1799,
    rating: 4.6,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/09-10-2025--livia01052.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/09-10-2025--livia01055.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/09-10-2025--livia01059.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/Mint%20Green/09-10-2025--livia01064.jpg"
    ],
    description: "Compact and stylish wallet designed for everyday essentials. Crafted with premium PU leather and thoughtful organization, it's perfect for the modern lifestyle where less is more.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Bi-fold with snap closure",
      hardware: "Gold-Tone Accents",
      compartments: [
        "2 main cash compartments",
        "1 coin pocket with zipper",
        "6 card slots",
        "2 slip pockets for receipts"
      ],
      capacity: "Designed for cards, cash, coins, and essential documents",
      idealFor: "Daily use, travel, and minimalist carry"
    },
    features: [
      "Compact bi-fold design",
      "Multiple card slots",
      "Secure snap closure",
      "Premium leather feel",
      "Lightweight and durable"
    ],
    colors: [
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Teal Blue", value: "#006D77.jpg", available: true }
    ]
  },
  // Wallet - Teal Blue
  {
    id: "wallet-teal-blue",
    name: "Wallet",
    category: "Wallet",
    color: "Teal Blue",
    price: 1799,
    rating: 4.6,
    reviews: 15,
    images: [
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/01.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/02.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/03.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/04.png",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/09-10-2025--livia01007.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/09-10-2025--livia01009.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/09-10-2025--livia01015.jpg",
      "https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/wallet/teal%20blue/09-10-2025--livia01018.jpg"
    ],
    description: "Compact and stylish wallet designed for everyday essentials. Crafted with premium PU leather and thoughtful organization, it's perfect for the modern lifestyle where less is more.",
    specifications: {
      material: "100% PU Leather",
      texture: "Smooth, Fine-Grained",
      closureType: "Bi-fold with snap closure",
      hardware: "Gold-Tone Accents",
      compartments: [
        "2 main cash compartments",
        "1 coin pocket with zipper",
        "6 card slots",
        "2 slip pockets for receipts"
      ],
      capacity: "Designed for cards, cash, coins, and essential documents",
      idealFor: "Daily use, travel, and minimalist carry"
    },
    features: [
      "Compact bi-fold design",
      "Multiple card slots",
      "Secure snap closure",
      "Premium leather feel",
      "Lightweight and durable"
    ],
    colors: [
      { name: "Mint Green", value: "#98D8C8.jpg", available: true },
      { name: "Teal Blue", value: "#006D77.jpg", available: true }
    ]
  }
];

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

// Helper function to get all unique categories
export function getCategories(): string[] {
  return Array.from(new Set(products.map(product => product.category)));
}

// Helper function to get related products (same name, different color)
export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products.filter(p => 
    p.name === product.name && p.id !== productId
  ).slice(0, 4);
}

// Helper function to get recommendations (different products in same category)
export function getRecommendedProducts(productId: string, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  
  return products.filter(p => 
    p.category === product.category && p.name !== product.name
  ).slice(0, limit);
}
