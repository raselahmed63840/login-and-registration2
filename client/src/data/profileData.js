const profileData = {
  basicInfo: {
    name: "John Doe",
    profileImage: "https://i.pravatar.cc/150?img=12",
    email: "johndoe@example.com",
    phone: "+8801712345678",
    birthDate: "1999-08-15",
    gender: "Male",
  },

  accountSettings: {
    username: "john_doe",
    twoFactorAuth: true,
    loginActivity: [
      { device: "Windows PC", location: "Dhaka, Bangladesh", time: "2026-04-20 10:30 AM" },
      { device: "Android Phone", location: "Chattogram, Bangladesh", time: "2026-04-19 08:15 PM" },
    ],
  },

  addressBook: {
    shippingAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    billingAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    savedAddresses: [
      "House 12, Road 5, Dhanmondi, Dhaka",
      "Flat 4B, Agrabad, Chattogram",
    ],
    defaultAddress: "House 12, Road 5, Dhanmondi, Dhaka",
  },

  orderManagement: {
    orderHistory: [
      {
        id: "#ORD-1001",
        status: "Delivered",
        tracking: "TRK123456",
        invoice: "Invoice-1001.pdf",
        total: "$120.50",
      },
      {
        id: "#ORD-1002",
        status: "Processing",
        tracking: "TRK789012",
        invoice: "Invoice-1002.pdf",
        total: "$85.00",
      },
    ],
  },

  wishlist: [
    { id: 1, title: "Mens Cotton Jacket", price: "$55.99" },
    { id: 2, title: "Fjallraven Backpack", price: "$109.95" },
  ],

  paymentInfo: {
    savedCards: ["**** **** **** 1234", "**** **** **** 5678"],
    wallets: ["bKash", "Nagad"],
    preferredPaymentMethod: "bKash",
  },

  reviewsRatings: [
    { product: "Mens Casual Premium Slim Fit T-Shirts", rating: 5, comment: "Very good product!" },
    { product: "Fjallraven Backpack", rating: 4, comment: "Good quality and useful." },
  ],

  notifications: {
    orderUpdates: true,
    offersPromotions: true,
    emailSMSSettings: "Email & SMS enabled",
  },

  loyaltyRewards: {
    points: 250,
    coupons: ["NEWUSER10", "SUMMER20"],
    giftCards: ["$25 Gift Card"],
    referralBonus: "$15",
  },

  supportSection: {
    helpCenter: "Available",
    complaintTicket: "No active ticket",
    chatSupport: "Online",
    returnPolicy: "7 Days Return Policy",
  },

  privacySecurity: {
    dataPrivacy: "Standard Protection Enabled",
    deleteAccount: "Available",
    downloadPersonalData: "Available",
  },

  personalization: {
    recentlyViewed: [
      "Mens Casual Premium Slim Fit T-Shirts",
      "Fjallraven Backpack",
      "Mens Cotton Jacket",
    ],
    recommendedItems: [
      "Wireless Headphones",
      "Smart Watch",
      "Casual Sneakers",
    ],
    preferredCategories: ["Fashion", "Electronics"],
    preferredBrands: ["Nike", "Apple"],
  },
};

export default profileData;