/* =====================================================================
   PEOPLE KONNECT – script.js
   Sections:  1) SETTINGS   2) PRODUCTS   3) HELPERS   4) CALCULATIONS
              5) PRODUCT GRID   6) GIFT BOX / CART   7) QUOTE   8) START
   ===================================================================== */

/* ---------- 1) SETTINGS (easy to edit) ---------- */

// WhatsApp number: country code + number, digits only (no + or spaces)
const WHATSAPP_NUMBER = "919324889290";

// Bulk discounts. Set enabled to false to switch all discounts off.
// Each tier applies when the number of boxes is at least "min".
const DISCOUNT_CONFIG = {
  enabled: true,
  tiers: [
    { min: 1,    percent: 0 },   // below 250 boxes
    { min: 250,  percent: 2 },
    { min: 500,  percent: 5 },
    { min: 1000, percent: 8 }
  ]
};

// Quick-select buttons for the bulk quantity
const QTY_PRESETS = [100, 250, 500, 1000];

// Currency: Indian Rupees with Indian digit grouping (e.g. ₹4,00,000)
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
});

// Category list and the emoji shown if a product image file is missing
const CATEGORIES = {
  "Chocolates & Sweets": "🍫",
  "Dry Fruits & Gourmet": "🥜",
  "Bottles & Drinkware": "🍶",
  "Stationery & Diaries": "📒",
  "Tech Accessories": "🎧",
  "Lifestyle & Accessories": "👜",
  "Gift Boxes & Packaging": "🎁",
  "Festive Specials": "🪔"
};

/* ---------- 2) PRODUCTS ----------
   TO ADD a product: copy one line, give it a NEW unique id, edit the details.
   TO REMOVE a product: delete its line.
   Put photos in the images/ folder. If a photo is missing, an emoji shows instead.
   "category" must match one of the names in CATEGORIES above. */
