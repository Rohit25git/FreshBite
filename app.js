/* =========================================================
   FreshBite — App Logic
   ========================================================= */

const DIET_LABELS = { veg: "🟢 Veg", nonveg: "🔴 Non-Veg", vegan: "🌱 Vegan", gf: "🌾 Gluten-Free" };
const CATEGORY_EMOJI = { Italian: "🍕", Indian: "🍛", Chinese: "🥡", Mexican: "🌮", American: "🍔", Japanese: "🍣", Desserts: "🍰" };

/* ---------------- Navigation ---------------- */
function navigateTo(page, params = {}) {
  document.querySelectorAll(".page-view").forEach(el => el.classList.remove("active"));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".main-nav a").forEach(a => a.classList.toggle("active", a.dataset.nav === page));
  document.getElementById("mainNav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  if (page === "menu") renderMenuPage(params.restaurantId || AppState.selectedRestaurantId);
  if (page === "product") renderProductPage(params.itemId || AppState.selectedItemId);
  if (page === "cart") renderCartPage();
  if (page === "checkout") renderCheckoutPage();
  if (page === "account") renderAccountPage();
  if (page === "restaurants") renderRestaurantsPage();
}

document.addEventListener("click", (e) => {
  const navEl = e.target.closest("[data-nav]");
  if (navEl) {
    e.preventDefault();
    navigateTo(navEl.dataset.nav);
  }
});

document.getElementById("navToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

/* ---------------- Toast ---------------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------------- Cart helpers ---------------- */
function addToCart(itemId, qty = 1) {
  const existing = AppState.cart.find(c => c.itemId === itemId);
  if (existing) existing.qty += qty;
  else AppState.cart.push({ itemId, qty });
  updateCartBadge();
  const item = getMenuItem(itemId);
  showToast(`${item.emoji} ${item.name} added to cart`);
  renderDrawerIfNeeded();
}
function setQty(itemId, qty) {
  const row = AppState.cart.find(c => c.itemId === itemId);
  if (!row) return;
  row.qty = qty;
  if (row.qty <= 0) AppState.cart = AppState.cart.filter(c => c.itemId !== itemId);
  updateCartBadge();
  renderDrawerIfNeeded();
  if (document.getElementById("page-cart").classList.contains("active")) renderCartPage();
}
function removeFromCart(itemId) {
  AppState.cart = AppState.cart.filter(c => c.itemId !== itemId);
  updateCartBadge();
  renderDrawerIfNeeded();
  if (document.getElementById("page-cart").classList.contains("active")) renderCartPage();
}
function cartTotals() {
  const subtotal = AppState.cart.reduce((sum, c) => sum + getMenuItem(c.itemId).price * c.qty, 0);
  let discount = 0;
  let deliveryFee = AppState.cart.length ? DELIVERY_FEE : 0;
  if (AppState.appliedCoupon) {
    const coup = COUPONS[AppState.appliedCoupon];
    if (coup.type === "percent") discount = subtotal * (coup.value / 100);
    if (coup.type === "shipping") deliveryFee = 0;
  }
  const tax = (subtotal - discount) * TAX_RATE;
  const total = Math.max(0, subtotal - discount) + tax + deliveryFee;
  return { subtotal, discount, tax, deliveryFee, total };
}
function updateCartBadge() {
  const count = AppState.cart.reduce((s, c) => s + c.qty, 0);
  const el = document.getElementById("cartCount");
  el.textContent = count;
  el.classList.toggle("hidden", count === 0);
  const wc = document.getElementById("wishlistCount");
  wc.textContent = AppState.wishlist.length;
  wc.classList.toggle("hidden", AppState.wishlist.length === 0);
}

/* ---------------- Wishlist ---------------- */
function toggleWishlist(itemId) {
  const idx = AppState.wishlist.indexOf(itemId);
  if (idx > -1) AppState.wishlist.splice(idx, 1);
  else AppState.wishlist.push(itemId);
  updateCartBadge();
  document.querySelectorAll(`[data-wish-id="${itemId}"]`).forEach(btn => btn.classList.toggle("active", isWished(itemId)));
  if (document.getElementById("page-account").classList.contains("active")) renderAccountPage();
}
function isWished(itemId) { return AppState.wishlist.includes(itemId); }

/* ---------------- Card renderers ---------------- */
function priceDots(tier) { return "$".repeat(tier); }

function restaurantCardHTML(r) {
  return `
  <article class="r-card" data-action="open-restaurant" data-id="${r.id}">
    <div class="r-banner">${r.banner}<span class="r-price">${priceDots(r.priceTier)}</span></div>
    <div class="r-body">
      <h3>${r.name}</h3>
      <p class="r-tagline">${r.tagline}</p>
      <div class="r-meta"><span class="r-rating">★ ${r.rating}</span><span>(${r.reviews})</span><span>${r.cuisine}</span><span>${r.time}</span></div>
    </div>
  </article>`;
}

function foodCardHTML(item) {
  const tags = item.dietary.map(d => `<span class="tag ${d}">${d === "gf" ? "Gluten-Free" : d}</span>`).join("");
  return `
  <article class="f-card">
    <button class="wish-btn ${isWished(item.id) ? "active" : ""}" data-action="toggle-wishlist" data-wish-id="${item.id}" title="Save to wishlist">♥</button>
    <div class="f-img" data-action="open-product" data-id="${item.id}">${item.emoji}</div>
    <div class="f-body">
      ${item.popular ? '<span class="sticker hot" style="align-self:flex-start;">Popular!</span>' : ""}
      <h4 data-action="open-product" data-id="${item.id}">${item.name}</h4>
      <p class="f-desc">${item.desc}</p>
      <div class="f-tags">${tags}</div>
      <div class="f-foot">
        <span class="f-price">$${item.price.toFixed(2)}</span>
        <button class="btn btn-primary btn-sm" data-action="add-to-cart" data-id="${item.id}">Add +</button>
      </div>
    </div>
  </article>`;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  document.getElementById("categoryScroll").innerHTML = CUISINES.map(c => `
    <button class="cat-chip" data-action="filter-cuisine" data-cuisine="${c}">
      <span class="emoji">${CATEGORY_EMOJI[c]}</span><span>${c}</span>
    </button>`).join("");

  const featured = MENU_ITEMS.filter(m => m.popular).slice(0, 4);
  document.getElementById("featuredDishes").innerHTML = featured.map(foodCardHTML).join("");

  const popular = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 6);
  document.getElementById("popularRestaurants").innerHTML = popular.map(restaurantCardHTML).join("");
}

