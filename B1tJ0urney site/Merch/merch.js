/* =========================================
   B1tJ0urney Merch — JS puro
   - render produtos
   - filtros e ordenação
   - carrinho (drawer)
   - background spray (canvas)
   - micro UX: toast, focus trap leve
   ========================================= */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

/** ---------- Data (substitui depois pelo teu backend / CMS) ---------- **/
const PRODUCTS = [
  {
    id: "hoodie-streettech",
    name: "Hoodie Street-Tech",
    desc: "Hoodie pesado com vibe street + detalhe digital. Drop limitado.",
    category: "apparel",
    price: 49.90,
    hot: true,
    drop: true,
    stock: 18,
    glyph: "HOOD"
  },
  {
    id: "tee-gradientcore",
    name: "T-Shirt Gradient Core",
    desc: "T-shirt clean, logo/mark com gradiente azul→roxo→ciano. Essencial.",
    category: "apparel",
    price: 24.90,
    hot: false,
    drop: false,
    stock: 64,
    glyph: "TEE"
  },
  {
    id: "cap-nightshift",
    name: "Cap NightShift",
    desc: "Boné com bordado discreto e toque futurista. Fácil de combinar.",
    category: "accessories",
    price: 19.90,
    hot: false,
    drop: false,
    stock: 42,
    glyph: "CAP"
  },
  {
    id: "bag-cybercarry",
    name: "Tech Bag CyberCarry",
    desc: "Saco com textura digital e reforço. Para o teu setup do dia-a-dia.",
    category: "accessories",
    price: 16.90,
    hot: true,
    drop: false,
    stock: 33,
    glyph: "BAG"
  },
  {
    id: "sticker-pack",
    name: "Sticker Pack: Tags & Bits",
    desc: "Pack de stickers com tags, ícones tech e padrões binários.",
    category: "stickers",
    price: 6.90,
    hot: false,
    drop: false,
    stock: 120,
    glyph: "TAG"
  },
  {
    id: "poster-drop",
    name: "Poster Drop (A2)",
    desc: "Poster estilo mural: street-art futurista para o teu espaço.",
    category: "accessories",
    price: 14.90,
    hot: false,
    drop: true,
    stock: 12,
    glyph: "A2"
  }
];

const SIZES = ["XS","S","M","L","XL"];

/** ---------- State ---------- **/
const state = {
  q: "",
  cat: "all",
  sort: "featured",
  cart: loadCart(),
  lowFx: false
};

/** ---------- Elements ---------- **/
const gridEl = $("#productGrid");
const qEl = $("#q");
const catEl = $("#cat");
const sortEl = $("#sort");

const drawer = $("#cartDrawer");
const btnCart = $("#btnCart");
const btnOpenCart = $("#btnOpenCart");
const cartItemsEl = $("#cartItems");
const cartCountEl = $("#cartCount");
const cartSubEl = $("#cartSub");
const subtotalEl = $("#subtotal");
const shippingEl = $("#shipping");
const totalEl = $("#total");

const btnClear = $("#btnClear");
const btnCheckout = $("#btnCheckout");
const toastEl = $("#toast");

const btnTheme = $("#btnTheme");
const btnRandomize = $("#btnRandomize");

const sprayCanvas = $("#spray");
const ctx = sprayCanvas.getContext("2d", { alpha: true });

/** ---------- Init ---------- **/
renderProducts();
updateCartUI();
initEvents();
initSpray();
requestAnimationFrame(loopSpray);

/** ---------- Rendering ---------- **/
function renderProducts(){
  const list = applyFilters(PRODUCTS, state);

  gridEl.innerHTML = list.map((p, idx) => cardHTML(p, idx)).join("");
  // Hook per-card events
  $$(".js-add").forEach(btn => btn.addEventListener("click", onAddClick));
}