const products = [
  { id: 1,  name: "Premium Chocolate Box", category: "Chocolates & Sweets", price: 250, image: "Images/Premium_Chocolate_Box.jpg", description: "Premium assorted chocolate collection" },
  { id: 2,  name: "Truffle Assortment", category: "Chocolates & Sweets", price: 320, image: "Images/Truffle_Assortment.jpg", description: "Hand-rolled cocoa truffles in six flavours" },
  { id: 3,  name: "Mithai Gift Pack", category: "Chocolates & Sweets", price: 450, image: "Images/mithai.jpg", description: "Classic Indian sweets, freshly packed" },
  { id: 4,  name: "Mithai Gift Pack", category: "Chocolates & Sweets", price: 450, image: "images/mithai.jpg", description: "Classic Indian sweets, freshly packed" },
  { id: 5,  name: "Mithai Gift Pack", category: "Chocolates & Sweets", price: 450, image: "images/mithai.jpg", description: "Classic Indian sweets, freshly packed" },
  { id: 6,  name: "Mithai Gift Pack", category: "Chocolates & Sweets", price: 450, image: "images/mithai.jpg", description: "Classic Indian sweets, freshly packed" },
  { id: 7,  name: "Mithai Gift Pack", category: "Chocolates & Sweets", price: 450, image: "images/mithai.jpg", description: "Classic Indian sweets, freshly packed" },
  { id: 8,  name: "Premium Dry Fruit Box", category: "Dry Fruits & Gourmet", price: 350, image: "images/dryfruits.jpg", description: "Assorted premium dry fruits" },
  { id: 9,  name: "Roasted Nuts Jar", category: "Dry Fruits & Gourmet", price: 220, image: "images/nuts.jpg", description: "Lightly salted roasted almonds and cashews" },
  { id: 10,  name: "Gourmet Tea Set", category: "Dry Fruits & Gourmet", price: 380, image: "images/tea.jpg", description: "Three single-estate teas in a wooden caddy" },
  { id: 11,  name: "Steel Water Bottle", category: "Bottles & Drinkware", price: 200, image: "images/bottle.jpg", description: "750 ml insulated bottle, logo-ready" },
  { id: 12,  name: "Ceramic Coffee Mug", category: "Bottles & Drinkware", price: 180, image: "images/mug.jpg", description: "Matte finish mug with gift sleeve" },
  { id: 13,  name: "Copper Tumbler Set", category: "Bottles & Drinkware", price: 420, image: "images/copper.jpg", description: "Pure copper bottle with two tumblers" },
  { id: 14, name: "Leather-finish Diary", category: "Stationery & Diaries", price: 280, image: "images/diary.jpg", description: "A5 undated planner with ribbon bookmark" },
  { id: 15, name: "Metal Pen Set", category: "Stationery & Diaries", price: 150, image: "images/pen.jpg", description: "Two engraved metal pens in a box" },
  { id: 16, name: "Desk Organiser", category: "Stationery & Diaries", price: 340, image: "images/organiser.jpg", description: "Wooden organiser for pens, cards and phone" },
  { id: 17, name: "Wireless Earbuds", category: "Tech Accessories", price: 899, image: "images/earbuds.jpg", description: "Bluetooth earbuds with charging case" },
  { id: 18, name: "Power Bank 10000 mAh", category: "Tech Accessories", price: 650, image: "images/powerbank.jpg", description: "Slim fast-charging power bank" },
  { id: 19, name: "Wireless Charger Pad", category: "Tech Accessories", price: 480, image: "images/charger.jpg", description: "15W Qi charging pad with soft-touch top" },
  { id: 20, name: "Canvas Tote Bag", category: "Lifestyle & Accessories", price: 190, image: "images/tote.jpg", description: "Sturdy cotton tote, ready for branding" },
  { id: 21, name: "Scented Candle", category: "Lifestyle & Accessories", price: 300, image: "images/candle.jpg", description: "Soy wax candle in a reusable glass jar" },
  { id: 22, name: "Signature Gift Box", category: "Gift Boxes & Packaging", price: 120, image: "images/giftbox.jpg", description: "Rigid magnetic box with satin lining" },
  { id: 23, name: "Festive Diya Hamper", category: "Festive Specials", price: 550, image: "images/diya.jpg", description: "Decorative diyas, sweets and dry fruits" },
  { id: 24, name: "Diwali Celebration Box", category: "Festive Specials", price: 750, image: "images/diwali.jpg", description: "Festive hamper with sweets, nuts and a candle" }
];

/* ---------- 3) HELPERS & STATE ---------- */
let activeCategory = "All";   // current category filter
let searchText = "";          // current search text
let cart = [];                // items in ONE gift box: [{ id, qty }]
let bulkQty = 100;            // how many gift boxes are being ordered

const $ = (id) => document.getElementById(id);
const findProduct = (id) => products.find((p) => p.id === id);
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

/* ---------- 4) CALCULATIONS ---------- */

// Price of ONE gift box = sum of (price × quantity-in-box) for every item
function getBoxPrice() {
  return cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
}

// Discount % for a given number of boxes (uses the highest tier reached)
function getDiscountPercent(boxes) {
  if (!DISCOUNT_CONFIG.enabled) return 0;
  let percent = 0;
  DISCOUNT_CONFIG.tiers.forEach((t) => { if (boxes >= t.min) percent = t.percent; });
  return percent;
}

// Full pricing breakdown used by the calculator AND the quotation
function getPricing() {
  const original = getBoxPrice();
  const percent = getDiscountPercent(bulkQty);
  const discounted = original * (1 - percent / 100);
  return {
    productsInBox: cart.reduce((n, i) => n + i.qty, 0),
    original, percent, discounted,
    boxes: bulkQty,
    total: Math.round(discounted * bulkQty)   // Final bulk order estimate
  };
}

/* ---------- 5) PRODUCT GRID ---------- */

// Category buttons are built from the CATEGORIES list
function renderCategories() {
  const names = ["All", ...Object.keys(CATEGORIES)];
  $("categoryBar").innerHTML = names.map((n) =>
    `<button class="chip ${n === activeCategory ? "active" : ""}" data-cat="${escapeHTML(n)}">${escapeHTML(n)}</button>`
  ).join("");
}

// Builds a card for every product that matches the filter and search
function renderProducts() {
  const list = products.filter((p) =>
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );
  $("productCount").textContent = `Showing ${list.length} of ${products.length} products`;
  $("productGrid").innerHTML = list.length ? list.map((p) => `
    <article class="card">
      <div class="card-img">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy"
             onerror="this.parentNode.textContent='${CATEGORIES[p.category] || "🎁"}'">
      </div>
      <div class="card-body">
        <span class="card-cat">${escapeHTML(p.category)}</span>
        <h4>${escapeHTML(p.name)}</h4>
        <p>${escapeHTML(p.description)}</p>
        <div class="card-foot">
          <span class="price">${inr.format(p.price)}</span>
          <button class="add-btn" data-add="${p.id}">Add to Collection</button>
        </div>
      </div>
    </article>`).join("") : `<p class="empty">No products match your search. Try another word or category.</p>`;
}

/* ---------- 6) GIFT BOX / CART ---------- */

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += 1; else cart.push({ id, qty: 1 });
  renderCart();
}

// Change quantity inside the box; never below 1 (use Remove to delete)
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

// Redraws the cart list, the nav counter and every calculation
function renderCart() {
  $("navCount").textContent = cart.length;
  $("cartItems").innerHTML = cart.length ? cart.map((item) => {
    const p = findProduct(item.id);
    return `
      <div class="cart-line">
        <div><strong>${escapeHTML(p.name)}</strong><small>${inr.format(p.price)} each</small></div>
        <div class="stepper" aria-label="Quantity per gift box">
          <button data-dec="${p.id}" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button data-inc="${p.id}" aria-label="Increase">+</button>
        </div>
        <div class="line-total">${inr.format(p.price * item.qty)}</div>
        <button class="remove" data-remove="${p.id}" aria-label="Remove ${escapeHTML(p.name)}">✕</button>
      </div>`;
  }).join("") : `<p class="empty">Your gift box is empty. Choose products above and select “Add to Collection”.</p>`;

  const r = getPricing();
  $("boxTotal").textContent = inr.format(r.original);
  $("sProducts").textContent = `${r.productsInBox} item${r.productsInBox === 1 ? "" : "s"}`;
  $("sOriginal").textContent = inr.format(r.original);
  $("sDiscount").textContent = `${r.percent}%`;
  $("sDiscounted").textContent = inr.format(r.discounted);
  $("sBoxes").textContent = r.boxes.toLocaleString("en-IN");
  $("sTotal").textContent = inr.format(r.total);
  $("formQty").value = bulkQty;
  document.querySelectorAll(".qty-presets .chip").forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.qty) === bulkQty));
}

// Reads the custom quantity box; invalid or negative values become 1
function setBulkQty(value) {
  const n = Math.floor(Number(value));
  bulkQty = n >= 1 ? n : 1;
  $("bulkQty").value = bulkQty;
  renderCart();
}

/* ---------- 7) QUOTATION & WHATSAPP ---------- */

// One text version of the collection, reused by WhatsApp
function collectionText() {
  const r = getPricing();
  const lines = cart.map((i) => {
    const p = findProduct(i.id);
    return `- ${p.name}: ${i.qty} × ${inr.format(p.price)} = ${inr.format(p.price * i.qty)}`;
  });
  return `${lines.join("\n")}\nPrice per gift box: ${inr.format(r.original)}\nBulk quantity: ${r.boxes} boxes\n` +
    `Discount: ${r.percent}%\nDiscounted price per box: ${inr.format(r.discounted)}\nEstimated total: ${inr.format(r.total)}`;
}

