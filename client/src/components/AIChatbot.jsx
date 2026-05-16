import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const quickQuestions = [
  "shirt under 1000",
  "shirt below 1500",
  "formal shirt under 2000",
  "casual shirt under 1000",
  "black shirt under 1200",
  "white shirt under 1000",
  "men shirt under 1500",
  "women shirt under 1500",
  "cotton shirt under 1500",
  "shirt 500 to 1500",

  "t shirt under 500",
  "t-shirt below 700",
  "black t shirt under 800",
  "white t shirt below 600",
  "men t shirt under 1000",
  "women t shirt under 1000",

  "pant under 1000",
  "jeans under 1500",
  "formal pant under 2000",
  "black pant under 1200",
  "trouser under 1500",

  "shoes under 1000",
  "sneakers under 1500",
  "sports shoes under 2000",
  "black shoes under 1200",
  "men shoes under 1500",
  "women shoes under 1500",

  "bag under 500",
  "school bag under 1000",
  "ladies bag under 1500",
  "backpack under 1200",
  "travel bag under 2000",

  "honey below 500",
  "pure honey under 1000",
  "organic honey under 1200",
  "wild honey under 800",
  "honey 300 to 800",

  "rice under 2000",
  "basmati rice under 3000",
  "miniket rice under 2000",
  "premium rice under 2500",
  "rice 1000 to 2500",

  "oil under 1000",
  "soybean oil under 1000",
  "mustard oil under 800",
  "ghee under 1500",
  "pure ghee under 2000",

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

  "tea under 500",
  "coffee under 1000",
  "juice under 500",
  "beverage under 500",

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

  "track my order",
  "where is my order",
  "order status",
  "how to track order",
  "track order by order id",
  "track order by phone number",

  "payment method",
  "do you support bkash",
  "cash on delivery available",
  "online payment available",
  "how can I pay",
  "is COD available",

  "delivery cost",
  "shipping cost",
  "delivery time",
  "how long delivery takes",
  "do you deliver outside Dhaka",
  "courier service available",

  "return policy",
  "refund policy",
  "cancel order",
  "how to return product",
  "how to refund",
  "can I cancel order",

  "how to add cart",
  "how to remove item from cart",
  "how to increase quantity",
  "how to decrease quantity",
  "cart not updating",
  "checkout help",

  "how to login",
  "how to register",
  "forgot password",
  "how to create account",
  "Google login help",
  "profile update help",

  "how to use wishlist",
  "add product to wishlist",
  "remove wishlist item",
  "where is my wishlist",

  "contact support",
  "customer support",
  "need help",
  "complain about order",
  "product problem",
  "damaged product received",

  "শার্ট 1000 টাকার মধ্যে",
  "জুতা 1500 টাকার মধ্যে",
  "মধু 500 টাকার মধ্যে",
  "চাল 2000 টাকার মধ্যে",
  "তেল 1000 টাকার মধ্যে",
  "খেজুর 1000 টাকার মধ্যে",
  "ব্যাগ 1000 টাকার মধ্যে",
  "চার্জার 500 টাকার মধ্যে",
  "অর্ডার ট্র্যাক করবো কিভাবে",
  "পেমেন্ট কিভাবে করবো",
  "ডেলিভারি চার্জ কত",
  "রিটার্ন করবো কিভাবে",
  "লগইন করবো কিভাবে",
  "কার্টে প্রোডাক্ট যোগ করবো কিভাবে",
];

const initialMessages = [
  {
    sender: "bot",
    text: "Hi! I am your AI Shopping Assistant. I can help you search products, track orders, understand payment, delivery, return policy, cart, wishlist and account support.",
    action: null,
  },
];

const normalizeText = (text = "") => {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
};

const isProductSearchQuery = (text) => {
  const query = normalizeText(text);

  const productWords = [
    "shirt",
    "t shirt",
    "t-shirt",
    "tshirt",
    "pant",
    "jeans",
    "trouser",
    "shoe",
    "shoes",
    "sneaker",
    "bag",
    "honey",
    "rice",
    "oil",
    "ghee",
    "dates",
    "spices",
    "masala",
    "nuts",
    "almond",
    "cashew",
    "tea",
    "coffee",
    "pickle",
    "charger",
    "earphone",
    "headphone",
    "phone",
    "mobile",
    "cover",
    "power bank",
    "beauty",
    "cream",
    "perfume",
    "baby",
    "jewelry",
    "ring",
    "necklace",
    "sports",
    "football",
    "cricket",
    "product",
    "products",
    "শার্ট",
    "জামা",
    "জুতা",
    "মধু",
    "চাল",
    "তেল",
    "ঘি",
    "খেজুর",
    "ব্যাগ",
    "চার্জার",
    "মোবাইল",
    "মসলা",
    "আচার",
  ];

  const priceWords = [
    "under",
    "below",
    "less than",
    "within",
    "budget",
    "to",
    "between",
    "tk",
    "taka",
    "bdt",
    "টাকা",
    "মধ্যে",
    "নিচে",
    "কম",
  ];

  const hasProductWord = productWords.some((word) => query.includes(word));
  const hasPriceWord = priceWords.some((word) => query.includes(word));

  return hasProductWord || hasPriceWord;
};

