import { useState, useEffect, useRef } from "react";
import { Sun, Cloud, CloudRain, Wind, MapPin, Phone, Wifi, Clock, Star, UtensilsCrossed, ShoppingBag, Car, Heart, Shield, MessageCircle, Calendar, Sparkles, Coffee, Camera, Music, Droplets, BookOpen, X, Check, Navigation, Waves, Search, Loader, User, ArrowRight, ChevronRight, Lock } from "lucide-react";

// ─── BRAND TOKENS ───
const brand = {
  dark: "#0F1923",
  navy: "#162230",
  sand: "#F5F0EB",
  gold: "#C5A55A",
  goldLight: "#D4B96A",
  goldDark: "#A8893D",
  cream: "#FAF8F5",
  white: "#FFFFFF",
  textMuted: "#8A8578",
  textLight: "#B8B0A4",
  border: "rgba(197,165,90,0.15)",
  borderLight: "rgba(197,165,90,0.08)",
  error: "#DC3545",
};

// ─── TRANSLATIONS (lookup + guide) ───
const translations = {
  fr: {
    // Lookup screen
    lookupTitle: "Bienvenue",
    lookupSubtitle: "Accédez à votre guide personnalisé",
    lookupPlaceholder: "Nom de la réservation",
    lookupCodePlaceholder: "Code de réservation (optionnel)",
    lookupButton: "Accéder à mon guide",
    lookupSearching: "Recherche en cours…",
    lookupError: "Aucune réservation trouvée. Vérifiez le nom ou contactez votre hôte.",
    lookupHelp: "Entrez le nom figurant sur votre réservation",
    lookupOr: "ou",
    lookupContactHost: "Contacter votre hôte",
    lookupPrivacy: "Vos données sont sécurisées et ne sont pas partagées",
    lookupMultiple: "Plusieurs réservations trouvées",
    lookupSelect: "Sélectionnez votre séjour",
    // Guide
    welcome: "Bienvenue",
    yourStay: "Votre séjour",
    at: "à",
    stayDates: "Séjour",
    guests: "voyageurs",
    checkIn: "Arrivée",
    checkOut: "Départ",
    wifi: "WiFi",
    password: "Mot de passe",
    copySuccess: "Copié !",
    weather: "Météo",
    today: "Aujourd'hui",
    feelsLike: "Ressenti",
    humidity: "Humidité",
    wind: "Vent",
    explore: "Explorer Marrakech",
    restaurants: "Restaurants",
    restaurantsDesc: "Nos adresses curatées",
    attractions: "Expériences",
    attractionsDesc: "À ne pas manquer",
    wellness: "Bien-être",
    wellnessDesc: "Spas & détente",
    shopping: "Shopping",
    shoppingDesc: "Souks & boutiques",
    nightlife: "Sorties",
    nightlifeDesc: "Rooftops & bars",
    culture: "Culture",
    cultureDesc: "Musées & jardins",
    dayTrips: "Excursions",
    dayTripsDesc: "Hors de Marrakech",
    families: "En famille",
    familiesDesc: "Activités enfants",
    services: "Services Conciergerie",
    servicesDesc: "Votre conciergerie à portée de main",
    privateChef: "Chef Privé",
    privateChefDesc: "Cuisine marocaine et internationale à domicile",
    transfer: "Transfert Aéroport",
    transferDesc: "Véhicule privé avec chauffeur",
    massage: "Massage & Spa",
    massageDesc: "Soins à domicile par des professionnels",
    excursion: "Excursions",
    excursionDesc: "Atlas, Essaouira, désert d'Agafay",
    babysitting: "Babysitting",
    babysittingDesc: "Personnel qualifié et de confiance",
    grocery: "Courses & Provisions",
    groceryDesc: "Remplissage frigo avant votre arrivée",
    request: "Réserver",
    houseRules: "Règles de la maison",
    pool: "Piscine",
    poolHours: "Horaires : 8h - 22h",
    noise: "Tranquillité",
    noiseDesc: "Respectez le calme après 22h",
    smoking: "Non-fumeur",
    smokingDesc: "Merci de fumer à l'extérieur uniquement",
    shoes: "Chaussures",
    shoesDesc: "Retirez vos chaussures à l'intérieur",
    emergency: "Urgences",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Pompiers",
    yourHost: "Votre hôte",
    hostDesc: "Disponible 24/7 pour vous",
    call: "Appeler",
    message: "Message",
    practicalInfo: "Infos pratiques",
    currency: "Monnaie",
    currencyDesc: "Dirham marocain (MAD). 1€ ≈ 11 MAD",
    tipping: "Pourboires",
    tippingDesc: "10-15% restaurants, 20-50 MAD services",
    dress: "Tenue",
    dressDesc: "Décontractée mais respectueuse en médina",
    water: "Eau",
    waterDesc: "Buvez l'eau en bouteille uniquement",
    taxi: "Taxis",
    taxiDesc: "Petits taxis rouges en ville. Insistez sur le compteur",
    pharmacy: "Pharmacie",
    pharmacyDesc: "Pharmacie de garde 24/7 disponible",
    events: "Événements",
    eventsDesc: "Ce qui se passe à Marrakech",
    seeAll: "Voir tout",
    poweredBy: "Propulsé par",
    contactUs: "Nous contacter",
    quickActions: "Actions rapides",
    extendStay: "Prolonger le séjour",
    lateCheckout: "Check-out tardif",
    extraCleaning: "Ménage supplémentaire",
    taxiOrder: "Commander un taxi",
    feedback: "Votre avis compte",
    feedbackDesc: "Comment se passe votre séjour ?",
    excellent: "Excellent",
    good: "Bien",
    average: "Moyen",
    poor: "Décevant",
    feedbackThanks: "Merci pour votre retour !",
    nearbyPharmacy: "Pharmacie",
    nearbyHospital: "Hôpital",
    daysLeft: "jours restants",
    dayLeft: "jour restant",
    tonight: "Dernière nuit",
    accessCode: "Code d'accès",
    parkingCode: "Code parking",
    logOut: "Changer de réservation",
  },
  en: {
    lookupTitle: "Welcome",
    lookupSubtitle: "Access your personalized guide",
    lookupPlaceholder: "Reservation name",
    lookupCodePlaceholder: "Booking code (optional)",
    lookupButton: "Access my guide",
    lookupSearching: "Searching…",
    lookupError: "No reservation found. Check the name or contact your host.",
    lookupHelp: "Enter the name on your reservation",
    lookupOr: "or",
    lookupContactHost: "Contact your host",
    lookupPrivacy: "Your data is secure and never shared",
    lookupMultiple: "Multiple reservations found",
    lookupSelect: "Select your stay",
    welcome: "Welcome",
    yourStay: "Your Stay",
    at: "at",
    stayDates: "Stay",
    guests: "guests",
    checkIn: "Check-in",
    checkOut: "Check-out",
    wifi: "WiFi",
    password: "Password",
    copySuccess: "Copied!",
    weather: "Weather",
    today: "Today",
    feelsLike: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    explore: "Explore Marrakech",
    restaurants: "Restaurants",
    restaurantsDesc: "Our curated addresses",
    attractions: "Experiences",
    attractionsDesc: "Must-see & must-do",
    wellness: "Wellness",
    wellnessDesc: "Spas & relaxation",
    shopping: "Shopping",
    shoppingDesc: "Souks & boutiques",
    nightlife: "Nightlife",
    nightlifeDesc: "Rooftops & bars",
    culture: "Culture",
    cultureDesc: "Museums & gardens",
    dayTrips: "Day Trips",
    dayTripsDesc: "Beyond Marrakech",
    families: "Families",
    familiesDesc: "Kids activities",
    services: "Concierge Services",
    servicesDesc: "Your concierge at your fingertips",
    privateChef: "Private Chef",
    privateChefDesc: "Moroccan & international cuisine at home",
    transfer: "Airport Transfer",
    transferDesc: "Private vehicle with chauffeur",
    massage: "Massage & Spa",
    massageDesc: "In-home treatments by professionals",
    excursion: "Day Trips",
    excursionDesc: "Atlas, Essaouira, Agafay desert",
    babysitting: "Babysitting",
    babysittingDesc: "Qualified & trusted staff",
    grocery: "Grocery & Provisions",
    groceryDesc: "Fridge stocking before your arrival",
    request: "Book",
    houseRules: "House Rules",
    pool: "Pool",
    poolHours: "Hours: 8am - 10pm",
    noise: "Quiet Hours",
    noiseDesc: "Please keep quiet after 10pm",
    smoking: "Non-smoking",
    smokingDesc: "Please smoke outside only",
    shoes: "Shoes",
    shoesDesc: "Remove shoes indoors",
    emergency: "Emergency",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Fire Department",
    yourHost: "Your Host",
    hostDesc: "Available 24/7 for you",
    call: "Call",
    message: "Message",
    practicalInfo: "Practical Info",
    currency: "Currency",
    currencyDesc: "Moroccan Dirham (MAD). 1€ ≈ 11 MAD",
    tipping: "Tipping",
    tippingDesc: "10-15% restaurants, 20-50 MAD services",
    dress: "Dress Code",
    dressDesc: "Casual but respectful in the medina",
    water: "Water",
    waterDesc: "Drink bottled water only",
    taxi: "Taxis",
    taxiDesc: "Small red taxis in town. Insist on the meter",
    pharmacy: "Pharmacy",
    pharmacyDesc: "24/7 on-call pharmacy available",
    events: "Events",
    eventsDesc: "What's happening in Marrakech",
    seeAll: "See all",
    poweredBy: "Powered by",
    contactUs: "Contact Us",
    quickActions: "Quick Actions",
    extendStay: "Extend Stay",
    lateCheckout: "Late Checkout",
    extraCleaning: "Extra Cleaning",
    taxiOrder: "Order a Taxi",
    feedback: "Your Feedback Matters",
    feedbackDesc: "How is your stay going?",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
    feedbackThanks: "Thank you for your feedback!",
    nearbyPharmacy: "Pharmacy",
    nearbyHospital: "Hospital",
    daysLeft: "days left",
    dayLeft: "day left",
    tonight: "Last night",
    accessCode: "Access code",
    parkingCode: "Parking code",
    logOut: "Switch reservation",
  },
  ar: {
    lookupTitle: "مرحباً",
    lookupSubtitle: "ادخل إلى دليلك الشخصي",
    lookupPlaceholder: "اسم الحجز",
    lookupCodePlaceholder: "رمز الحجز (اختياري)",
    lookupButton: "الوصول إلى دليلي",
    lookupSearching: "...جاري البحث",
    lookupError: "لم يتم العثور على حجز. تحقق من الاسم أو اتصل بمضيفك.",
    lookupHelp: "أدخل الاسم المسجل في حجزك",
    lookupOr: "أو",
    lookupContactHost: "اتصل بمضيفك",
    lookupPrivacy: "بياناتك آمنة ولا تتم مشاركتها",
    lookupMultiple: "تم العثور على عدة حجوزات",
    lookupSelect: "اختر إقامتك",
    welcome: "مرحباً",
    yourStay: "إقامتك",
    at: "في",
    stayDates: "الإقامة",
    guests: "ضيوف",
    checkIn: "تسجيل الوصول",
    checkOut: "تسجيل المغادرة",
    wifi: "واي فاي",
    password: "كلمة المرور",
    copySuccess: "!تم النسخ",
    weather: "الطقس",
    today: "اليوم",
    feelsLike: "يشعر وكأنه",
    humidity: "الرطوبة",
    wind: "الرياح",
    explore: "استكشف مراكش",
    restaurants: "المطاعم",
    restaurantsDesc: "عناويننا المختارة",
    attractions: "التجارب",
    attractionsDesc: "لا تفوتها",
    wellness: "العافية",
    wellnessDesc: "سبا و استرخاء",
    shopping: "التسوق",
    shoppingDesc: "الأسواق و المتاجر",
    nightlife: "الحياة الليلية",
    nightlifeDesc: "أسطح و بارات",
    culture: "الثقافة",
    cultureDesc: "المتاحف و الحدائق",
    dayTrips: "رحلات يومية",
    dayTripsDesc: "خارج مراكش",
    families: "العائلات",
    familiesDesc: "أنشطة الأطفال",
    services: "خدمات الكونسيرج",
    servicesDesc: "خدمة الكونسيرج في متناول يدك",
    privateChef: "شيف خاص",
    privateChefDesc: "مطبخ مغربي ودولي في المنزل",
    transfer: "نقل المطار",
    transferDesc: "سيارة خاصة مع سائق",
    massage: "مساج و سبا",
    massageDesc: "علاجات منزلية من متخصصين",
    excursion: "رحلات",
    excursionDesc: "الأطلس، الصويرة، صحراء أغافاي",
    babysitting: "رعاية الأطفال",
    babysittingDesc: "طاقم مؤهل وموثوق",
    grocery: "تسوق و مؤونة",
    groceryDesc: "تعبئة الثلاجة قبل وصولك",
    request: "حجز",
    houseRules: "قواعد المنزل",
    pool: "المسبح",
    poolHours: "الأوقات: ٨ص - ١٠م",
    noise: "الهدوء",
    noiseDesc: "يرجى الحفاظ على الهدوء بعد ١٠ مساءً",
    smoking: "ممنوع التدخين",
    smokingDesc: "يرجى التدخين في الخارج فقط",
    shoes: "الأحذية",
    shoesDesc: "اخلع حذائك في الداخل",
    emergency: "الطوارئ",
    police: "الشرطة",
    ambulance: "الإسعاف",
    fire: "الإطفاء",
    yourHost: "مضيفك",
    hostDesc: "متاح ٢٤/٧ لخدمتك",
    call: "اتصل",
    message: "رسالة",
    practicalInfo: "معلومات عملية",
    currency: "العملة",
    currencyDesc: "الدرهم المغربي. ١€ ≈ ١١ درهم",
    tipping: "البقشيش",
    tippingDesc: "١٠-١٥٪ مطاعم، ٢٠-٥٠ درهم خدمات",
    dress: "اللباس",
    dressDesc: "عادي لكن محتشم في المدينة القديمة",
    water: "الماء",
    waterDesc: "اشرب الماء المعبأ فقط",
    taxi: "سيارات الأجرة",
    taxiDesc: "التاكسي الصغير الأحمر. أصر على العداد",
    pharmacy: "الصيدلية",
    pharmacyDesc: "صيدلية مناوبة ٢٤/٧ متاحة",
    events: "الأحداث",
    eventsDesc: "ما يحدث في مراكش",
    seeAll: "عرض الكل",
    poweredBy: "مقدم من",
    contactUs: "اتصل بنا",
    quickActions: "إجراءات سريعة",
    extendStay: "تمديد الإقامة",
    lateCheckout: "مغادرة متأخرة",
    extraCleaning: "تنظيف إضافي",
    taxiOrder: "طلب سيارة أجرة",
    feedback: "رأيك يهمنا",
    feedbackDesc: "كيف تسير إقامتك؟",
    excellent: "ممتاز",
    good: "جيد",
    average: "متوسط",
    poor: "مخيب",
    feedbackThanks: "!شكراً لملاحظاتك",
    nearbyPharmacy: "صيدلية",
    nearbyHospital: "مستشفى",
    daysLeft: "أيام متبقية",
    dayLeft: "يوم متبقي",
    tonight: "الليلة الأخيرة",
    accessCode: "رمز الدخول",
    parkingCode: "رمز الموقف",
    logOut: "تغيير الحجز",
  },
};

