/* =========================================================
   FreshBite — Data Layer
   Everything lives in plain JS arrays/objects. No backend,
   no database — this simulates one for the internship brief.
   ========================================================= */

const CUISINES = ["Italian", "Indian", "Chinese", "Mexican", "American", "Japanese", "Desserts"];

const RESTAURANTS = [
  { id: "r1", name: "Nonna's Table", cuisine: "Italian", rating: 4.7, reviews: 312, priceTier: 2, time: "25-35 min", emoji: "🍝", tagline: "Slow-simmered sauces, fast-fired pizzas", banner: "🍕" },
  { id: "r2", name: "Spice Route", cuisine: "Indian", rating: 4.8, reviews: 501, priceTier: 2, time: "30-40 min", emoji: "🍛", tagline: "Curries with a story behind every spoonful", banner: "🍛" },
  { id: "r3", name: "Golden Wok", cuisine: "Chinese", rating: 4.5, reviews: 218, priceTier: 1, time: "20-30 min", emoji: "🥡", tagline: "Wok-tossed favorites, done fast", banner: "🥢" },
  { id: "r4", name: "Casa Fiesta", cuisine: "Mexican", rating: 4.6, reviews: 176, priceTier: 1, time: "20-30 min", emoji: "🌮", tagline: "Street tacos with a homemade edge", banner: "🌮" },
  { id: "r5", name: "The Griddle House", cuisine: "American", rating: 4.4, reviews: 143, priceTier: 2, time: "25-35 min", emoji: "🍔", tagline: "Classic comfort, stacked high", banner: "🍔" },
  { id: "r6", name: "Sakura Sushi", cuisine: "Japanese", rating: 4.9, reviews: 402, priceTier: 3, time: "35-45 min", emoji: "🍣", tagline: "Precision rolls, ocean-fresh", banner: "🍣" },
  { id: "r7", name: "Sweet Ember Bakery", cuisine: "Desserts", rating: 4.8, reviews: 267, priceTier: 2, time: "15-25 min", emoji: "🍰", tagline: "Warm-from-the-oven happiness", banner: "🧁" },
];