/* ---------------- RESTAURANT LISTING ---------------- */
function populateCuisineFilter() {
  const sel = document.getElementById("filterCuisine");
  sel.innerHTML = `<option value="All">All Cuisines</option>` + CUISINES.map(c => `<option value="${c}">${c}</option>`).join("");
}
function renderRestaurantsPage() {
  const f = AppState.filters;
  document.getElementById("filterCuisine").value = f.cuisine;
  document.getElementById("filterPrice").value = f.price;
  document.getElementById("filterSort").value = f.sort;

  let list = RESTAURANTS.filter(r => {
    if (f.cuisine !== "All" && r.cuisine !== f.cuisine) return false;
    if (f.price !== "All" && r.priceTier !== Number(f.price)) return false;
    if (f.minRating && r.rating < Number(f.minRating)) return false;
    return true;
  });
  if (f.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  if (f.sort === "fastest") list.sort((a, b) => parseInt(a.time) - parseInt(b.time));

  document.getElementById("restaurantResultCount").textContent = `${list.length} restaurant${list.length !== 1 ? "s" : ""} found`;
  document.getElementById("restaurantGrid").innerHTML = list.length ? list.map(restaurantCardHTML).join("") :
    `<div class="empty-state"><div class="emoji">🍽️</div><h3>No restaurants match those filters</h3></div>`;
}

/* ---------------- MENU PAGE ---------------- */
function renderMenuPage(restaurantId) {
  AppState.selectedRestaurantId = restaurantId;
  const r = getRestaurant(restaurantId);
  if (!r) return;
  document.getElementById("restHeroBox").innerHTML = `
    <div class="emoji-huge">${r.banner}</div>
    <div class="rest-hero-info">
      <h2 style="margin-bottom:6px;">${r.name}</h2>
      <p class="r-tagline">${r.tagline}</p>
      <div class="r-meta"><span class="r-rating">★ ${r.rating}</span><span>(${r.reviews} reviews)</span><span>${r.cuisine}</span><span>${priceDots(r.priceTier)}</span><span>🚴 ${r.time}</span></div>
    </div>`;

  document.querySelectorAll("#dietaryPills .pill").forEach(p => p.classList.toggle("active", p.dataset.diet === AppState.filters.dietary));
  renderMenuCategoryBlocks(restaurantId);
}
function renderMenuCategoryBlocks(restaurantId) {
  const diet = AppState.filters.dietary;
  let items = getItemsByRestaurant(restaurantId);
  if (diet !== "All") items = items.filter(i => i.dietary.includes(diet));

  const categories = [...new Set(items.map(i => i.category))];
  const container = document.getElementById("menuCategoryBlocks");
  if (!items.length) {
    container.innerHTML = `<div class="empty-state"><div class="emoji">🥲</div><h3>No dishes match that filter</h3></div>`;
    return;
  }
  container.innerHTML = categories.map(cat => `
    <div style="margin-bottom:36px;">
      <h3 style="margin-bottom:16px;">${cat}</h3>
      <div class="grid grid-4">${items.filter(i => i.category === cat).map(foodCardHTML).join("")}</div>
    </div>`).join("");
}

/* ---------------- PRODUCT DETAIL ---------------- */
function renderProductPage(itemId) {
  AppState.selectedItemId = itemId;
  const item = getMenuItem(itemId);
  if (!item) return;
  const r = getRestaurant(item.restaurantId);
  const reviews = getReviewsForItem(itemId);
  const tags = item.dietary.map(d => `<span class="tag ${d}">${d === "gf" ? "Gluten-Free" : d}</span>`).join("");

  document.getElementById("productDetailBox").innerHTML = `
    <div>
      <div class="product-photo">${item.emoji}</div>
      <div class="info-block">
        <strong>Ingredients</strong>
        <ul class="ingredient-list" style="margin-top:10px;">${item.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      </div>
      <div class="info-block">
        <strong>Nutritional Info</strong>
        <div class="nutri-grid" style="margin-top:10px;">
          <div><strong>${item.nutrition.cal}</strong>Calories</div>
          <div><strong>${item.nutrition.protein}</strong>Protein</div>
          <div><strong>${item.nutrition.carbs}</strong>Carbs</div>
          <div><strong>${item.nutrition.fat}</strong>Fat</div>
        </div>
      </div>
    </div>
    <div>
      <p style="color:var(--brown-soft); font-weight:700; margin-bottom:4px; cursor:pointer;" data-action="open-restaurant" data-id="${r.id}">${r.emoji} ${r.name}</p>
      <h2>${item.name}</h2>
      <div class="f-tags" style="margin-bottom:10px;">${tags}${item.popular ? '<span class="sticker hot">Popular!</span>' : ""}</div>
      <p style="font-size:1.05rem;">${item.desc}</p>
      <div class="r-rating" style="font-size:1.1rem;">★ ${item.rating} <span style="color:var(--brown-soft); font-weight:600; font-size:.9rem;">(${reviews.length} reviews)</span></div>
      <h2 style="color:var(--orange-dark); margin-top:16px;">$${item.price.toFixed(2)}</h2>
      <div style="display:flex; gap:12px; align-items:center; margin-top:10px;">
        <div class="qty-stepper">
          <button data-action="detail-qty-dec">−</button><span id="detailQty">1</span><button data-action="detail-qty-inc">+</button>
        </div>
        <button class="btn btn-primary" id="detailAddBtn" data-action="add-to-cart-detail" data-id="${item.id}">Add to Cart</button>
        <button class="wish-btn ${isWished(item.id) ? "active" : ""}" style="position:static;" data-action="toggle-wishlist" data-wish-id="${item.id}">♥</button>
      </div>
      <div class="info-block" style="margin-top:26px;">
        <strong>Customer Reviews</strong>
        <div style="margin-top:10px;">
          ${reviews.length ? reviews.map(rv => `
            <div class="review-item">
              <div style="display:flex; justify-content:space-between;"><strong>${rv.user}</strong><span class="stars">${"★".repeat(rv.rating)}${"☆".repeat(5 - rv.rating)}</span></div>
              <p style="margin:4px 0 0;">${rv.text}</p>
            </div>`).join("") : `<p>No reviews yet — be the first!</p>`}
        </div>
      </div>
    </div>`;
  window._detailQty = 1;
}

document.getElementById("backToMenuBtn").addEventListener("click", () => navigateTo("menu"));

/* ---------------- CART PAGE ---------------- */
function cartRowHTML(c) {
  const item = getMenuItem(c.itemId);
  return `
  <div class="cart-row">
    <div class="f-img-sm">${item.emoji}</div>
    <div class="cart-row-info">
      <h4>${item.name}</h4>
      <p style="margin:0; color:var(--brown-soft); font-size:.85rem;">$${item.price.toFixed(2)} each</p>
      <a href="#" class="remove-link" data-action="remove-item" data-id="${item.id}">Remove</a>
    </div>
    <div class="qty-stepper">
      <button data-action="qty-dec" data-id="${item.id}">−</button><span>${c.qty}</span><button data-action="qty-inc" data-id="${item.id}">+</button>
    </div>
    <strong style="min-width:60px; text-align:right;">$${(item.price * c.qty).toFixed(2)}</strong>
  </div>`;
}
function summaryHTML(showCheckoutBtn) {
  const t = cartTotals();
  return `
  <div class="summary-card">
    <h3>Order Summary</h3>
    <div class="coupon-row">
      <input type="text" id="couponInput" placeholder="Coupon code" value="${AppState.appliedCoupon || ""}">
      <button class="btn btn-ghost" data-action="apply-coupon">Apply</button>
    </div>
    ${AppState.appliedCoupon ? `<p style="font-size:.82rem; color:var(--green-deep); font-weight:700;">✓ ${COUPONS[AppState.appliedCoupon].desc} applied</p>` : `<p style="font-size:.78rem; color:var(--brown-soft);">Try FRESH10, WELCOME15, or FREESHIP</p>`}
    <div class="summary-row"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
    ${t.discount > 0 ? `<div class="summary-row" style="color:var(--green-deep);"><span>Discount</span><span>−$${t.discount.toFixed(2)}</span></div>` : ""}
    <div class="summary-row"><span>Delivery Fee</span><span>${t.deliveryFee === 0 ? "FREE" : "$" + t.deliveryFee.toFixed(2)}</span></div>
    <div class="summary-row"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
    ${showCheckoutBtn ? `<button class="btn btn-primary btn-block" style="margin-top:14px;" data-action="go-checkout">Proceed to Checkout</button>` : ""}
  </div>`;
}
function renderCartPage() {
  const box = document.getElementById("cartPageContent");
  if (!AppState.cart.length) {
    box.innerHTML = `<div class="empty-state"><div class="emoji">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><button class="btn btn-primary" data-nav="restaurants">Browse Restaurants</button></div>`;
    return;
  }
  box.innerHTML = `
    <div class="cart-layout">
      <div>${AppState.cart.map(cartRowHTML).join("")}</div>
      ${summaryHTML(true)}
    </div>`;
}
function renderDrawerIfNeeded() {
  const body = document.getElementById("drawerBody");
  const foot = document.getElementById("drawerFoot");
  if (!AppState.cart.length) {
    body.innerHTML = `<div class="empty-state"><div class="emoji">🛒</div><p>Your cart is empty.</p></div>`;
    foot.innerHTML = "";
    return;
  }
  body.innerHTML = AppState.cart.map(cartRowHTML).join("");
  const t = cartTotals();
  foot.innerHTML = `
    <div class="summary-row total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
    <button class="btn btn-primary btn-block" style="margin-top:10px;" data-action="view-cart">View Cart</button>
    <button class="btn btn-ghost btn-block" style="margin-top:8px;" data-action="close-drawer">Keep Browsing</button>`;
}
function applyCoupon() {
  const code = document.getElementById("couponInput").value.trim().toUpperCase();
  if (!code) { AppState.appliedCoupon = null; renderCartPage(); return; }
  if (COUPONS[code]) { AppState.appliedCoupon = code; showToast(`Coupon "${code}" applied!`); }
  else { AppState.appliedCoupon = null; showToast("That code doesn't look right"); }
  renderCartPage();
}

/* ---------------- Cart drawer open/close ---------------- */
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
function openDrawer() { renderDrawerIfNeeded(); cartDrawer.classList.add("open"); drawerBackdrop.classList.add("open"); }
function closeDrawer() { cartDrawer.classList.remove("open"); drawerBackdrop.classList.remove("open"); }
document.getElementById("cartBtn").addEventListener("click", openDrawer);
document.getElementById("closeDrawerBtn").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);

/* ---------------- CHECKOUT ---------------- */
window._checkoutState = { addressId: AppState.savedAddresses[0].id, payment: "card", slot: DELIVERY_SLOTS[0] };
function renderCheckoutPage() {
  const box = document.getElementById("checkoutContent");
  if (!AppState.cart.length) {
    box.innerHTML = `<div class="empty-state"><div class="emoji">🧾</div><h3>Nothing to check out yet</h3><button class="btn btn-primary" data-nav="restaurants">Browse Restaurants</button></div>`;
    return;
  }
  const cs = window._checkoutState;
  box.innerHTML = `
    <div class="checkout-layout">
      <div>
        <div class="form-card">
          <div class="step-label"><span class="step-num">1</span> Delivery Address</div>
          ${AppState.savedAddresses.map(a => `
            <div class="radio-card ${cs.addressId === a.id ? "selected" : ""}" data-action="select-address" data-id="${a.id}">
              <span>📍</span><div><strong>${a.label}</strong><p style="margin:0; font-size:.85rem;">${a.line}</p></div>
            </div>`).join("")}
          <button class="btn btn-ghost btn-sm" type="button" id="addAddressBtn">+ Add new address</button>
          <div id="newAddressForm" class="hidden" style="margin-top:14px;">
            <div class="form-row">
              <div class="field"><label>Label</label><input type="text" id="newAddrLabel" placeholder="Work"></div>
              <div class="field"><label>Full address</label><input type="text" id="newAddrLine" placeholder="Street, city, zip"></div>
            </div>
            <button class="btn btn-primary btn-sm" id="saveAddressBtn" type="button">Save Address</button>
          </div>
        </div>

        <div class="form-card">
          <div class="step-label"><span class="step-num">2</span> Delivery Time</div>
          <div class="field"><select id="deliverySlotSelect">${DELIVERY_SLOTS.map(s => `<option ${cs.slot === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
        </div>

        <div class="form-card">
          <div class="step-label"><span class="step-num">3</span> Payment Method</div>
          <div class="radio-card ${cs.payment === "card" ? "selected" : ""}" data-action="select-payment" data-value="card"><span>💳</span><div><strong>Credit / Debit Card</strong><p style="margin:0; font-size:.85rem;">Simulated — no real charge occurs</p></div></div>
          <div class="radio-card ${cs.payment === "wallet" ? "selected" : ""}" data-action="select-payment" data-value="wallet"><span>📱</span><div><strong>Digital Wallet</strong><p style="margin:0; font-size:.85rem;">Apple Pay / Google Pay style</p></div></div>
          <div class="radio-card ${cs.payment === "cod" ? "selected" : ""}" data-action="select-payment" data-value="cod"><span>💵</span><div><strong>Cash on Delivery</strong><p style="margin:0; font-size:.85rem;">Pay when your food arrives</p></div></div>
          ${cs.payment === "card" ? `
          <div class="form-row" style="margin-top:10px;">
            <div class="field full"><label>Card Number</label><input type="text" placeholder="4242 4242 4242 4242" maxlength="19"></div>
            <div class="field"><label>Expiry</label><input type="text" placeholder="MM/YY"></div>
            <div class="field"><label>CVC</label><input type="text" placeholder="123" maxlength="4"></div>
          </div>` : ""}
        </div>
      </div>
      <div>
        ${summaryHTML(false)}
        <button class="btn btn-primary btn-block" style="margin-top:16px;" data-action="place-order">Place Order 🎉</button>
      </div>
    </div>`;
}

/* ---------------- Orders / Account ---------------- */
function placeOrder() {
  if (!AppState.cart.length) return;
  const t = cartTotals();
  const order = {
    id: "FB" + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleString(),
    items: AppState.cart.map(c => ({ ...getMenuItem(c.itemId), qty: c.qty })),
    total: t.total,
    slot: window._checkoutState.slot,
    payment: window._checkoutState.payment,
    status: 1, // 0 placed, 1 preparing, 2 out for delivery, 3 delivered — start "confirmed"
  };
  AppState.orders.unshift(order);
  AppState.cart = [];
  AppState.appliedCoupon = null;
  updateCartBadge();
  showToast("🎉 Order placed! Track it in My Orders.");
  navigateTo("account");
  setTimeout(() => { document.querySelector('.account-tab[data-tab="orders"]')?.click(); }, 50);
}

function renderAccountPage() {
  const gate = document.getElementById("accountGate");
  const body = document.getElementById("accountBody");
  if (!AppState.currentUser) {
    gate.innerHTML = `<div class="empty-state"><div class="emoji">🔐</div><h3>Log in to view your account</h3><p>Track orders, save addresses, and manage your wishlist.</p><button class="btn btn-primary" data-nav="login">Log In / Register</button></div>`;
    gate.classList.remove("hidden");
    body.classList.add("hidden");
    return;
  }
  gate.classList.add("hidden");
  body.classList.remove("hidden");
  document.getElementById("accountGreeting").textContent = `hey, ${AppState.currentUser.name.split(" ")[0]} 👋`;

  document.getElementById("pane-profile").innerHTML = `
    <div class="form-card" style="max-width:480px;">
      <div class="field-stack">
        <div class="field"><label>Full Name</label><input type="text" value="${AppState.currentUser.name}" disabled></div>
        <div class="field"><label>Email</label><input type="text" value="${AppState.currentUser.email}" disabled></div>
      </div>
      <button class="btn btn-outline" data-action="logout">Log Out</button>
    </div>`;

  const ordersPane = document.getElementById("pane-orders");
  ordersPane.innerHTML = AppState.orders.length ? AppState.orders.map(orderCardHTML).join("") :
    `<div class="empty-state"><div class="emoji">📦</div><h3>No orders yet</h3><button class="btn btn-primary" data-nav="restaurants">Order Something Good</button></div>`;

  document.getElementById("pane-addresses").innerHTML = `
    <div class="grid grid-3">
      ${AppState.savedAddresses.map(a => `<div class="form-card"><strong>${a.label}</strong><p>${a.line}</p></div>`).join("")}
    </div>`;

  const wishItems = AppState.wishlist.map(getMenuItem).filter(Boolean);
  document.getElementById("pane-wishlist").innerHTML = wishItems.length ? `<div class="grid grid-4">${wishItems.map(foodCardHTML).join("")}</div>` :
    `<div class="empty-state"><div class="emoji">💛</div><h3>Your wishlist is empty</h3><p>Tap the heart on any dish to save it here.</p></div>`;
}

function orderCardHTML(o) {
  const steps = ["Confirmed", "Preparing", "Out for Delivery", "Delivered"];
  return `
  <div class="order-card">
    <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
      <div><strong>Order #${o.id}</strong><p style="margin:2px 0 0; font-size:.82rem; color:var(--brown-soft);">${o.date}</p></div>
      <span class="order-status">${steps[o.status]}</span>
    </div>
    <p style="margin:10px 0 0; font-size:.88rem;">${o.items.map(i => `${i.qty}× ${i.name}`).join(", ")}</p>
    <p style="margin:4px 0 0; font-weight:800; color:var(--orange-dark);">$${o.total.toFixed(2)} · ${o.slot}</p>
    <div class="track-steps">
      ${steps.map((s, i) => `<div class="track-step ${i <= o.status ? "done" : ""}"><div class="dot">${i <= o.status ? "✓" : i + 1}</div>${s}</div>`).join("")}
    </div>
  </div>`;
}

/* ---------------- Auth ---------------- */
document.querySelectorAll(".auth-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("loginForm").classList.toggle("hidden", tab.dataset.auth !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", tab.dataset.auth !== "register");
  });
});
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  AppState.currentUser = { name: email.split("@")[0].replace(/[._]/g, " "), email };
  showToast(`Welcome back, ${AppState.currentUser.name}!`);
  navigateTo("account");
});
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  AppState.currentUser = { name, email };
  showToast(`Welcome to FreshBite, ${name.split(" ")[0]}!`);
  navigateTo("account");
});
document.getElementById("accountBtn").addEventListener("click", () => navigateTo(AppState.currentUser ? "account" : "login"));

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
});

/* ---------------- Account tabs ---------------- */
document.querySelectorAll(".account-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".account-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".acc-pane").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`pane-${tab.dataset.tab}`).classList.add("active");
  });
});

/* ---------------- Global click delegation for dynamic content ---------------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;

  switch (action) {
    case "open-restaurant":
      AppState.selectedRestaurantId = id;
      AppState.filters.dietary = "All";
      navigateTo("menu", { restaurantId: id });
      break;
    case "open-product":
      navigateTo("product", { itemId: id });
      break;
    case "add-to-cart":
      addToCart(id, 1);
      break;
    case "add-to-cart-detail":
      addToCart(id, window._detailQty || 1);
      break;
    case "detail-qty-inc":
      window._detailQty = (window._detailQty || 1) + 1;
      document.getElementById("detailQty").textContent = window._detailQty;
      break;
    case "detail-qty-dec":
      window._detailQty = Math.max(1, (window._detailQty || 1) - 1);
      document.getElementById("detailQty").textContent = window._detailQty;
      break;
    case "toggle-wishlist":
      toggleWishlist(el.dataset.wishId);
      break;
    case "qty-inc": {
      const row = AppState.cart.find(c => c.itemId === id);
      setQty(id, row.qty + 1);
      break;
    }
    case "qty-dec": {
      const row = AppState.cart.find(c => c.itemId === id);
      setQty(id, row.qty - 1);
      break;
    }
    case "remove-item":
      e.preventDefault();
      removeFromCart(id);
      break;
    case "apply-coupon":
      applyCoupon();
      break;
    case "go-checkout":
      closeDrawer();
      navigateTo("checkout");
      break;
    case "view-cart":
      closeDrawer();
      navigateTo("cart");
      break;
    case "place-order":
      placeOrder();
      break;
    case "select-address":
      window._checkoutState.addressId = id;
      renderCheckoutPage();
      break;
    case "select-payment":
      window._checkoutState.payment = el.dataset.value;
      renderCheckoutPage();
      break;
    case "logout":
      AppState.currentUser = null;
      showToast("Logged out. See you soon!");
      navigateTo("home");
      break;
    case "close-drawer":
      closeDrawer();
      break;
    case "filter-cuisine":
      AppState.filters.cuisine = el.dataset.cuisine;
      navigateTo("restaurants");
      break;
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "filterCuisine") { AppState.filters.cuisine = e.target.value; renderRestaurantsPage(); }
  if (e.target.id === "filterPrice") { AppState.filters.price = e.target.value; renderRestaurantsPage(); }
  if (e.target.id === "filterSort") { AppState.filters.sort = e.target.value; renderRestaurantsPage(); }
  if (e.target.id === "filterRating") { AppState.filters.minRating = e.target.value; renderRestaurantsPage(); }
  if (e.target.id === "deliverySlotSelect") { window._checkoutState.slot = e.target.value; }
});

document.addEventListener("click", (e) => {
  const pill = e.target.closest("#dietaryPills .pill");
  if (pill) {
    AppState.filters.dietary = pill.dataset.diet;
    document.querySelectorAll("#dietaryPills .pill").forEach(p => p.classList.toggle("active", p === pill));
    renderMenuCategoryBlocks(AppState.selectedRestaurantId);
  }
  if (e.target.id === "addAddressBtn") document.getElementById("newAddressForm").classList.toggle("hidden");
  if (e.target.id === "saveAddressBtn") {
    const label = document.getElementById("newAddrLabel").value || "Other";
    const line = document.getElementById("newAddrLine").value;
    if (line) {
      const newAddr = { id: "a" + (AppState.savedAddresses.length + 1), label, line };
      AppState.savedAddresses.push(newAddr);
      window._checkoutState.addressId = newAddr.id;
      renderCheckoutPage();
      showToast("Address saved");
    }
  }
});

/* ---------------- Init ---------------- */
populateCuisineFilter();
renderHome();
updateCartBadge();