function cardHTML(p, idx){
  const delay = Math.min(idx * 0.05, 0.45);
  const badges = [
    p.drop ? `<span class="badge badge--drop">DROP</span>` : `<span class="badge">STANDARD</span>`,
    p.hot ? `<span class="badge badge--hot">HOT</span>` : ""
  ].join("");

  const sizeOptions = SIZES.map(s => `<option value="${s}">${s}</option>`).join("");

  return `
    <article class="card" style="animation-delay:${delay}s">
      <div class="card__inner">
        <div class="card__top">
          <div style="display:flex; gap:8px; flex-wrap:wrap">${badges}</div>
          <div class="badge">stock ${p.stock}</div>
        </div>

        <h3 class="card__name">${escapeHTML(p.name)}</h3>
        <p class="card__desc">${escapeHTML(p.desc)}</p>

        <div class="preview" aria-label="Pré-visualização">
          <div class="preview__art">
            <div class="preview__lines" aria-hidden="true"></div>
            <div class="preview__glyph">${escapeHTML(p.glyph)}</div>
          </div>

          <div class="preview__meta">
            <div class="price">${eur(p.price)}</div>
            <div class="stock">${p.drop ? "Edição limitada (drop)" : "Coleção standard"}</div>
          </div>
        </div>

        <div class="card__actions">
          <select class="field__select size" aria-label="Tamanho" data-size-for="${p.id}">
            ${sizeOptions}
          </select>

          <button class="btn btn--primary js-add" type="button"
            data-id="${p.id}" aria-label="Adicionar ${escapeHTML(p.name)} ao carrinho">
            Adicionar
          </button>
        </div>
      </div>
    </article>
  `;
}

/** ---------- Filters / Sort ---------- **/
function applyFilters(items, s){
  let out = items.slice();

  const q = s.q.trim().toLowerCase();
  if(q){
    out = out.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if(s.cat !== "all"){
    out = out.filter(p => p.category === s.cat);
  }

  switch(s.sort){
    case "priceAsc":
      out.sort((a,b) => a.price - b.price); break;
    case "priceDesc":
      out.sort((a,b) => b.price - a.price); break;
    case "nameAsc":
      out.sort((a,b) => a.name.localeCompare(b.name)); break;
    case "featured":
    default:
      // featured: drops + hot primeiro, depois stock
      out.sort((a,b) => score(b) - score(a));
  }
  return out;
}
function score(p){
  return (p.drop ? 50 : 0) + (p.hot ? 25 : 0) + Math.min(p.stock, 30);
}

/** ---------- Cart ---------- **/
function onAddClick(e){
  const id = e.currentTarget.dataset.id;
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;

  const sizeSel = document.querySelector(`[data-size-for="${id}"]`);
  const size = sizeSel ? sizeSel.value : "M";

  addToCart({ id, size });
  toast(`Adicionado: ${p.name} (${size})`);
}

function addToCart(item){
  const key = cartKey(item);
  state.cart[key] = state.cart[key] || { ...item, qty: 0 };
  state.cart[key].qty += 1;

  saveCart(state.cart);
  updateCartUI();
}

function decCart(item){
  const key = cartKey(item);
  if(!state.cart[key]) return;
  state.cart[key].qty -= 1;
  if(state.cart[key].qty <= 0) delete state.cart[key];

  saveCart(state.cart);
  updateCartUI();
}

function incCart(item){
  addToCart(item);
}

function clearCart(){
  state.cart = {};
  saveCart(state.cart);
  updateCartUI();
  toast("Carrinho limpo");
}

function updateCartUI(){
  const items = Object.values(state.cart);
  const count = items.reduce((acc, it) => acc + it.qty, 0);

  cartCountEl.textContent = String(count);
  cartSubEl.textContent = `${count} ${count === 1 ? "item" : "itens"}`;

  if(items.length === 0){
    cartItemsEl.innerHTML = `<div class="cartEmpty">Carrinho vazio. Escolhe uma peça e adiciona.</div>`;
  }else{
    cartItemsEl.innerHTML = items.map(it => cartItemHTML(it)).join("");
    // hook qty buttons
    $$(".js-dec", cartItemsEl).forEach(b => b.addEventListener("click", () => decCart(readItem(b))));
    $$(".js-inc", cartItemsEl).forEach(b => b.addEventListener("click", () => incCart(readItem(b))));
  }

  const subtotal = items.reduce((acc, it) => acc + (getProduct(it.id).price * it.qty), 0);
  const shipping = subtotal === 0 ? 0 : (subtotal >= 60 ? 0 : 4.90);
  const total = subtotal + shipping;

  subtotalEl.textContent = eur(subtotal);
  shippingEl.textContent = eur(shipping);
  totalEl.textContent = eur(total);
}

function cartItemHTML(it){
  const p = getProduct(it.id);
  const line = getProduct(it.id).price * it.qty;
  const glyph = (p.glyph || "BJ").slice(0,4);

  return `
    <div class="cartItem">
      <div class="cartItem__thumb" aria-hidden="true">${escapeHTML(glyph)}</div>

      <div>
        <p class="cartItem__name">${escapeHTML(p.name)}</p>
        <div class="cartItem__meta">${escapeHTML(it.size)} · ${eur(p.price)} cada</div>
      </div>

      <div class="cartItem__right">
        <div class="sum">${eur(line)}</div>
        <div class="qty" aria-label="Quantidade">
          <button type="button" class="js-dec" data-id="${it.id}" data-size="${it.size}" aria-label="Diminuir">−</button>
          <span aria-label="Quantidade atual">${it.qty}</span>
          <button type="button" class="js-inc" data-id="${it.id}" data-size="${it.size}" aria-label="Aumentar">+</button>
        </div>
      </div>
    </div>
  `;
}

function readItem(btn){
  return { id: btn.dataset.id, size: btn.dataset.size };
}

function getProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  return p || { name: "Produto", price: 0, glyph: "BJ" };
}