/* dietary: veg | nonveg | vegan | gf (gluten-free can combine with veg/vegan) */
const MENU_ITEMS = [
  // Nonna's Table
  { id: "m101", restaurantId: "r1", name: "Margherita Pizza", category: "Mains", price: 12.99, emoji: "🍕", dietary: ["veg"], rating: 4.7, popular: true,
    desc: "Wood-fired thin crust with San Marzano tomatoes, fresh mozzarella, and basil.",
    ingredients: ["Pizza dough", "San Marzano tomato sauce", "Fresh mozzarella", "Basil", "Olive oil"],
    nutrition: { cal: 780, protein: "28g", carbs: "88g", fat: "32g" } },
  { id: "m102", restaurantId: "r1", name: "Fettuccine Alfredo", category: "Mains", price: 14.5, emoji: "🍝", dietary: ["veg"], rating: 4.5, popular: false,
    desc: "Silky parmesan cream sauce tossed with fresh fettuccine and cracked pepper.",
    ingredients: ["Fettuccine pasta", "Parmesan", "Butter", "Heavy cream", "Black pepper"],
    nutrition: { cal: 890, protein: "22g", carbs: "76g", fat: "48g" } },
  { id: "m103", restaurantId: "r1", name: "Chicken Parmigiana", category: "Mains", price: 16.99, emoji: "🍗", dietary: ["nonveg"], rating: 4.8, popular: true,
    desc: "Crispy breaded chicken breast, marinara, melted mozzarella, side of spaghetti.",
    ingredients: ["Chicken breast", "Breadcrumbs", "Marinara sauce", "Mozzarella", "Spaghetti"],
    nutrition: { cal: 1020, protein: "52g", carbs: "70g", fat: "44g" } },
  { id: "m104", restaurantId: "r1", name: "Bruschetta al Pomodoro", category: "Starters", price: 7.5, emoji: "🥖", dietary: ["vegan", "gf"], rating: 4.3, popular: false,
    desc: "Grilled gluten-free crostini topped with marinated tomato, garlic, and basil.",
    ingredients: ["GF baguette", "Roma tomato", "Garlic", "Basil", "Olive oil"],
    nutrition: { cal: 210, protein: "5g", carbs: "26g", fat: "9g" } },
  { id: "m105", restaurantId: "r1", name: "Tiramisu", category: "Desserts", price: 6.99, emoji: "🍮", dietary: ["veg"], rating: 4.9, popular: true,
    desc: "Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.",
    ingredients: ["Ladyfingers", "Mascarpone", "Espresso", "Cocoa powder", "Egg"],
    nutrition: { cal: 420, protein: "6g", carbs: "38g", fat: "26g" } },

  // Spice Route
  { id: "m201", restaurantId: "r2", name: "Butter Chicken", category: "Mains", price: 13.99, emoji: "🍛", dietary: ["nonveg", "gf"], rating: 4.8, popular: true,
    desc: "Tandoor-roasted chicken simmered in a velvety tomato-butter gravy.",
    ingredients: ["Chicken thigh", "Tomato", "Butter", "Cream", "Garam masala"],
    nutrition: { cal: 640, protein: "36g", carbs: "18g", fat: "40g" } },
  { id: "m202", restaurantId: "r2", name: "Paneer Tikka Masala", category: "Mains", price: 12.5, emoji: "🧆", dietary: ["veg", "gf"], rating: 4.6, popular: true,
    desc: "Chargrilled cottage cheese cubes in a smoky, spiced onion-tomato masala.",
    ingredients: ["Paneer", "Bell peppers", "Onion", "Tomato", "Spice blend"],
    nutrition: { cal: 520, protein: "24g", carbs: "22g", fat: "34g" } },
  { id: "m203", restaurantId: "r2", name: "Vegetable Biryani", category: "Mains", price: 11.99, emoji: "🍚", dietary: ["vegan", "gf"], rating: 4.4, popular: false,
    desc: "Fragrant basmati layered with saffron, fried onions, and garden vegetables.",
    ingredients: ["Basmati rice", "Mixed vegetables", "Saffron", "Fried onion", "Whole spices"],
    nutrition: { cal: 560, protein: "12g", carbs: "92g", fat: "14g" } },
  { id: "m204", restaurantId: "r2", name: "Garlic Naan", category: "Starters", price: 3.5, emoji: "🫓", dietary: ["veg"], rating: 4.7, popular: true,
    desc: "Tandoor-charred flatbread brushed with garlic butter.",
    ingredients: ["Flour", "Yogurt", "Garlic", "Butter"],
    nutrition: { cal: 260, protein: "7g", carbs: "38g", fat: "9g" } },
  { id: "m205", restaurantId: "r2", name: "Gulab Jamun", category: "Desserts", price: 5.5, emoji: "🍡", dietary: ["veg"], rating: 4.8, popular: false,
    desc: "Warm milk-solid dumplings soaked in cardamom-rose syrup.",
    ingredients: ["Milk powder", "Flour", "Sugar syrup", "Cardamom", "Rose water"],
    nutrition: { cal: 380, protein: "5g", carbs: "58g", fat: "14g" } },

  // Golden Wok
  { id: "m301", restaurantId: "r3", name: "Kung Pao Chicken", category: "Mains", price: 11.5, emoji: "🥡", dietary: ["nonveg"], rating: 4.5, popular: true,
    desc: "Wok-seared chicken, peanuts, and chilies in a sweet-spicy glaze.",
    ingredients: ["Chicken breast", "Peanuts", "Dried chili", "Scallion", "Soy sauce"],
    nutrition: { cal: 610, protein: "34g", carbs: "30g", fat: "36g" } },
  { id: "m302", restaurantId: "r3", name: "Vegetable Fried Rice", category: "Mains", price: 9.5, emoji: "🍚", dietary: ["vegan"], rating: 4.2, popular: false,
    desc: "Classic wok-tossed rice with egg, carrots, peas, and scallion.",
    ingredients: ["Jasmine rice", "Carrot", "Peas", "Egg", "Soy sauce"],
    nutrition: { cal: 480, protein: "10g", carbs: "78g", fat: "12g" } },
  { id: "m303", restaurantId: "r3", name: "Spring Rolls", category: "Starters", price: 6.0, emoji: "🥟", dietary: ["veg"], rating: 4.3, popular: false,
    desc: "Crispy rolls stuffed with cabbage, carrot, and glass noodles.",
    ingredients: ["Wonton wrapper", "Cabbage", "Carrot", "Glass noodles"],
    nutrition: { cal: 290, protein: "6g", carbs: "34g", fat: "14g" } },
  { id: "m304", restaurantId: "r3", name: "Sweet & Sour Pork", category: "Mains", price: 12.0, emoji: "🍖", dietary: ["nonveg"], rating: 4.4, popular: true,
    desc: "Crispy pork tossed in a tangy pineapple sweet-sour sauce.",
    ingredients: ["Pork", "Pineapple", "Bell pepper", "Vinegar", "Ketchup"],
    nutrition: { cal: 720, protein: "30g", carbs: "58g", fat: "38g" } },

  // Casa Fiesta
  { id: "m401", restaurantId: "r4", name: "Street Tacos (3pc)", category: "Mains", price: 9.99, emoji: "🌮", dietary: ["nonveg", "gf"], rating: 4.7, popular: true,
    desc: "Corn tortillas, char-grilled steak, onion, cilantro, and lime.",
    ingredients: ["Corn tortilla", "Steak", "Onion", "Cilantro", "Lime"],
    nutrition: { cal: 560, protein: "32g", carbs: "40g", fat: "26g" } },
  { id: "m402", restaurantId: "r4", name: "Veggie Burrito Bowl", category: "Mains", price: 10.5, emoji: "🥙", dietary: ["vegan", "gf"], rating: 4.4, popular: false,
    desc: "Cilantro-lime rice, black beans, pico de gallo, and roasted corn.",
    ingredients: ["Rice", "Black beans", "Pico de gallo", "Corn", "Avocado"],
    nutrition: { cal: 610, protein: "16g", carbs: "88g", fat: "20g" } },
  { id: "m403", restaurantId: "r4", name: "Loaded Nachos", category: "Starters", price: 8.5, emoji: "🧀", dietary: ["veg", "gf"], rating: 4.6, popular: true,
    desc: "Crispy chips buried in melted cheese, jalapeño, and salsa.",
    ingredients: ["Corn chips", "Cheddar", "Jalapeño", "Salsa", "Sour cream"],
    nutrition: { cal: 780, protein: "20g", carbs: "62g", fat: "48g" } },

  // The Griddle House
  { id: "m501", restaurantId: "r5", name: "Classic Cheeseburger", category: "Mains", price: 10.99, emoji: "🍔", dietary: ["nonveg"], rating: 4.5, popular: true,
    desc: "Griddled beef patty, cheddar, lettuce, tomato, house sauce, brioche bun.",
    ingredients: ["Beef patty", "Cheddar", "Lettuce", "Tomato", "Brioche bun"],
    nutrition: { cal: 720, protein: "38g", carbs: "42g", fat: "40g" } },
  { id: "m502", restaurantId: "r5", name: "Crispy Chicken Sandwich", category: "Mains", price: 11.5, emoji: "🍗", dietary: ["nonveg"], rating: 4.6, popular: true,
    desc: "Buttermilk-fried chicken, pickles, spicy mayo, toasted bun.",
    ingredients: ["Chicken thigh", "Buttermilk batter", "Pickles", "Spicy mayo"],
    nutrition: { cal: 760, protein: "40g", carbs: "50g", fat: "38g" } },
  { id: "m503", restaurantId: "r5", name: "Loaded Fries", category: "Starters", price: 6.99, emoji: "🍟", dietary: ["veg", "gf"], rating: 4.3, popular: false,
    desc: "Crispy fries topped with cheese sauce, bacon bits, and scallion.",
    ingredients: ["Potato", "Cheese sauce", "Bacon", "Scallion"],
    nutrition: { cal: 640, protein: "14g", carbs: "56g", fat: "38g" } },

  // Sakura Sushi
  { id: "m601", restaurantId: "r6", name: "Salmon Nigiri Set", category: "Mains", price: 15.99, emoji: "🍣", dietary: ["nonveg", "gf"], rating: 4.9, popular: true,
    desc: "Eight pieces of hand-pressed sushi rice topped with fresh salmon.",
    ingredients: ["Sushi rice", "Salmon", "Nori", "Wasabi"],
    nutrition: { cal: 420, protein: "26g", carbs: "58g", fat: "8g" } },
  { id: "m602", restaurantId: "r6", name: "Rainbow Roll", category: "Mains", price: 13.5, emoji: "🍣", dietary: ["nonveg"], rating: 4.8, popular: true,
    desc: "California roll draped in tuna, salmon, and avocado.",
    ingredients: ["Crab stick", "Avocado", "Tuna", "Salmon", "Sushi rice"],
    nutrition: { cal: 480, protein: "22g", carbs: "60g", fat: "16g" } },
  { id: "m603", restaurantId: "r6", name: "Veggie Roll", category: "Mains", price: 9.5, emoji: "🥑", dietary: ["vegan"], rating: 4.3, popular: false,
    desc: "Cucumber, avocado, and pickled radish rolled in seasoned rice.",
    ingredients: ["Cucumber", "Avocado", "Pickled radish", "Sushi rice", "Nori"],
    nutrition: { cal: 320, protein: "6g", carbs: "62g", fat: "6g" } },
  { id: "m604", restaurantId: "r6", name: "Miso Soup", category: "Starters", price: 3.99, emoji: "🍲", dietary: ["vegan", "gf"], rating: 4.4, popular: false,
    desc: "Silken tofu and wakame in a warm dashi-miso broth.",
    ingredients: ["Miso paste", "Tofu", "Wakame", "Dashi"],
    nutrition: { cal: 90, protein: "6g", carbs: "8g", fat: "4g" } },

  // Sweet Ember Bakery
  { id: "m701", restaurantId: "r7", name: "Molten Chocolate Cake", category: "Desserts", price: 7.99, emoji: "🍫", dietary: ["veg"], rating: 4.9, popular: true,
    desc: "Warm dark chocolate cake with a liquid center, dusted with cocoa.",
    ingredients: ["Dark chocolate", "Butter", "Egg", "Sugar", "Flour"],
    nutrition: { cal: 540, protein: "7g", carbs: "58g", fat: "32g" } },
  { id: "m702", restaurantId: "r7", name: "Vegan Berry Tart", category: "Desserts", price: 6.5, emoji: "🫐", dietary: ["vegan"], rating: 4.5, popular: false,
    desc: "Almond crust filled with cashew cream and fresh mixed berries.",
    ingredients: ["Almond flour", "Cashew cream", "Mixed berries", "Maple syrup"],
    nutrition: { cal: 380, protein: "6g", carbs: "42g", fat: "20g" } },
  { id: "m703", restaurantId: "r7", name: "Gluten-Free Brownie", category: "Desserts", price: 5.5, emoji: "🍪", dietary: ["veg", "gf"], rating: 4.6, popular: true,
    desc: "Fudgy cocoa brownie made with almond flour, no gluten in sight.",
    ingredients: ["Almond flour", "Cocoa", "Eggs", "Butter", "Sugar"],
    nutrition: { cal: 310, protein: "5g", carbs: "30g", fat: "20g" } },
];

