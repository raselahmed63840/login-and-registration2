export const AI_SEARCH_PROMPT_EXAMPLES = [
  "shirt under 1000",
  "shirt below 1000",
  "shirt less than 1000",
  "shirt within 1000 tk",
  "shirt under 1000 taka",
  "shirt under 1000 bdt",
  "shirt 500 to 1500",
  "shirt between 500 and 1500",
  "white shirt under 1500",
  "black shirt under 1200",
  "men shirt under 1000",
  "women shirt under 1000",
  "cotton shirt below 1500",
  "formal shirt under 2000",
  "casual shirt under 1000",

  "t shirt under 500",
  "t-shirt under 500",
  "tshirt below 600",
  "men t shirt under 700",
  "black t shirt under 800",
  "white t shirt below 500",

  "pant under 1000",
  "jeans under 1500",
  "trouser under 1200",
  "men pant below 1000",
  "black pant under 1200",
  "formal pant under 1500",

  "shoes under 1000",
  "shoe below 1200",
  "sneakers under 1500",
  "sports shoes under 2000",
  "men shoes under 1500",
  "women shoes under 1500",
  "black shoes under 1000",

  "bag under 500",
  "school bag under 1000",
  "ladies bag under 1200",
  "travel bag under 2000",
  "backpack under 1500",

  "honey under 500",
  "honey below 700",
  "organic honey under 1000",
  "wild honey under 800",
  "honey 300 to 800",
  "pure honey under 1000",

  "rice under 2000",
  "rice below 1500",
  "premium rice under 2500",
  "miniket rice under 2000",
  "basmati rice under 3000",
  "rice 1000 to 2500",

  "oil under 1000",
  "soybean oil under 1000",
  "mustard oil under 800",
  "ghee under 1500",
  "pure ghee under 2000",
  "oil and ghee under 2000",

  "dates under 1000",
  "ajwa dates under 2000",
  "maryam dates under 1500",
  "dates 500 to 2000",

  "spices under 500",
  "masala under 300",
  "turmeric powder under 200",
  "chili powder under 300",
  "cumin powder under 300",
  "garam masala under 500",

  "nuts under 1000",
  "almond under 1500",
  "cashew nut under 2000",
  "pistachio under 2500",
  "nuts and seeds under 1500",

  "beverage under 500",
  "tea under 500",
  "coffee under 1000",
  "juice under 500",
  "drink under 300",

  "pickle under 500",
  "mango pickle under 300",
  "olive pickle under 400",
  "mixed pickle under 500",

  "phone accessories under 300",
  "charger under 500",
  "earphone under 500",
  "headphone under 1000",
  "mobile cover under 300",
  "data cable under 300",
  "power bank under 1500",

  "beauty product under 500",
  "skin care under 1000",
  "face wash under 500",
  "cream under 800",
  "perfume under 1000",

  "baby items under 500",
  "baby dress under 1000",
  "baby food under 800",
  "baby toy under 500",

  "jewelry under 500",
  "earring under 300",
  "necklace under 1000",
  "ring under 500",
  "bracelet under 500",

  "office supplies under 500",
  "pen under 100",
  "notebook under 200",
  "calculator under 500",
  "stationery under 300",

  "sports item under 1000",
  "football under 1000",
  "cricket bat under 2000",
  "gym item under 1500",

  "cheap shirt",
  "cheap shoes",
  "cheap honey",
  "cheap rice",
  "low price product",
  "budget product under 500",
  "best product under 1000",
  "popular product under 1000",
  "new product under 1000",
  "latest product under 1000",

  "জামা 1000 টাকার মধ্যে",
  "শার্ট 1000 টাকার নিচে",
  "জুতা 1500 টাকার মধ্যে",
  "মধু 500 টাকার মধ্যে",
  "চাল 2000 টাকার মধ্যে",
  "তেল 1000 টাকার মধ্যে",
  "ঘি 1500 টাকার মধ্যে",
  "খেজুর 1000 টাকার মধ্যে",
  "মসলা 500 টাকার মধ্যে",
  "ব্যাগ 1000 টাকার মধ্যে",
  "মোবাইল চার্জার 500 টাকার মধ্যে",
];

const CATEGORY_ALIASES = {
  shirt: ["shirt", "shirts", "formal shirt", "casual shirt", "শার্ট", "জামা"],
  tshirt: ["tshirt", "t-shirt", "t shirt", "tee", "টি শার্ট"],
  pant: ["pant", "pants", "trouser", "trousers", "jeans", "প্যান্ট"],
  shoes: ["shoe", "shoes", "sneaker", "sneakers", "জুতা"],
  bag: ["bag", "bags", "backpack", "school bag", "travel bag", "ব্যাগ"],
  honey: ["honey", "organic honey", "wild honey", "pure honey", "মধু"],
  rice: ["rice", "miniket", "basmati", "চাল"],
  oil: ["oil", "soybean oil", "mustard oil", "তেল"],
  ghee: ["ghee", "ঘি"],
  dates: ["date", "dates", "ajwa", "maryam", "খেজুর"],
  spices: ["spice", "spices", "masala", "turmeric", "chili", "cumin", "মসলা"],
  nuts: ["nut", "nuts", "almond", "cashew", "pistachio", "seed", "seeds"],
  beverage: ["beverage", "tea", "coffee", "juice", "drink"],
  pickle: ["pickle", "achar", "mango pickle", "olive pickle", "আচার"],
  phone: [
    "phone",
    "mobile",
    "charger",
    "earphone",
    "headphone",
    "cover",
    "data cable",
    "power bank",
  ],
  beauty: ["beauty", "skin care", "face wash", "cream", "perfume"],
  baby: ["baby", "baby item", "baby dress", "baby food", "baby toy"],
  jewelry: ["jewelry", "jewellery", "earring", "necklace", "ring", "bracelet"],
  office: ["office", "stationery", "pen", "notebook", "calculator"],
  sports: ["sports", "football", "cricket", "bat", "gym"],
};

const normalizeText = (text = "") => {
  return String(text)
    .toLowerCase()
    .replace(/[৳,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getProductPrice = (product) => {
  const rawPrice = product?.price ?? product?.salePrice ?? product?.regularPrice ?? 0;
  const price = Number(String(rawPrice).replace(/[^\d.]/g, ""));
  return Number.isFinite(price) ? price : 0;
};

const getProductSearchText = (product) => {
  return normalizeText(
    [
      product?.title,
      product?.name,
      product?.brand,
      product?.category,
      product?.description,
    ]
      .filter(Boolean)
      .join(" ")
  );
};

const detectCategoryKeyword = (text) => {
  for (const [mainKeyword, aliases] of Object.entries(CATEGORY_ALIASES)) {
    const found = aliases.some((alias) => text.includes(normalizeText(alias)));
    if (found) return mainKeyword;
  }

  return "";
};

const extractPrice = (text) => {
  let minPrice = null;
  let maxPrice = null;

  const rangePatterns = [
    /(\d+)\s*(?:to|-|থেকে)\s*(\d+)/i,
    /between\s*(\d+)\s*(?:and|to|-)\s*(\d+)/i,
    /(\d+)\s*(?:and|to|-)\s*(\d+)\s*(?:tk|taka|bdt|টাকা)?/i,
  ];

  for (const pattern of rangePatterns) {
    const match = text.match(pattern);
    if (match) {
      minPrice = Number(match[1]);
      maxPrice = Number(match[2]);

      if (minPrice > maxPrice) {
        const temp = minPrice;
        minPrice = maxPrice;
        maxPrice = temp;
      }

      return { minPrice, maxPrice };
    }
  }

  const maxPatterns = [
    /(?:under|below|less than|within|upto|up to|max|maximum|budget)\s*(\d+)/i,
    /(\d+)\s*(?:tk|taka|bdt|টাকা)\s*(?:এর মধ্যে|মধ্যে|নিচে|কম)/i,
    /(?:নিচে|কম|মধ্যে)\s*(\d+)/i,
  ];

  for (const pattern of maxPatterns) {
    const match = text.match(pattern);
    if (match) {
      maxPrice = Number(match[1]);
      return { minPrice, maxPrice };
    }
  }

  const minPatterns = [
    /(?:above|over|more than|min|minimum)\s*(\d+)/i,
    /(\d+)\s*(?:tk|taka|bdt|টাকা)\s*(?:এর বেশি|বেশি)/i,
  ];

  for (const pattern of minPatterns) {
    const match = text.match(pattern);
    if (match) {
      minPrice = Number(match[1]);
      return { minPrice, maxPrice };
    }
  }

  return { minPrice, maxPrice };
};

export const parseSmartSearchQuery = (query = "") => {
  const originalQuery = query;
  let text = normalizeText(query);

  const { minPrice, maxPrice } = extractPrice(text);
  const detectedCategory = detectCategoryKeyword(text);

  let keyword = text
    .replace(/please/g, "")
    .replace(/show me/g, "")
    .replace(/find me/g, "")
    .replace(/i need/g, "")
    .replace(/i want/g, "")
    .replace(/price/g, "")
    .replace(/product/g, "")
    .replace(/products/g, "")
    .replace(/cheap/g, "")
    .replace(/low price/g, "")
    .replace(/best/g, "")
    .replace(/popular/g, "")
    .replace(/latest/g, "")
    .replace(/new/g, "")
    .replace(/between\s*\d+\s*(and|to|-)\s*\d+/g, "")
    .replace(/\d+\s*(to|-|থেকে)\s*\d+/g, "")
    .replace(/(under|below|less than|within|upto|up to|max|maximum|budget|above|over|more than|min|minimum)\s*\d+/g, "")
    .replace(/\d+\s*(tk|taka|bdt|টাকা)/g, "")
    .replace(/(tk|taka|bdt|টাকা|এর মধ্যে|মধ্যে|নিচে|কম|বেশি)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!keyword && detectedCategory) {
    keyword = detectedCategory;
  }

  const sortBy =
    text.includes("cheap") || text.includes("low price")
      ? "priceLowToHigh"
      : text.includes("expensive") || text.includes("high price")
      ? "priceHighToLow"
      : "";

  return {
    originalQuery,
    keyword,
    categoryKeyword: detectedCategory,
    minPrice,
    maxPrice,
    sortBy,
  };
};

export const filterProductsWithSmartSearch = (products = [], query = "") => {
  const parsed = parseSmartSearchQuery(query);

  if (!query.trim()) {
    return {
      products,
      parsed,
    };
  }

  let filtered = [...products];

  if (parsed.minPrice !== null) {
    filtered = filtered.filter((product) => getProductPrice(product) >= parsed.minPrice);
  }

  if (parsed.maxPrice !== null) {
    filtered = filtered.filter((product) => getProductPrice(product) <= parsed.maxPrice);
  }

  const searchWords = normalizeText(parsed.keyword)
    .split(" ")
    .filter((word) => word.length > 1);

  const categoryAliases = parsed.categoryKeyword
    ? CATEGORY_ALIASES[parsed.categoryKeyword] || []
    : [];

  filtered = filtered.filter((product) => {
    const productText = getProductSearchText(product);

    const keywordMatch =
      searchWords.length === 0 ||
      searchWords.some((word) => productText.includes(word));

    const categoryMatch =
      categoryAliases.length === 0 ||
      categoryAliases.some((alias) => productText.includes(normalizeText(alias)));

    return keywordMatch || categoryMatch;
  });

  if (parsed.sortBy === "priceLowToHigh") {
    filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  }

  if (parsed.sortBy === "priceHighToLow") {
    filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  }

  return {
    products: filtered,
    parsed,
  };
};