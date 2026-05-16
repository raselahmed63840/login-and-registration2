import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { createOrder } from "../api/orderApi";

const districtThanaMap = {
  Bagerhat: [
    "Bagerhat Sadar",
    "Chitalmari",
    "Fakirhat",
    "Kachua",
    "Mollahat",
    "Mongla",
    "Morrelganj",
    "Rampal",
    "Sarankhola",
  ],
  Bandarban: [
    "Bandarban Sadar",
    "Alikadam",
    "Lama",
    "Naikhongchhari",
    "Rowangchhari",
    "Ruma",
    "Thanchi",
  ],
  Barguna: [
    "Barguna Sadar",
    "Amtali",
    "Bamna",
    "Betagi",
    "Patharghata",
    "Taltali",
  ],
  Barishal: [
    "Barishal Sadar",
    "Agailjhara",
    "Babuganj",
    "Bakerganj",
    "Banaripara",
    "Gournadi",
    "Hizla",
    "Mehendiganj",
    "Muladi",
    "Wazirpur",
  ],
  Bhola: [
    "Bhola Sadar",
    "Borhanuddin",
    "Char Fasson",
    "Daulatkhan",
    "Lalmohan",
    "Manpura",
    "Tazumuddin",
  ],
  Bogura: [
    "Bogura Sadar",
    "Adamdighi",
    "Dhunat",
    "Dhupchanchia",
    "Gabtali",
    "Kahaloo",
    "Nandigram",
    "Sariakandi",
    "Shajahanpur",
    "Sherpur",
    "Shibganj",
    "Sonatala",
  ],
  Brahmanbaria: [
    "Brahmanbaria Sadar",
    "Akhaura",
    "Ashuganj",
    "Bancharampur",
    "Bijoynagar",
    "Kasba",
    "Nabinagar",
    "Nasirnagar",
    "Sarail",
  ],
  Chandpur: [
    "Chandpur Sadar",
    "Faridganj",
    "Haimchar",
    "Hajiganj",
    "Kachua",
    "Matlab Dakshin",
    "Matlab Uttar",
    "Shahrasti",
  ],
  Chattogram: [
    "Chattogram Sadar",
    "Anwara",
    "Banshkhali",
    "Boalkhali",
    "Chandanaish",
    "Fatikchhari",
    "Hathazari",
    "Karnaphuli",
    "Lohagara",
    "Mirsharai",
    "Patiya",
    "Rangunia",
    "Raozan",
    "Sandwip",
    "Satkania",
    "Sitakunda",
    "Kotwali",
    "Panchlaish",
    "Double Mooring",
    "Halishahar",
    "Pahartali",
    "Patenga",
    "Bayezid",
    "Chandgaon",
  ],
  Chuadanga: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
  "Cox's Bazar": [
    "Cox's Bazar Sadar",
    "Chakaria",
    "Kutubdia",
    "Maheshkhali",
    "Pekua",
    "Ramu",
    "Teknaf",
    "Ukhia",
  ],
  Cumilla: [
    "Cumilla Sadar",
    "Barura",
    "Brahmanpara",
    "Burichang",
    "Chandina",
    "Chauddagram",
    "Daudkandi",
    "Debidwar",
    "Homna",
    "Laksam",
    "Lalmai",
    "Meghna",
    "Monohorgonj",
    "Muradnagar",
    "Nangalkot",
    "Titas",
  ],
  Dhaka: [
    "Dhanmondi",
    "Mirpur",
    "Uttara",
    "Gulshan",
    "Banani",
    "Mohammadpur",
    "Paltan",
    "Motijheel",
    "Tejgaon",
    "Ramna",
    "Jatrabari",
    "Demra",
    "Savar",
    "Dhamrai",
    "Dohar",
    "Keraniganj",
    "Nawabganj",
  ],
  Dinajpur: [
    "Dinajpur Sadar",
    "Birampur",
    "Birganj",
    "Biral",
    "Bochaganj",
    "Chirirbandar",
    "Fulbari",
    "Ghoraghat",
    "Hakimpur",
    "Kaharole",
    "Khansama",
    "Nawabganj",
    "Parbatipur",
  ],
  Faridpur: [
    "Faridpur Sadar",
    "Alfadanga",
    "Bhanga",
    "Boalmari",
    "Charbhadrasan",
    "Madhukhali",
    "Nagarkanda",
    "Sadarpur",
    "Saltha",
  ],
  Feni: [
    "Feni Sadar",
    "Chhagalnaiya",
    "Daganbhuiyan",
    "Fulgazi",
    "Parshuram",
    "Sonagazi",
  ],
  Gaibandha: [
    "Gaibandha Sadar",
    "Fulchhari",
    "Gobindaganj",
    "Palashbari",
    "Sadullapur",
    "Saghata",
    "Sundarganj",
  ],
  Gazipur: ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  Gopalganj: [
    "Gopalganj Sadar",
    "Kashiani",
    "Kotalipara",
    "Muksudpur",
    "Tungipara",
  ],
  Habiganj: [
    "Habiganj Sadar",
    "Ajmiriganj",
    "Bahubal",
    "Baniachong",
    "Chunarughat",
    "Lakhai",
    "Madhabpur",
    "Nabiganj",
    "Shaistaganj",
  ],
  Jamalpur: [
    "Jamalpur Sadar",
    "Bakshiganj",
    "Dewanganj",
    "Islampur",
    "Madarganj",
    "Melandaha",
    "Sarishabari",
  ],
  Jashore: [
    "Jashore Sadar",
    "Abhaynagar",
    "Bagherpara",
    "Chaugachha",
    "Jhikargacha",
    "Keshabpur",
    "Manirampur",
    "Sharsha",
  ],
  Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
  Jhenaidah: [
    "Jhenaidah Sadar",
    "Harinakunda",
    "Kaliganj",
    "Kotchandpur",
    "Maheshpur",
    "Shailkupa",
  ],
  Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
  Khagrachhari: [
    "Khagrachhari Sadar",
    "Dighinala",
    "Guimara",
    "Lakshmichhari",
    "Mahalchhari",
    "Manikchhari",
    "Matiranga",
    "Panchhari",
    "Ramgarh",
  ],
  Khulna: [
    "Khulna Sadar",
    "Batiaghata",
    "Dacope",
    "Dighalia",
    "Dumuria",
    "Koyra",
    "Paikgacha",
    "Phultala",
    "Rupsa",
    "Terokhada",
    "Sonadanga",
    "Khalishpur",
    "Daulatpur",
  ],
  Kishoreganj: [
    "Kishoreganj Sadar",
    "Austagram",
    "Bajitpur",
    "Bhairab",
    "Hossainpur",
    "Itna",
    "Karimganj",
    "Katiadi",
    "Kuliarchar",
    "Mithamain",
    "Nikli",
    "Pakundia",
    "Tarail",
  ],
  Kurigram: [
    "Kurigram Sadar",
    "Bhurungamari",
    "Char Rajibpur",
    "Chilmari",
    "Fulbari",
    "Nageshwari",
    "Rajarhat",
    "Raomari",
    "Ulipur",
  ],
  Kushtia: [
    "Kushtia Sadar",
    "Bheramara",
    "Daulatpur",
    "Khoksa",
    "Kumarkhali",
    "Mirpur",
  ],
  Lakshmipur: [
    "Lakshmipur Sadar",
    "Kamalnagar",
    "Ramganj",
    "Ramgati",
    "Raipur",
  ],
  Lalmonirhat: [
    "Lalmonirhat Sadar",
    "Aditmari",
    "Hatibandha",
    "Kaliganj",
    "Patgram",
  ],
  Madaripur: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"],
  Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  Manikganj: [
    "Manikganj Sadar",
    "Daulatpur",
    "Ghior",
    "Harirampur",
    "Saturia",
    "Shibalaya",
    "Singair",
  ],
  Meherpur: ["Meherpur Sadar", "Gangni", "Mujibnagar"],
  Moulvibazar: [
    "Moulvibazar Sadar",
    "Barlekha",
    "Juri",
    "Kamalganj",
    "Kulaura",
    "Rajnagar",
    "Sreemangal",
  ],
  Munshiganj: [
    "Munshiganj Sadar",
    "Gazaria",
    "Lohajang",
    "Sirajdikhan",
    "Sreenagar",
    "Tongibari",
  ],
  Mymensingh: [
    "Mymensingh Sadar",
    "Bhaluka",
    "Dhobaura",
    "Fulbaria",
    "Gaffargaon",
    "Gauripur",
    "Haluaghat",
    "Ishwarganj",
    "Muktagachha",
    "Nandail",
    "Phulpur",
    "Tarakanda",
    "Trishal",
  ],
  Naogaon: [
    "Naogaon Sadar",
    "Atrai",
    "Badalgachhi",
    "Dhamoirhat",
    "Manda",
    "Mahadebpur",
    "Niamatpur",
    "Patnitala",
    "Porsha",
    "Raninagar",
    "Sapahar",
  ],
  Narail: ["Narail Sadar", "Kalia", "Lohagara"],
  Narayanganj: [
    "Narayanganj Sadar",
    "Araihazar",
    "Bandar",
    "Rupganj",
    "Sonargaon",
    "Siddhirganj",
    "Fatullah",
  ],
  Narsingdi: [
    "Narsingdi Sadar",
    "Belabo",
    "Monohardi",
    "Palash",
    "Raipura",
    "Shibpur",
  ],
  Natore: [
    "Natore Sadar",
    "Bagatipara",
    "Baraigram",
    "Gurudaspur",
    "Lalpur",
    "Naldanga",
    "Singra",
  ],
  Netrokona: [
    "Netrokona Sadar",
    "Atpara",
    "Barhatta",
    "Durgapur",
    "Kalmakanda",
    "Kendua",
    "Khaliajuri",
    "Madan",
    "Mohanganj",
    "Purbadhala",
  ],
  Nilphamari: [
    "Nilphamari Sadar",
    "Dimla",
    "Domar",
    "Jaldhaka",
    "Kishoreganj",
    "Saidpur",
  ],
  Noakhali: [
    "Noakhali Sadar",
    "Begumganj",
    "Chatkhil",
    "Companiganj",
    "Hatiya",
    "Kabirhat",
    "Senbagh",
    "Sonaimuri",
    "Subarnachar",
  ],
  Pabna: [
    "Pabna Sadar",
    "Atgharia",
    "Bera",
    "Bhangura",
    "Chatmohar",
    "Faridpur",
    "Ishwardi",
    "Santhia",
    "Sujanagar",
  ],
  Panchagarh: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
  Patuakhali: [
    "Patuakhali Sadar",
    "Bauphal",
    "Dashmina",
    "Dumki",
    "Galachipa",
    "Kalapara",
    "Mirzaganj",
    "Rangabali",
  ],
  Pirojpur: [
    "Pirojpur Sadar",
    "Bhandaria",
    "Kawkhali",
    "Mathbaria",
    "Nazirpur",
    "Nesarabad",
    "Indurkani",
  ],
  Rajbari: [
    "Rajbari Sadar",
    "Baliakandi",
    "Goalandaghat",
    "Pangsha",
    "Kalukhali",
  ],
  Rajshahi: [
    "Rajshahi Sadar",
    "Bagha",
    "Bagmara",
    "Charghat",
    "Durgapur",
    "Godagari",
    "Mohanpur",
    "Paba",
    "Puthia",
    "Tanore",
    "Boalia",
    "Rajpara",
    "Motihar",
    "Shah Makhdum",
  ],
  Rangamati: [
    "Rangamati Sadar",
    "Baghaichhari",
    "Barkal",
    "Belaichhari",
    "Juraichhari",
    "Kaptai",
    "Kawkhali",
    "Langadu",
    "Naniarchar",
    "Rajasthali",
  ],
  Rangpur: [
    "Rangpur Sadar",
    "Badarganj",
    "Gangachara",
    "Kaunia",
    "Mithapukur",
    "Pirgachha",
    "Pirganj",
    "Taraganj",
    "Kotwali",
  ],
  Satkhira: [
    "Satkhira Sadar",
    "Assasuni",
    "Debhata",
    "Kalaroa",
    "Kaliganj",
    "Shyamnagar",
    "Tala",
  ],
  Shariatpur: [
    "Shariatpur Sadar",
    "Bhedarganj",
    "Damudya",
    "Gosairhat",
    "Naria",
    "Zajira",
  ],
  Sherpur: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"],
  Sirajganj: [
    "Sirajganj Sadar",
    "Belkuchi",
    "Chauhali",
    "Kamarkhanda",
    "Kazipur",
    "Raiganj",
    "Shahjadpur",
    "Tarash",
    "Ullahpara",
  ],
  Sunamganj: [
    "Sunamganj Sadar",
    "Bishwamvarpur",
    "Chhatak",
    "Dakshin Sunamganj",
    "Derai",
    "Dharamapasha",
    "Dowarabazar",
    "Jagannathpur",
    "Jamalganj",
    "Sullah",
    "Tahirpur",
  ],
  Sylhet: [
    "Sylhet Sadar",
    "Balaganj",
    "Beanibazar",
    "Bishwanath",
    "Companiganj",
    "Dakshin Surma",
    "Fenchuganj",
    "Golapganj",
    "Gowainghat",
    "Jaintiapur",
    "Kanaighat",
    "Osmani Nagar",
    "Zakiganj",
    "Kotwali",
    "Jalalabad",
  ],
  Tangail: [
    "Tangail Sadar",
    "Basail",
    "Bhuapur",
    "Delduar",
    "Dhanbari",
    "Ghatail",
    "Gopalpur",
    "Kalihati",
    "Madhupur",
    "Mirzapur",
    "Nagarpur",
    "Sakhipur",
  ],
  Thakurgaon: [
    "Thakurgaon Sadar",
    "Baliadangi",
    "Haripur",
    "Pirganj",
    "Ranisankail",
  ],
};

const locationSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "56px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#f97316" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #f97316" : "none",
    "&:hover": {
      borderColor: "#f97316",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#f97316"
      : state.isFocused
        ? "#ffedd5"
        : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#374151",
  }),
};

const makeOptions = (items = []) =>
  items
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((item) => ({
      value: item,
      label: item,
    }));

const getImageUrl = (item) => {
  const image =
    item?.image || item?.images?.[0]?.url || item?.images?.[0] || "";

  if (!image) return "https://via.placeholder.com/80";

  if (typeof image === "object" && image.url) {
    return image.url;
  }

  return image;
};

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [couponOpen, setCouponOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    district: "",
    thana: "",
    addressLine: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    district: "",
    thana: "",
    addressLine: "",
  });

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const getAuthUser = () => {
    try {
      const savedUser =
        localStorage.getItem("authUser") ||
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        localStorage.getItem("shopEaseUser");

      return savedUser ? JSON.parse(savedUser) : {};
    } catch {
      return {};
    }
  };

  const getUserId = () => {
    const user = getAuthUser();
    return user?._id || user?.id || user?.userId || "guestUser";
  };

  const districtOptions = useMemo(() => {
    return makeOptions(Object.keys(districtThanaMap));
  }, []);

  const shippingThanaOptions = useMemo(() => {
    return makeOptions(districtThanaMap[shippingAddress.district] || []);
  }, [shippingAddress.district]);

  const billingThanaOptions = useMemo(() => {
    return makeOptions(districtThanaMap[billingAddress.district] || []);
  }, [billingAddress.district]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(Array.isArray(localCart) ? localCart : []);
      } catch {
        setCartItems([]);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const syncCart = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleIncrease = (index) => {
    const updated = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
    );

    syncCart(updated);
  };

  const handleDecrease = (index) => {
    const updated = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
        : item,
    );

    syncCart(updated);
  };

  const handleRemove = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);

    syncCart(updated);
  };

  const subTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0,
    );
  }, [cartItems]);

  const deliveryCost = 0;

  const discount = useMemo(() => {
    if (!coupon.trim()) return 0;

    if (coupon.trim().toUpperCase() === "SAVE10") {
      return subTotal * 0.1;
    }

    return 0;
  }, [coupon, subTotal]);

  const total = useMemo(() => {
    return subTotal + deliveryCost - discount;
  }, [subTotal, deliveryCost, discount]);

  const handlePlaceOrder = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.district ||
      !shippingAddress.addressLine
    ) {
      setMessageType("error");
      setMessage("Please complete shipping address");
      return;
    }

    if (cartItems.length === 0) {
      setMessageType("error");
      setMessage("Your cart is empty");
      return;
    }

    try {
      setPlacingOrder(true);
      setMessage("");

      const payload = {
        userId: getUserId(),

        items: cartItems.map((item, index) => ({
          productId: String(item.id || item._id || item.productId || index),
          title: item.title || item.name || "Product",
          image: getImageUrl(item),
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
        })),

        shippingAddress,

        customerName: shippingAddress.fullName,
        name: shippingAddress.fullName,
        phone: shippingAddress.phone.startsWith("88")
          ? shippingAddress.phone
          : `88${shippingAddress.phone}`,
        district: shippingAddress.district,
        area: shippingAddress.thana,
        address: shippingAddress.addressLine,

        billingSameAsShipping,
        billingAddress: billingSameAsShipping
          ? shippingAddress
          : billingAddress,

        paymentMethod,
        coupon,
        specialNotes,

        subtotal: subTotal,
        subTotal,
        deliveryCost,
        discount,
        total,
        totalAmount: total,

        status: "Pending",
      };

      const data = await createOrder(payload);

      if (data?.success) {
        const newOrder = data.order || {
          ...payload,
          orderId: `ORD-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const safeOldOrders = Array.isArray(oldOrders) ? oldOrders : [];

        localStorage.setItem(
          "orders",
          JSON.stringify([newOrder, ...safeOldOrders]),
        );

        setMessageType("success");
        setMessage("Order placed successfully");

        setCartItems([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/orders");
      } else {
        setMessageType("error");
        setMessage(data?.message || "Order place failed");
      }
    } catch (error) {
      console.error("Place order failed:", error);

      setMessageType("error");
      setMessage(error.response?.data?.message || "Order place failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 sm:px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="border rounded-xl bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <p className="text-slate-700 text-sm sm:text-base">
            Have any account? please login or register
          </p>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="border border-orange-400 text-slate-800 px-5 py-2 rounded-md"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-orange-500 text-white px-5 py-2 rounded-md font-medium"
            >
              Register
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 ${
              messageType === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-5">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <h2 className="text-2xl font-semibold text-slate-800 mb-5 border-l-4 border-orange-500 pl-3">
                Order review
              </h2>

              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-slate-500">Your cart is empty.</p>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={item.id || item._id || item.productId || index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(item)}
                          alt={item.title || item.name || "Product"}
                          className="w-16 h-16 rounded-lg border object-contain bg-white"
                        />

                        <div>
                          <h3 className="font-medium text-slate-800">
                            {item.title || item.name || "Product"}
                          </h3>

                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-slate-600">Qty:</span>

                            <button
                              type="button"
                              onClick={() => handleDecrease(index)}
                              className="w-8 h-8 rounded-full bg-slate-100 text-slate-700"
                            >
                              -
                            </button>

                            <span className="min-w-[24px] text-center">
                              {item.quantity || 1}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleIncrease(index)}
                              className="w-8 h-8 rounded-full bg-slate-100 text-orange-500"
                            >
                              +
                            </button>

                            <span className="font-semibold text-slate-800 ml-2">
                              ৳
                              {(
                                (Number(item.price) || 0) * (item.quantity || 1)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="self-start sm:self-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <h2 className="text-2xl font-semibold text-slate-800 mb-5 border-l-4 border-orange-500 pl-3">
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <div className="flex border rounded-xl overflow-hidden">
                  <span className="px-4 py-3 bg-slate-50 border-r">88</span>

                  <input
                    type="text"
                    placeholder="017********"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/[^0-9]/g, ""),
                      }))
                    }
                    className="w-full px-4 py-3 outline-none"
                  />
                </div>

                <Select
                  options={districtOptions}
                  isSearchable
                  placeholder="Select District"
                  styles={locationSelectStyles}
                  menuPortalTarget={menuPortalTarget}
                  value={
                    districtOptions.find(
                      (option) => option.value === shippingAddress.district,
                    ) || null
                  }
                  onChange={(selected) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      district: selected?.value || "",
                      thana: "",
                    }))
                  }
                />

                <Select
                  options={shippingThanaOptions}
                  isSearchable
                  isDisabled={!shippingAddress.district}
                  placeholder={
                    shippingAddress.district
                      ? "Select Thana (Optional)"
                      : "Select District First"
                  }
                  styles={locationSelectStyles}
                  menuPortalTarget={menuPortalTarget}
                  value={
                    shippingThanaOptions.find(
                      (option) => option.value === shippingAddress.thana,
                    ) || null
                  }
                  onChange={(selected) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      thana: selected?.value || "",
                    }))
                  }
                />

                <div className="md:col-span-2">
                  <textarea
                    rows={2}
                    placeholder="ex: House no. / building / street / area"
                    value={shippingAddress.addressLine}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        addressLine: e.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-800 border-l-4 border-orange-500 pl-3">
                  Billing Address
                </h2>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  />

                  <span className="text-sm text-slate-600">
                    Same as shipping
                  </span>
                </label>
              </div>

              {!billingSameAsShipping && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={billingAddress.fullName}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    value={billingAddress.phone}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <Select
                    options={districtOptions}
                    isSearchable
                    placeholder="Select District"
                    styles={locationSelectStyles}
                    menuPortalTarget={menuPortalTarget}
                    value={
                      districtOptions.find(
                        (option) => option.value === billingAddress.district,
                      ) || null
                    }
                    onChange={(selected) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        district: selected?.value || "",
                        thana: "",
                      }))
                    }
                  />

                  <Select
                    options={billingThanaOptions}
                    isSearchable
                    isDisabled={!billingAddress.district}
                    placeholder={
                      billingAddress.district
                        ? "Select Thana"
                        : "Select District First"
                    }
                    styles={locationSelectStyles}
                    menuPortalTarget={menuPortalTarget}
                    value={
                      billingThanaOptions.find(
                        (option) => option.value === billingAddress.thana,
                      ) || null
                    }
                    onChange={(selected) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        thana: selected?.value || "",
                      }))
                    }
                  />

                  <div className="md:col-span-2">
                    <textarea
                      rows={2}
                      placeholder="Enter billing address"
                      value={billingAddress.addressLine}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          addressLine: e.target.value,
                        }))
                      }
                      className="w-full border rounded-xl px-4 py-3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <h2 className="text-2xl font-semibold text-slate-800 mb-5 border-l-4 border-orange-500 pl-3">
                Payment method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Cash On Delivery", "Online Payment", "Bkash"].map(
                  (method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border px-4 py-4 text-left font-medium transition ${
                        paymentMethod === method
                          ? "border-orange-400 bg-orange-50 text-slate-900"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {method}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setCouponOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-800"
              >
                <span>Have any coupon or gift voucher?</span>
                <span>{couponOpen ? "⌃" : "⌄"}</span>
              </button>

              {couponOpen && (
                <div className="px-5 pb-5">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3"
                  />

                  <p className="text-sm text-slate-500 mt-2">
                    Use <span className="font-semibold">SAVE10</span> for 10%
                    discount
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <div className="space-y-3 text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Sub total</span>
                  <span>{subTotal.toFixed(2)} BDT</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Delivery cost</span>
                  <span>{deliveryCost.toFixed(2)} BDT</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{discount.toFixed(2)} BDT</span>
                  </div>
                )}

                <div className="pt-3 border-t flex items-center justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)} BDT</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
              <h2 className="text-2xl font-semibold text-slate-800 mb-5 border-l-4 border-orange-500 pl-3">
                Special notes{" "}
                <span className="text-sm font-normal">(Optional)</span>
              </h2>

              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 text-slate-700">
                <input type="checkbox" checked readOnly className="mt-1" />

                <span>
                  I have read and agree to the{" "}
                  <span className="text-orange-500 font-medium">
                    Terms and Conditions, Privacy Policy & Refund and Return
                    Policy.
                  </span>
                </span>
              </label>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-4 rounded-xl text-lg"
              >
                {placingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>

        {/* <div className="fixed right-2 top-1/2 -translate-y-1/2 hidden 2xl:block">
          <div className="bg-orange-500 text-white rounded-l-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 text-center border-b border-orange-400">
              👜
              <div>{cartItems.length} Items</div>
            </div>

            <div className="bg-white text-orange-500 font-bold px-4 py-3">
              ৳{subTotal.toFixed(2)}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Cart;