const REVIEWS = [
  { id: "rv1", itemId: "m101", user: "Priya S.", rating: 5, text: "Crust was perfectly charred, tasted like Naples.", date: "2026-07-02" },
  { id: "rv2", itemId: "m101", user: "Daniel K.", rating: 4, text: "Great flavor, wish it came a bit hotter.", date: "2026-06-18" },
  { id: "rv3", itemId: "m201", user: "Ahana R.", rating: 5, text: "Best butter chicken I've had delivered, hands down.", date: "2026-07-10" },
  { id: "rv4", itemId: "m601", user: "Marco T.", rating: 5, text: "Fish was so fresh, texture was perfect.", date: "2026-07-15" },
  { id: "rv5", itemId: "m701", user: "Lena F.", rating: 5, text: "Center was still molten when it arrived, incredible.", date: "2026-07-05" },
];

const COUPONS = {
  "FRESH10": { type: "percent", value: 10, desc: "10% off your order" },
  "WELCOME15": { type: "percent", value: 15, desc: "15% off for new customers" },
  "FREESHIP": { type: "shipping", value: 100, desc: "Free delivery" },
};

const DELIVERY_SLOTS = ["As soon as possible (30-40 min)", "Today, 6:00 PM - 6:30 PM", "Today, 7:00 PM - 7:30 PM", "Today, 8:00 PM - 8:30 PM", "Tomorrow, 12:00 PM - 12:30 PM"];

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.07;