// ─── MOCK: Simulated Hostaway API response ───
const mockHostawayReservations = {
  "dupont": {
    id: "HW-28491",
    guestName: "Jean & Marie Dupont",
    guestFirstName: "Jean",
    guestEmail: "jean.dupont@email.com",
    guestPhone: "+33 6 12 34 56 78",
    guestCountry: "FR",
    numberOfGuests: 4,
    children: 2,
    checkIn: "2026-04-01",
    checkOut: "2026-04-08",
    listing: {
      name: "Villa Palmeraie",
      image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?w=800&q=80",
      address: "Route de la Palmeraie, Km 8, Marrakech",
      wifi: { network: "HAVN-Palmeraie", password: "Welcome2026!" },
      accessCode: "4872#",
      parkingCode: "1234",
      maxGuests: 10,
      bedrooms: 5,
      bathrooms: 4,
      pool: true,
      amenities: ["pool", "garden", "bbq", "parking", "ac"],
    },
    host: {
      name: "Karim",
      phone: "+212 6 12 34 56 78",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    },
    source: "airbnb",
    status: "confirmed",
    totalPrice: "14000 MAD",
  },
  "smith": {
    id: "HW-28503",
    guestName: "James & Emily Smith",
    guestFirstName: "James",
    guestEmail: "james.smith@email.com",
    guestPhone: "+44 7911 123456",
    guestCountry: "GB",
    numberOfGuests: 2,
    children: 0,
    checkIn: "2026-04-03",
    checkOut: "2026-04-10",
    listing: {
      name: "Riad Ambre",
      image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=80",
      address: "Derb Sidi Ahmed, Médina, Marrakech",
      wifi: { network: "HAVN-RiadAmbre", password: "Ambre2026!" },
      accessCode: "7391#",
      parkingCode: null,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 3,
      pool: true,
      amenities: ["pool", "terrace", "hammam", "ac"],
    },
    host: {
      name: "Karim",
      phone: "+212 6 12 34 56 78",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    },
    source: "booking",
    status: "confirmed",
    totalPrice: "9800 MAD",
  },
};

// Simulate Hostaway API call
const searchReservation = async (name) => {
  await new Promise((r) => setTimeout(r, 1500)); // Simulate API latency
  const key = name.toLowerCase().trim();
  // Search by guest last name in all reservations
  const results = Object.values(mockHostawayReservations).filter((r) =>
    r.guestName.toLowerCase().includes(key)
  );
  return results;
};

// ─── SHARED MOCK DATA ───
const weatherData = {
  temp: 28, feelsLike: 31, condition: "sunny", humidity: 35, wind: 12,
  forecast: [
    { day: "Mar", temp: 29, icon: "sun" },
    { day: "Mer", temp: 27, icon: "cloud" },
    { day: "Jeu", temp: 30, icon: "sun" },
    { day: "Ven", temp: 26, icon: "rain" },
    { day: "Sam", temp: 28, icon: "sun" },
  ],
};

const restaurantsData = [
  { name: "Le Jardin", cuisine: { fr: "Marocaine moderne", en: "Modern Moroccan", ar: "مغربية حديثة" }, price: "€€€", rating: 4.7, distance: "3.2 km", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", desc: { fr: "Cadre enchanteur dans la médina", en: "Enchanting setting in the medina", ar: "أجواء ساحرة في المدينة القديمة" } },
  { name: "Nomad", cuisine: { fr: "Fusion marocaine", en: "Moroccan Fusion", ar: "فيوجن مغربي" }, price: "€€", rating: 4.5, distance: "2.8 km", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", desc: { fr: "Terrasse avec vue, ambiance cosmopolite", en: "Rooftop terrace, cosmopolitan vibe", ar: "شرفة مع إطلالة" } },
  { name: "La Mamounia", cuisine: { fr: "Gastronomique", en: "Fine Dining", ar: "أكل راقي" }, price: "€€€€", rating: 4.9, distance: "5.1 km", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80", desc: { fr: "Palace légendaire", en: "Legendary palace", ar: "قصر أسطوري" } },
];

const eventsData = [
  { name: { fr: "Festival des Arts Populaires", en: "Folk Arts Festival", ar: "مهرجان الفنون الشعبية" }, date: "12-16 Avril", location: "Palais El Badi", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80" },
  { name: { fr: "Marché nocturne Jemaa el-Fna", en: "Jemaa el-Fna Night Market", ar: "سوق جامع الفنا الليلي" }, date: { fr: "Chaque soir", en: "Every evening", ar: "كل مساء" }, location: "Place Jemaa el-Fna", image: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?w=400&q=80" },
];

// ─── HELPERS ───
const getDaysLeft = (checkOut) => {
  const now = new Date();
  const end = new Date(checkOut);
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
};

const formatDate = (dateStr, lang) => {
  const d = new Date(dateStr);
  const opts = { day: "numeric", month: "long" };
  const locale = lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR";
  return d.toLocaleDateString(locale, opts);
};

// ─── SMALL COMPONENTS ───
const WeatherIcon = ({ condition, size = 28, color = brand.gold }) => {
  const icons = { sun: Sun, sunny: Sun, cloud: Cloud, rain: CloudRain };
  const Icon = icons[condition] || Sun;
  return <Icon size={size} color={color} />;
};

const StarRating = ({ rating }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={14} fill={i <= Math.round(rating) ? brand.gold : "none"} color={brand.gold} strokeWidth={1.5} />
    ))}
    <span style={{ fontSize: 13, color: brand.textMuted, marginLeft: 4, fontWeight: 500 }}>{rating}</span>
  </div>
);

const SectionDivider = () => (
  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${brand.gold}, transparent)`, margin: "0 20px", opacity: 0.3 }} />
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: copied ? `${brand.gold}20` : `${brand.gold}08`, border: `1px solid ${brand.border}`, borderRadius: 24, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
      {copied ? <Check size={14} color={brand.gold} /> : null}
      <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: brand.dark }}>{text}</span>
      {!copied && <span style={{ fontSize: 11, color: brand.textMuted }}>⎘</span>}
    </button>
  );
};

const IconCircle = ({ children, bg = brand.gold }) => (
  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${bg}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {children}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: brand.white, borderRadius: 16, padding: 20, marginBottom: 12, border: `1px solid ${brand.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

// ═══════════════════════════════════════════
// LOOKUP SCREEN — Reservation search
// ═══════════════════════════════════════════
const LookupScreen = ({ lang, setLang, onReservationFound }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState(null);
  const t = translations[lang];
  const isRtl = lang === "ar";

  const handleSearch = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(false);
    setResults(null);
    const found = await searchReservation(name);
    setLoading(false);
    if (found.length === 1) {
      onReservationFound(found[0]);
    } else if (found.length > 1) {
      setResults(found);
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: brand.dark, display: "flex", flexDirection: "column", direction: isRtl ? "rtl" : "ltr" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Language Switcher */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 20, gap: 6 }}>
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.08)", borderRadius: 24, padding: "4px 6px" }}>
          {["fr", "en", "ar"].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: lang === l ? brand.gold : "transparent", color: lang === l ? brand.dark : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: lang === l ? 600 : 400, cursor: "pointer", transition: "all 0.3s", letterSpacing: 0.5 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Center content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", maxWidth: 430, margin: "0 auto", width: "100%" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, letterSpacing: 8, color: brand.white, fontWeight: 300 }}>
            HAVN <span style={{ color: brand.gold }}>STAYS</span>
          </div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: brand.textMuted, textTransform: "uppercase", marginTop: 6 }}>by Medini Homes</div>
        </div>

        {/* Welcome text */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: brand.white, margin: "0 0 8px", letterSpacing: -0.3 }}>
            {t.lookupTitle}
          </h1>
          <p style={{ fontSize: 14, color: brand.textMuted, margin: 0, lineHeight: 1.5 }}>
            {t.lookupSubtitle}
          </p>
        </div>

        {/* Search form */}
        <div style={{ marginBottom: 24 }}>
          {/* Name input */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <div style={{ position: "absolute", left: isRtl ? "auto" : 16, right: isRtl ? 16 : "auto", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <User size={18} color={brand.textMuted} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t.lookupPlaceholder}
              style={{
                width: "100%",
                padding: isRtl ? "16px 48px 16px 16px" : "16px 16px 16px 48px",
                background: "rgba(255,255,255,0.06)",
                border: error ? `1.5px solid ${brand.error}` : `1.5px solid rgba(255,255,255,0.1)`,
                borderRadius: 14,
                color: brand.white,
                fontSize: 15,
                fontFamily: "Inter, sans-serif",
                outline: "none",
                transition: "all 0.3s",
                boxSizing: "border-box",
                direction: isRtl ? "rtl" : "ltr",
              }}
            />
          </div>

          {/* Help text */}
          <p style={{ fontSize: 12, color: brand.textMuted, margin: "0 0 20px 4px", display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={12} color={brand.textMuted} />
            {t.lookupHelp}
          </p>

          {/* Error message */}
          {error && (
            <div style={{ background: "rgba(220,53,69,0.1)", border: `1px solid rgba(220,53,69,0.3)`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#FF6B6B", margin: 0, lineHeight: 1.5 }}>{t.lookupError}</p>
              <button onClick={() => {}} style={{ fontSize: 13, color: brand.gold, background: "none", border: "none", cursor: "pointer", padding: "8px 0 0", fontWeight: 600 }}>
                {t.lookupContactHost} →
              </button>
            </div>
          )}

          {/* Multiple results */}
          {results && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: brand.white, margin: "0 0 12px", fontWeight: 500 }}>{t.lookupMultiple}</p>
              {results.map((r, i) => (
                <button key={i} onClick={() => onReservationFound(r)}
                  style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: 16, background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 14, cursor: "pointer", marginBottom: 8, transition: "all 0.2s", textAlign: isRtl ? "right" : "left" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                    <img src={r.listing.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: brand.white }}>{r.listing.name}</div>
                    <div style={{ fontSize: 12, color: brand.textMuted, marginTop: 2 }}>
                      {formatDate(r.checkIn, lang)} → {formatDate(r.checkOut, lang)}
                    </div>
                  </div>
                  <ChevronRight size={18} color={brand.gold} />
                </button>
              ))}
            </div>
          )}

          {/* Search button */}
          <button onClick={handleSearch} disabled={loading || !name.trim()}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "16px 24px",
              background: (!name.trim() || loading) ? "rgba(197,165,90,0.3)" : `linear-gradient(135deg, ${brand.gold} 0%, ${brand.goldDark} 100%)`,
              color: brand.dark, border: "none", borderRadius: 14,
              fontSize: 15, fontWeight: 600, cursor: (!name.trim() || loading) ? "default" : "pointer",
              letterSpacing: 0.3, transition: "all 0.3s",
              boxShadow: name.trim() && !loading ? "0 4px 20px rgba(197,165,90,0.3)" : "none",
            }}>
            {loading ? (
              <><Loader size={18} style={{ animation: "spin 1s linear infinite" }} /> {t.lookupSearching}</>
            ) : (
              <><Search size={18} /> {t.lookupButton}</>
            )}
          </button>
        </div>

        {/* Privacy note */}
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Shield size={12} /> {t.lookupPrivacy}
        </p>
      </div>

      {/* Spinner animation */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN GUIDE — After reservation found
// ═══════════════════════════════════════════
const GuideScreen = ({ reservation, lang, setLang, onLogout }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const t = translations[lang];
  const isRtl = lang === "ar";
  const r = reservation;
  const daysLeft = getDaysLeft(r.checkOut);

  const detectLang = () => {
    // Auto-detect language based on guest country
    if (["MA", "DZ", "TN", "SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB", "IQ", "EG"].includes(r.guestCountry)) return "ar";
    if (["FR", "BE", "CH", "LU", "MC", "SN", "CI"].includes(r.guestCountry)) return "fr";
    return "en";
  };

  useEffect(() => {
    setLang(detectLang());
  }, []);

  const conciergeServices = [
    { icon: <UtensilsCrossed size={20} color={brand.gold} />, label: t.privateChef, desc: t.privateChefDesc, price: "800 MAD" },
    { icon: <Car size={20} color={brand.gold} />, label: t.transfer, desc: t.transferDesc, price: "250 MAD" },
    { icon: <Droplets size={20} color={brand.gold} />, label: t.massage, desc: t.massageDesc, price: "500 MAD" },
    { icon: <Navigation size={20} color={brand.gold} />, label: t.excursion, desc: t.excursionDesc, price: "1200 MAD" },
    { icon: <Heart size={20} color={brand.gold} />, label: t.babysitting, desc: t.babysittingDesc, price: "200 MAD/h" },
    { icon: <ShoppingBag size={20} color={brand.gold} />, label: t.grocery, desc: t.groceryDesc, price: "150 MAD+" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: brand.cream, minHeight: "100vh", maxWidth: 430, margin: "0 auto", direction: isRtl ? "rtl" : "ltr" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ─── HERO ─── */}
      <div style={{ position: "relative", height: 400, overflow: "hidden" }}>
        <img src={r.listing.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,25,35,0.15) 0%, rgba(15,25,35,0.88) 100%)" }} />

        {/* Lang switcher */}
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 4, background: "rgba(15,25,35,0.5)", backdropFilter: "blur(10px)", borderRadius: 24, padding: "4px 6px", zIndex: 10 }}>
          {["fr", "en", "ar"].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: "6px 12px", borderRadius: 20, border: "none", background: lang === l ? brand.gold : "transparent", color: lang === l ? brand.dark : "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: lang === l ? 600 : 400, cursor: "pointer" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 28px", color: brand.white }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 6, color: brand.gold, marginBottom: 4 }}>
            HAVN <span style={{ fontWeight: 300 }}>STAYS</span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, lineHeight: 1.1, marginBottom: 8 }}>
            {t.welcome}, {r.guestFirstName}
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>
            {r.listing.name}
          </div>
        </div>
      </div>

      {/* ─── STAY COUNTDOWN BANNER ─── */}
      <div style={{ background: `linear-gradient(135deg, ${brand.dark} 0%, ${brand.navy} 100%)`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Calendar size={18} color={brand.gold} />
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{t.stayDates}</div>
            <div style={{ fontSize: 14, color: brand.white, fontWeight: 500 }}>
              {formatDate(r.checkIn, lang)} → {formatDate(r.checkOut, lang)}
            </div>
          </div>
        </div>
        <div style={{ background: `${brand.gold}20`, borderRadius: 24, padding: "6px 14px" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: brand.gold, fontFamily: "'Cormorant Garamond', serif" }}>{daysLeft}</span>
          <span style={{ fontSize: 11, color: brand.gold, marginLeft: 4 }}>{daysLeft === 1 ? t.dayLeft : daysLeft === 0 ? t.tonight : t.daysLeft}</span>
        </div>
      </div>

      {/* ─── KEY PROPERTY INFO ─── */}
      <div style={{ padding: "20px 20px 8px" }}>
        {/* Check-in / Check-out */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <Card style={{ flex: 1, marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle><Clock size={20} color={brand.gold} /></IconCircle>
            <div>
              <div style={{ fontSize: 11, color: brand.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.checkIn}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: brand.dark, fontFamily: "'Cormorant Garamond', serif" }}>15:00</div>
            </div>
          </Card>
          <Card style={{ flex: 1, marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle><Clock size={20} color={brand.gold} /></IconCircle>
            <div>
              <div style={{ fontSize: 11, color: brand.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.checkOut}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: brand.dark, fontFamily: "'Cormorant Garamond', serif" }}>11:00</div>
            </div>
          </Card>
        </div>

        {/* WiFi */}
        <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconCircle><Wifi size={20} color={brand.gold} /></IconCircle>
            <div>
              <div style={{ fontSize: 11, color: brand.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.wifi}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark }}>{r.listing.wifi.network}</div>
            </div>
          </div>
          <CopyButton text={r.listing.wifi.password} />
        </Card>

        {/* Access & Parking codes */}
        <div style={{ display: "flex", gap: 10 }}>
          {r.listing.accessCode && (
            <Card style={{ flex: 1, marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
              <IconCircle><Lock size={20} color={brand.gold} /></IconCircle>
              <div>
                <div style={{ fontSize: 11, color: brand.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.accessCode}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: brand.dark, fontFamily: "monospace", letterSpacing: 2 }}>{r.listing.accessCode}</div>
              </div>
            </Card>
          )}
          {r.listing.parkingCode && (
            <Card style={{ flex: 1, marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
              <IconCircle><Car size={20} color={brand.gold} /></IconCircle>
              <div>
                <div style={{ fontSize: 11, color: brand.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.parkingCode}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: brand.dark, fontFamily: "monospace", letterSpacing: 2 }}>{r.listing.parkingCode}</div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <SectionDivider />

      {/* ─── WEATHER ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.weather}</div>
        <div style={{ background: `linear-gradient(135deg, ${brand.dark} 0%, ${brand.navy} 100%)`, borderRadius: 20, padding: 24, color: brand.white }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300, lineHeight: 1 }}>{weatherData.temp}°</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{t.feelsLike} {weatherData.feelsLike}°</div>
            </div>
            <WeatherIcon condition={weatherData.condition} size={52} color={brand.gold} />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}><Droplets size={14} color={brand.gold} /> {weatherData.humidity}%</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}><Wind size={14} color={brand.gold} /> {weatherData.wind} km/h</div>
          </div>
          <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
            {weatherData.forecast.map((d, i) => (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{d.day}</div>
                <WeatherIcon condition={d.icon} size={18} color={brand.gold} />
                <div style={{ fontSize: 14, fontWeight: 500, color: brand.white, marginTop: 6 }}>{d.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* ─── QUICK ACTIONS ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 14 }}>{t.quickActions}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { icon: <Clock size={14} color={brand.gold} />, label: t.extendStay },
            { icon: <Clock size={14} color={brand.gold} />, label: t.lateCheckout },
            { icon: <Sparkles size={14} color={brand.gold} />, label: t.extraCleaning },
            { icon: <Car size={14} color={brand.gold} />, label: t.taxiOrder },
          ].map((a, i) => (
            <button key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${brand.gold}08`, border: `1px solid ${brand.border}`, borderRadius: 24, padding: "8px 16px", fontSize: 13, color: brand.dark, fontWeight: 500, cursor: "pointer" }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* ─── EXPLORE ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.explore}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: <UtensilsCrossed size={22} color={brand.gold} />, label: t.restaurants, desc: t.restaurantsDesc, bg: "#F5E6D0" },
            { icon: <Camera size={22} color={brand.gold} />, label: t.attractions, desc: t.attractionsDesc, bg: "#E8EFE6" },
            { icon: <Droplets size={22} color={brand.gold} />, label: t.wellness, desc: t.wellnessDesc, bg: "#E6E8F0" },
            { icon: <ShoppingBag size={22} color={brand.gold} />, label: t.shopping, desc: t.shoppingDesc, bg: "#F0E6E8" },
            { icon: <Music size={22} color={brand.gold} />, label: t.nightlife, desc: t.nightlifeDesc, bg: "#EDE6F0" },
            { icon: <BookOpen size={22} color={brand.gold} />, label: t.culture, desc: t.cultureDesc, bg: "#E6F0ED" },
            ...(r.children > 0 ? [{ icon: <Heart size={22} color={brand.gold} />, label: t.families, desc: t.familiesDesc, bg: "#F5E8E6" }] : []),
            { icon: <Navigation size={22} color={brand.gold} />, label: t.dayTrips, desc: t.dayTripsDesc, bg: "#F0EDE6" },
          ].map((cat, i) => (
            <div key={i} style={{ background: brand.white, borderRadius: 16, padding: 18, border: `1px solid ${brand.borderLight}`, cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark, marginBottom: 2 }}>{cat.label}</div>
              <div style={{ fontSize: 12, color: brand.textMuted }}>{cat.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* ─── RESTAURANTS ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark }}>{t.restaurants}</div>
          <button style={{ fontSize: 13, color: brand.gold, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>{t.seeAll} →</button>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {restaurantsData.map((rest, i) => (
            <div key={i} style={{ minWidth: 260, background: brand.white, borderRadius: 16, overflow: "hidden", border: `1px solid ${brand.borderLight}`, flexShrink: 0 }}>
              <div style={{ position: "relative", height: 140 }}>
                <img src={rest.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: 10, right: 10, fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${brand.gold}12`, color: brand.goldDark, fontWeight: 500, border: `1px solid ${brand.border}` }}>{rest.price}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: brand.dark, marginBottom: 4, fontFamily: "'Cormorant Garamond', serif" }}>{rest.name}</div>
                <div style={{ fontSize: 12, color: brand.textMuted, marginBottom: 8 }}>{rest.cuisine[lang]} · {rest.distance}</div>
                <StarRating rating={rest.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* ─── EVENTS ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.events}</div>
        {eventsData.map((e, i) => (
          <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
              <img src={e.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark }}>{typeof e.name === "object" ? e.name[lang] : e.name}</div>
              <div style={{ fontSize: 12, color: brand.textMuted, marginTop: 2 }}>
                <Calendar size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{typeof e.date === "object" ? e.date[lang] : e.date}
              </div>
              <div style={{ fontSize: 12, color: brand.textMuted, marginTop: 1 }}>
                <MapPin size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{e.location}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SectionDivider />

      {/* ─── CONCIERGE SERVICES ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 4 }}>{t.services}</div>
        <div style={{ fontSize: 13, color: brand.textMuted, marginBottom: 20 }}>{t.servicesDesc}</div>
        {conciergeServices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: brand.white, borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: `1px solid ${brand.borderLight}`, cursor: "pointer" }}>
            <IconCircle>{s.icon}</IconCircle>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark }}>{s.label}</div>
              <div style={{ fontSize: 12, color: brand.textMuted, marginTop: 2 }}>{s.desc}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: brand.gold }}>{s.price}</div>
              <div style={{ fontSize: 11, color: brand.textMuted }}>{t.request} →</div>
            </div>
          </div>
        ))}
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px 24px", background: brand.gold, color: brand.dark, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
          <MessageCircle size={18} /> {t.contactUs}
        </button>
      </div>

      <SectionDivider />

      {/* ─── YOUR HOST ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.yourHost}</div>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `2px solid ${brand.gold}`, flexShrink: 0 }}>
            <img src={r.host.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, color: brand.dark, fontFamily: "'Cormorant Garamond', serif" }}>{r.host.name}</div>
            <div style={{ fontSize: 13, color: brand.textMuted }}>Havn Stays Concierge</div>
          </div>
        </Card>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1, padding: "14px", background: brand.gold, color: brand.dark, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <Phone size={16} /> {t.call}
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flex: 1, padding: "14px", background: "transparent", color: brand.gold, border: `1.5px solid ${brand.gold}`, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <MessageCircle size={16} /> WhatsApp
          </button>
        </div>
      </div>

      <SectionDivider />

      {/* ─── HOUSE RULES ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.houseRules}</div>
        <Card>
          {[
            { icon: <Waves size={18} color={brand.gold} />, label: t.pool, desc: t.poolHours },
            { icon: <Music size={18} color={brand.gold} />, label: t.noise, desc: t.noiseDesc },
            { icon: <Wind size={18} color={brand.gold} />, label: t.smoking, desc: t.smokingDesc },
            { icon: <BookOpen size={18} color={brand.gold} />, label: t.shoes, desc: t.shoesDesc },
          ].map((rule, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${brand.borderLight}` : "none" }}>
              <IconCircle>{rule.icon}</IconCircle>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark }}>{rule.label}</div>
                <div style={{ fontSize: 12, color: brand.textMuted, marginTop: 2 }}>{rule.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <SectionDivider />

      {/* ─── PRACTICAL INFO ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.practicalInfo}</div>
        <Card>
          {[
            { icon: "💰", label: t.currency, desc: t.currencyDesc },
            { icon: "💡", label: t.tipping, desc: t.tippingDesc },
            { icon: "👔", label: t.dress, desc: t.dressDesc },
            { icon: "💧", label: t.water, desc: t.waterDesc },
            { icon: "🚕", label: t.taxi, desc: t.taxiDesc },
            { icon: "💊", label: t.pharmacy, desc: t.pharmacyDesc },
          ].map((p, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderBottom: i < arr.length - 1 ? `1px solid ${brand.borderLight}` : "none" }}>
              <div style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: brand.dark }}>{p.label}</div>
                <div style={{ fontSize: 13, color: brand.textMuted, marginTop: 2, lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <SectionDivider />

      {/* ─── EMERGENCY ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 16 }}>{t.emergency}</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {[
            { label: t.police, num: "19", color: "#3B82F6" },
            { label: t.ambulance, num: "15", color: "#EF4444" },
            { label: t.fire, num: "15", color: "#F97316" },
          ].map((e, i) => (
            <Card key={i} style={{ flex: 1, textAlign: "center", marginBottom: 0, padding: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${e.color}15`, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={16} color={e.color} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: brand.dark }}>{e.num}</div>
              <div style={{ fontSize: 11, color: brand.textMuted, marginTop: 2 }}>{e.label}</div>
            </Card>
          ))}
        </div>
      </div>

      <SectionDivider />

      {/* ─── FEEDBACK ─── */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: brand.dark, marginBottom: 4 }}>{t.feedback}</div>
        <div style={{ fontSize: 13, color: brand.textMuted, marginBottom: 16 }}>{t.feedbackDesc}</div>
        {!feedbackGiven ? (
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { emoji: "😍", label: t.excellent },
              { emoji: "😊", label: t.good },
              { emoji: "😐", label: t.average },
              { emoji: "😞", label: t.poor },
            ].map((f, i) => (
              <button key={i} onClick={() => setFeedbackGiven(true)}
                style={{ flex: 1, background: brand.white, borderRadius: 16, padding: 14, border: `1px solid ${brand.borderLight}`, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{f.emoji}</div>
                <div style={{ fontSize: 11, color: brand.textMuted, fontWeight: 500 }}>{f.label}</div>
              </button>
            ))}
          </div>
        ) : (
          <Card style={{ textAlign: "center", padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🙏</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: brand.dark, fontFamily: "'Cormorant Garamond', serif" }}>{t.feedbackThanks}</div>
          </Card>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ textAlign: "center", padding: "24px 20px 40px" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 4, color: brand.gold }}>HAVN <span style={{ fontWeight: 300 }}>STAYS</span></div>
        <div style={{ fontSize: 11, color: brand.textLight, marginTop: 4 }}>by Medini Homes</div>
        <button onClick={onLogout} style={{ fontSize: 12, color: brand.textMuted, background: "none", border: "none", cursor: "pointer", marginTop: 16, textDecoration: "underline" }}>
          {t.logOut}
        </button>
      </div>

      {/* ─── FAB WhatsApp ─── */}
      <button style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${brand.gold} 0%, ${brand.goldDark} 100%)`, color: brand.dark, border: "none", boxShadow: "0 4px 20px rgba(197,165,90,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40 }}>
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════
// ROOT — orchestrates lookup → guide
// ═══════════════════════════════════════════
export default function HavnWelcomeGuide() {
  const [lang, setLang] = useState("fr");
  const [reservation, setReservation] = useState(null);

  if (!reservation) {
    return <LookupScreen lang={lang} setLang={setLang} onReservationFound={setReservation} />;
  }

  return <GuideScreen reservation={reservation} lang={lang} setLang={setLang} onLogout={() => setReservation(null)} />;
}