function cartKey(it){
  return `${it.id}__${it.size}`;
}

/** ---------- Drawer open/close + focus ---------- **/
let lastFocus = null;

function openDrawer(){
  if(!drawer.hidden) return;
  lastFocus = document.activeElement;
  drawer.hidden = false;
  document.body.style.overflow = "hidden";
  // focus first actionable
  const closeBtn = $('[data-close]', drawer);
  closeBtn && closeBtn.focus();
}

function closeDrawer(){
  if(drawer.hidden) return;
  drawer.hidden = true;
  document.body.style.overflow = "";
  if(lastFocus && lastFocus.focus) lastFocus.focus();
}

function initEvents(){
  qEl.addEventListener("input", () => { state.q = qEl.value; renderProducts(); });
  catEl.addEventListener("change", () => { state.cat = catEl.value; renderProducts(); });
  sortEl.addEventListener("change", () => { state.sort = sortEl.value; renderProducts(); });

  btnCart.addEventListener("click", openDrawer);
  btnOpenCart.addEventListener("click", openDrawer);

  drawer.addEventListener("click", (e) => {
    if(e.target.matches("[data-close]")) closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeDrawer();
    // focus trap mínimo
    if(!drawer.hidden && e.key === "Tab") trapFocus(e);
  });

  btnClear.addEventListener("click", clearCart);

  btnCheckout.addEventListener("click", () => {
    const items = Object.values(state.cart);
    if(items.length === 0) return toast("Carrinho vazio");
    toast("Checkout (demo): liga isto ao teu backend/Stripe.");
  });

  btnTheme.addEventListener("click", () => {
    state.lowFx = !state.lowFx;
    document.body.classList.toggle("is-lowfx", state.lowFx);
    btnTheme.textContent = state.lowFx ? "Low FX" : "Night";
    btnTheme.setAttribute("aria-pressed", String(!state.lowFx));
  });

  btnRandomize.addEventListener("click", () => {
    // re-seed spray + altera ligeiramente densidade
    reseedSpray();
    toast("Estilo baralhado");
  });
}