function showQuotation(form) {
  bulkQty = Math.max(1, Math.floor(Number(form.qty.value)) || 1);
  renderCart();
  const r = getPricing();
  const rows = cart.map((i) => {
    const p = findProduct(i.id);
    return `<tr><td>${escapeHTML(p.name)}</td><td>${i.qty}</td><td>${inr.format(p.price)}</td><td>${inr.format(p.price * i.qty)}</td></tr>`;
  }).join("");
  const box = $("quoteResult");
  box.hidden = false;
  box.innerHTML = `
    <h3>Quotation summary</h3>
    <p>${escapeHTML(form.name.value)}, ${escapeHTML(form.company.value)} · ${escapeHTML(form.city.value)} · Delivery by ${escapeHTML(form.date.value)}</p>
    <table><tr><th>Product</th><th>Qty per box</th><th>Price</th><th>Subtotal</th></tr>${rows}</table>
    <div class="row"><span>Price per gift box</span><strong>${inr.format(r.original)}</strong></div>
    <div class="row"><span>Bulk quantity</span><strong>${r.boxes.toLocaleString("en-IN")} boxes</strong></div>
    <div class="row"><span>Bulk discount</span><strong>${r.percent}%</strong></div>
    <div class="row"><span>Discounted price per box</span><strong>${inr.format(r.discounted)}</strong></div>
    <div class="row grand"><span>Estimated total</span><strong>${inr.format(r.total)}</strong></div>
    <p class="note">Prices are indicative and subject to final confirmation based on bulk quantity, customisation, GST and delivery.
    This is a prototype: nothing has been sent.</p>`;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- 8) START: connect buttons to functions ---------- */
function init() {
  renderCategories();
  renderProducts();

  $("presets").innerHTML = QTY_PRESETS.map((q) =>
    `<button class="chip" data-qty="${q}">${q.toLocaleString("en-IN")} boxes</button>`).join("");

  $("categoryBar").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    activeCategory = b.dataset.cat; renderCategories(); renderProducts();
  });
  $("searchInput").addEventListener("input", (e) => { searchText = e.target.value; renderProducts(); });
  $("productGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]"); if (b) addToCart(Number(b.dataset.add));
  });
  $("cartItems").addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.inc) changeQty(Number(t.dataset.inc), 1);
    if (t.dataset.dec) changeQty(Number(t.dataset.dec), -1);
    if (t.dataset.remove) removeFromCart(Number(t.dataset.remove));
  });
  $("clearCart").addEventListener("click", () => { cart = []; renderCart(); });
  $("presets").addEventListener("click", (e) => {
    const b = e.target.closest("[data-qty]"); if (b) setBulkQty(b.dataset.qty);
  });
  $("bulkQty").addEventListener("input", (e) => {
    const n = Math.floor(Number(e.target.value));
    if (n >= 1) { bulkQty = n; renderCart(); }   // update live while typing
  });
  $("bulkQty").addEventListener("blur", (e) => setBulkQty(e.target.value));
  $("formQty").addEventListener("input", (e) => {
    const n = Math.floor(Number(e.target.value));
    if (n >= 1) { bulkQty = n; $("bulkQty").value = n; renderCart(); }
  });

  $("quoteForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!cart.length) { alert("Please add at least one product to your gift box first."); location.hash = "#builder"; return; }
    showQuotation(e.target);
  });
  $("waBtn").addEventListener("click", () => {
    if (!cart.length) { alert("Please add at least one product to your gift box first."); return; }
    const f = $("quoteForm");
    const msg = `Hello People Konnect, I would like a bulk quotation.\n${f.name.value ? "Name: " + f.name.value + "\n" : ""}` +
      `${f.company.value ? "Company: " + f.company.value + "\n" : ""}\n${collectionText()}\n(Prices indicative; subject to GST and delivery.)`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  $("menuToggle").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  $("navLinks").addEventListener("click", () => $("navLinks").classList.remove("open"));

  $("bulkQty").value = bulkQty;
  renderCart();
}
init();