const getBotReply = (message) => {
  const text = normalizeText(message);

  if (!text) {
    return {
      text: "Please write your question. Example: shirt under 1000, payment method, track order.",
      action: null,
    };
  }

  if (isProductSearchQuery(text)) {
    return {
      text: `I found a smart search query for "${message}". Click below to view matching products.`,
      action: {
        label: "View Products",
        path: `/products?search=${encodeURIComponent(message)}`,
      },
    };
  }

  if (
    text.includes("track") ||
    text.includes("order status") ||
    text.includes("where is my order") ||
    text.includes("অর্ডার ট্র্যাক") ||
    text.includes("অর্ডার কোথায়")
  ) {
    return {
      text: "You can track your order from the Track Order page using your order ID or phone number.",
      action: {
        label: "Go to Track Order",
        path: "/track-order",
      },
    };
  }

  if (
    text.includes("payment") ||
    text.includes("bkash") ||
    text.includes("cash") ||
    text.includes("cod") ||
    text.includes("online payment") ||
    text.includes("pay") ||
    text.includes("পেমেন্ট")
  ) {
    return {
      text: "We support Cash On Delivery, Online Payment and Bkash payment method.",
      action: {
        label: "Go to Cart",
        path: "/cart",
      },
    };
  }

  if (
    text.includes("delivery") ||
    text.includes("shipping") ||
    text.includes("courier") ||
    text.includes("ডেলিভারি") ||
    text.includes("শিপিং")
  ) {
    return {
      text: "Delivery cost and delivery time depend on your location. You can check delivery information during checkout.",
      action: {
        label: "Go to Cart",
        path: "/cart",
      },
    };
  }

  if (
    text.includes("return") ||
    text.includes("refund") ||
    text.includes("cancel") ||
    text.includes("রিটার্ন") ||
    text.includes("রিফান্ড") ||
    text.includes("ক্যানসেল")
  ) {
    return {
      text: "You can request return, refund or cancellation from your order section. Returned products should follow the return policy.",
      action: {
        label: "My Orders",
        path: "/orders",
      },
    };
  }

  if (
    text.includes("cart") ||
    text.includes("add to cart") ||
    text.includes("remove item") ||
    text.includes("quantity") ||
    text.includes("checkout") ||
    text.includes("কার্ট")
  ) {
    return {
      text: "You can add products to cart from the product page. In the cart page, you can increase, decrease or remove items.",
      action: {
        label: "Go to Cart",
        path: "/cart",
      },
    };
  }

  if (
    text.includes("login") ||
    text.includes("sign in") ||
    text.includes("register") ||
    text.includes("account") ||
    text.includes("profile") ||
    text.includes("লগইন") ||
    text.includes("রেজিস্টার")
  ) {
    return {
      text: "You can login or create a new account using email/password or Google login. You can also update your profile from My Account.",
      action: {
        label: "Go to Login",
        path: "/login",
      },
    };
  }

  if (
    text.includes("wishlist") ||
    text.includes("favorite") ||
    text.includes("favourite")
  ) {
    return {
      text: "Wishlist helps you save your favorite products for later purchase.",
      action: {
        label: "Go to Wishlist",
        path: "/wishlist",
      },
    };
  }

  if (
    text.includes("contact") ||
    text.includes("support") ||
    text.includes("complain") ||
    text.includes("problem") ||
    text.includes("damaged")
  ) {
    return {
      text: "For support, you can contact customer service or use the order section if your issue is related to an order.",
      action: {
        label: "Contact Support",
        path: "/contact",
      },
    };
  }

  if (
    text.includes("admin") ||
    text.includes("dashboard") ||
    text.includes("product manage") ||
    text.includes("order manage")
  ) {
    return {
      text: "Admin can manage products, orders, users, stock and reviews from the admin dashboard.",
      action: {
        label: "Admin Panel",
        path: "/admin",
      },
    };
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("assalamualaikum") ||
    text.includes("salam")
  ) {
    return {
      text: "Hello! How can I help you today? You can ask me about products, cart, payment, delivery, order tracking, return policy or account support.",
      action: null,
    };
  }

  return {
    text: "I can help with product search, cart, payment, delivery, order tracking, return policy, wishlist and account support. Try: shirt under 1000.",
    action: {
      label: "Browse Products",
      path: "/products",
    },
  };
};

const AIChatbot = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const openChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener("openAIChatbot", openChatbot);

    return () => {
      window.removeEventListener("openAIChatbot", openChatbot);
    };
  }, []);

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, typing]);

  const sendMessage = (text) => {
    const userText = text.trim();

    if (!userText) return;

    const userMessage = {
      sender: "user",
      text: userText,
      action: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botReply = getBotReply(userText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply.text,
          action: botReply.action,
        },
      ]);

      setTyping(false);
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleActionClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 sm:right-5 z-[9999] w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-2xl flex items-center justify-center transition"
        title="AI Chatbot"
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-3xl">🤖</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-5 z-[9999] w-auto sm:w-[360px] md:w-[380px] lg:w-[400px] xl:w-[420px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl shrink-0">
                🤖
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">
                  AI Shopping Assistant
                </h3>
                <p className="text-xs text-orange-50 truncate">
                  Free smart chatbot support
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full shrink-0"
            >
              Clear
            </button>
          </div>

          <div className="h-[340px] sm:h-[360px] md:h-[380px] lg:h-[400px] max-h-[52vh] overflow-y-auto bg-slate-50 px-4 py-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  <p>{message.text}</p>

                  {message.action && (
                    <button
                      onClick={() => handleActionClick(message.action.path)}
                      className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-sm font-semibold"
                    >
                      {message.action.label}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-slate-500">
                  Typing...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="px-3 sm:px-4 py-3 border-t bg-white">
            <div className="flex gap-2 overflow-x-auto pb-3">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="shrink-0 text-xs px-3 py-2 rounded-full border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 whitespace-nowrap"
                >
                  {question}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, order, payment..."
                className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-orange-500 text-sm min-w-0"
              />

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold shrink-0"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