/* ---------------- Runtime app state (in-memory only) ---------------- */
const AppState = {
  currentUser: null,           // { name, email }
  cart: [],                    // [{ itemId, qty }]
  wishlist: [],                // [itemId]
  orders: [],                  // simulated order history
  appliedCoupon: null,
  selectedRestaurantId: null,
  selectedItemId: null,
  filters: { cuisine: "All", dietary: "All", price: "All", sort: "recommended" },
  savedAddresses: [
    { id: "a1", label: "Home", line: "12 Maple Street, Jaipur, RJ 302001" },
  ],
};

/* ---------------- Real photos ----------------
   Sourced live from Flickr (Creative Commons licensed) via the
   LoremFlickr keyword service: https://loremflickr.com/WIDTHxHEIGHT/keyword
   Each id is locked to a fixed keyword+seed so the same dish/restaurant
   always shows the same photo instead of a random one on every reload. */
const IMAGES = {
  r1: "https://loremflickr.com/640/400/italian,restaurant,pizza?lock=101",
  r2: "https://loremflickr.com/640/400/indian,curry,food?lock=102",
  r3: "https://loremflickr.com/640/400/chinese,wok,food?lock=103",
  r4: "https://loremflickr.com/640/400/mexican,tacos,food?lock=104",
  r5: "https://loremflickr.com/640/400/burger,diner,food?lock=105",
  r6: "https://loremflickr.com/640/400/sushi,japanese,food?lock=106",
  r7: "https://loremflickr.com/640/400/bakery,dessert,food?lock=107",

  m101: "https://loremflickr.com/500/400/margherita,pizza?lock=201",
  m102: "https://loremflickr.com/500/400/fettuccine,pasta?lock=202",
  m103: "https://loremflickr.com/500/400/chicken,parmigiana?lock=203",
  m104: "https://loremflickr.com/500/400/bruschetta,tomato?lock=204",
  m105: "https://loremflickr.com/500/400/tiramisu,dessert?lock=205",

  m201: "https://loremflickr.com/500/400/butter,chicken,curry?lock=211",
  m202: "https://loremflickr.com/500/400/paneer,tikka?lock=212",
  m203: "https://loremflickr.com/500/400/biryani,rice?lock=213",
  m204: "https://loremflickr.com/500/400/naan,bread?lock=214",
  m205: "https://loremflickr.com/500/400/gulab,jamun,dessert?lock=215",

  m301: "https://loremflickr.com/500/400/kungpao,chicken?lock=221",
  m302: "https://loremflickr.com/500/400/fried,rice?lock=222",
  m303: "https://loremflickr.com/500/400/springroll,food?lock=223",
  m304: "https://loremflickr.com/500/400/sweetsour,pork?lock=224",

  m401: "https://loremflickr.com/500/400/street,tacos?lock=231",
  m402: "https://loremflickr.com/500/400/burrito,bowl?lock=232",
  m403: "https://loremflickr.com/500/400/nachos,cheese?lock=233",

  m501: "https://loremflickr.com/500/400/cheeseburger,food?lock=241",
  m502: "https://loremflickr.com/500/400/fried,chicken,sandwich?lock=242",
  m503: "https://loremflickr.com/500/400/loaded,fries?lock=243",

  m601: "https://loremflickr.com/500/400/salmon,nigiri,sushi?lock=251",
  m602: "https://loremflickr.com/500/400/sushi,roll?lock=252",
  m603: "https://loremflickr.com/500/400/avocado,sushi?lock=253",
  m604: "https://loremflickr.com/500/400/miso,soup?lock=254",

  m701: "https://loremflickr.com/500/400/chocolate,lava,cake?lock=261",
  m702: "https://loremflickr.com/500/400/berry,tart?lock=262",
  m703: "https://loremflickr.com/500/400/chocolate,brownie?lock=263",

  hero: "https://loremflickr.com/700/700/ramen,noodles?lock=301",
  about: "https://loremflickr.com/700/700/chef,cooking,kitchen?lock=302",
};
function imgFor(id) { return IMAGES[id] || null; }

function getRestaurant(id) { return RESTAURANTS.find(r => r.id === id); }
function getMenuItem(id) { return MENU_ITEMS.find(m => m.id === id); }
function getItemsByRestaurant(id) { return MENU_ITEMS.filter(m => m.restaurantId === id); }
function getReviewsForItem(id) { return REVIEWS.filter(r => r.itemId === id); }