function trapFocus(e){
  const focusables = $$("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])", drawer)
    .filter(el => !el.disabled && el.offsetParent !== null);

  if(focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if(e.shiftKey && document.activeElement === first){
    e.preventDefault(); last.focus();
  }else if(!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
}

/** ---------- Toast ---------- **/
let toastTimer = null;
function toast(msg){
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2200);
}

/** ---------- Utils ---------- **/
function eur(n){
  // Formatação PT (vírgula decimal)
  return new Intl.NumberFormat("pt-PT", { style:"currency", currency:"EUR" }).format(n);
}
function escapeHTML(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/** ---------- Persistence ---------- **/
function loadCart(){
  try{
    const raw = localStorage.getItem("bj_merch_cart");
    return raw ? JSON.parse(raw) : {};
  }catch{
    return {};
  }
}
function saveCart(cart){
  try{ localStorage.setItem("bj_merch_cart", JSON.stringify(cart)); }catch{}
}

/** ---------- Spray Canvas (graffiti moderno, sem poluir UX) ---------- **/
let W=0, H=0;
let particles = [];
let seed = Math.random() * 9999;

function initSpray(){
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  reseedSpray();
}

function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = Math.floor(window.innerWidth * dpr);
  H = Math.floor(window.innerHeight * dpr);
  sprayCanvas.width = W;
  sprayCanvas.height = H;
  sprayCanvas.style.width = "100%";
  sprayCanvas.style.height = "100%";
  ctx.setTransform(1,0,0,1,0,0);
}

function reseedSpray(){
  particles = [];
  seed = Math.random() * 9999;

  // densidade controlada: street vibe, mas subtil
  const base = Math.floor((window.innerWidth * window.innerHeight) / 38000);
  const count = clamp(base, 28, 90);

  for(let i=0;i<count;i++){
    particles.push(makeParticle(i));
  }

  // limpa com fade para não ficar “sujo”
  ctx.clearRect(0,0,W,H);
}

function makeParticle(i){
  const t = (i / 90);
  const colors = [
    [55,184,255],   // blue
    [123,44,255],   // purple
    [37,255,214]    // cyan
  ];
  const c = colors[i % colors.length];

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const x = rand(0, W);
  const y = rand(0, H);
  const r = rand(18, 74) * dpr;
  const a = rand(0.02, 0.055);

  return {
    x, y, r, a,
    vx: rand(-0.08, 0.08) * dpr,
    vy: rand(-0.05, 0.05) * dpr,
    c,
    phase: rand(0, Math.PI*2),
    w: rand(0.8, 1.8),
    kind: t < 0.55 ? "spray" : "stroke"
  };
}

function loopSpray(ts){
  // fade muito leve para manter “motion” suave
  ctx.fillStyle = "rgba(0,0,0,0.03)";
  ctx.fillRect(0,0,W,H);

  const time = (ts || 0) * 0.001;

  for(const p of particles){
    // move
    p.x += p.vx + Math.sin(time + p.phase) * 0.05;
    p.y += p.vy + Math.cos(time * 0.9 + p.phase) * 0.04;

    // wrap
    if(p.x < -p.r) p.x = W + p.r;
    if(p.x > W + p.r) p.x = -p.r;
    if(p.y < -p.r) p.y = H + p.r;
    if(p.y > H + p.r) p.y = -p.r;

    if(p.kind === "spray"){
      drawSpray(p, time);
    }else{
      drawStroke(p, time);
    }
  }

  requestAnimationFrame(loopSpray);
}

function drawSpray(p, time){
  const [r,g,b] = p.c;

  const pulse = 0.6 + Math.sin(time + p.phase) * 0.25;
  const rad = p.r * (0.8 + pulse * 0.35);

  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
  grad.addColorStop(0, `rgba(${r},${g},${b},${p.a})`);
  grad.addColorStop(0.55, `rgba(${r},${g},${b},${p.a*0.35})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, rad, 0, Math.PI*2);
  ctx.fill();
}

function drawStroke(p, time){
  const [r,g,b] = p.c;

  const len = p.r * 1.2;
  const ang = time * 0.25 + p.phase;
  const x2 = p.x + Math.cos(ang) * len;
  const y2 = p.y + Math.sin(ang) * len;

  ctx.strokeStyle = `rgba(${r},${g},${b},${p.a*0.9})`;
  ctx.lineWidth = p.w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function rand(a,b){
  // pseudo-rand sem libs
  seed = (seed * 9301 + 49297) % 233280;
  const t = seed / 233280;
  return a + (b - a) * t;
}
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }


