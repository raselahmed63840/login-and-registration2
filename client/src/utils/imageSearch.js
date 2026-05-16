import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

let loadedModel = null;

const normalizeText = (text = "") => {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
};

const keywordMap = [
  {
    keyword: "shirt",
    aliases: [
      "shirt",
      "dress shirt",
      "t-shirt",
      "t shirt",
      "tee",
      "jersey",
      "sweatshirt",
      "blouse",
      "top",
      "polo",
    ],
  },
  {
    keyword: "women clothing",
    aliases: ["dress", "skirt", "gown", "kimono", "robe", "abaya"],
  },
  {
    keyword: "shoes",
    aliases: [
      "shoe",
      "shoes",
      "sneaker",
      "sneakers",
      "boot",
      "boots",
      "sandal",
      "slipper",
      "loafer",
    ],
  },
  {
    keyword: "bag",
    aliases: ["bag", "handbag", "backpack", "purse", "wallet"],
  },
  {
    keyword: "phone accessories",
    aliases: [
      "cell phone",
      "mobile phone",
      "smartphone",
      "telephone",
      "charger",
      "headphone",
      "earphone",
      "keyboard",
      "mouse",
      "remote",
    ],
  },
  {
    keyword: "jewelry",
    aliases: ["necklace", "ring", "earring", "bracelet", "watch", "chain"],
  },
  {
    keyword: "beauty product",
    aliases: ["perfume", "lipstick", "cosmetic", "cream", "lotion", "powder"],
  },
  {
    keyword: "baby items",
    aliases: ["baby", "toy", "doll", "stroller"],
  },
  {
    keyword: "office supplies",
    aliases: ["book", "notebook", "pen", "pencil", "calculator", "envelope"],
  },
  {
    keyword: "sports item",
    aliases: ["football", "soccer", "basketball", "cricket", "bat", "tennis"],
  },
  {
    keyword: "beverage",
    aliases: ["bottle", "cup", "coffee", "tea", "drink", "juice"],
  },
  {
    keyword: "honey",
    aliases: ["honey", "jar"],
  },
  {
    keyword: "rice",
    aliases: ["rice", "grain", "packet"],
  },
];

const loadModel = async () => {
  if (!loadedModel) {
    loadedModel = await mobilenet.load();
  }

  return loadedModel;
};

const fileToImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({ img, imageUrl });
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Image load failed"));
    };

    img.src = imageUrl;
  });
};

const getKeywordFromPrediction = (className = "") => {
  const normalizedClassName = normalizeText(className);

  const classParts = normalizedClassName
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  for (const part of classParts) {
    for (const item of keywordMap) {
      const isMatched = item.aliases.some((alias) => {
        const cleanAlias = normalizeText(alias);
        return part.includes(cleanAlias) || cleanAlias.includes(part);
      });

      if (isMatched) {
        return item.keyword;
      }
    }
  }

  const fallbackKeyword =
    classParts[0]
      ?.replace(/[^\w\s-]/g, "")
      .split(" ")
      .find((word) => word.length > 2) || "product";

  return fallbackKeyword;
};

export const getImageSearchKeyword = async (file) => {
  if (!file) {
    throw new Error("No image selected");
  }

  const model = await loadModel();
  const { img, imageUrl } = await fileToImageElement(file);

  try {
    const predictions = await model.classify(img);
    const bestPrediction = predictions?.[0]?.className || "";
    const keyword = getKeywordFromPrediction(bestPrediction);

    return {
      keyword,
      predictions,
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};