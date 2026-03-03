const products = [
  { id: 1, name: "Smart TV 55\" UHD", category: "Tecnología", price: 1499, oldPrice: 1899, emoji: "📺" },
  { id: 2, name: "Laptop Core i7 16GB", category: "Tecnología", price: 2899, oldPrice: 3299, emoji: "💻" },
  { id: 3, name: "Sofá 3 cuerpos premium", category: "Hogar", price: 1099, oldPrice: 1399, emoji: "🛋️" },
  { id: 4, name: "Licuadora 1.5L", category: "Hogar", price: 189, oldPrice: 249, emoji: "🥤" },
  { id: 5, name: "Casaca urbana mujer", category: "Moda", price: 159, oldPrice: 229, emoji: "🧥" },
  { id: 6, name: "Zapatillas running", category: "Moda", price: 199, oldPrice: 279, emoji: "👟" },
  { id: 7, name: "Colchón queen ortopédico", category: "Dormitorio", price: 899, oldPrice: 1299, emoji: "🛏️" },
  { id: 8, name: "Juego de sábanas 2 plazas", category: "Dormitorio", price: 99, oldPrice: 139, emoji: "🧺" }
];

const categories = ["Todos", ...new Set(products.map((item) => item.category))];

let activeCategory = "Todos";
const cart = new Map();

const categoryTabs = document.getElementById("categoryTabs");
const productGrid = document.getElementById("productGrid");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const slides = Array.from(document.querySelectorAll(".slide"));
const sliderDots = document.getElementById("sliderDots");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const dealCountdown = document.getElementById("dealCountdown");

let activeSlide = 0;
let sliderTimer = null;
let countdownTimer = null;

function formatPEN(value) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2
  }).format(value);
}

function renderCategories() {
  categoryTabs.innerHTML = categories
    .map(
      (cat) => `
      <button class="chip ${cat === activeCategory ? "active" : ""}" data-category="${cat}">
        ${cat}
      </button>
    `
    )
    .join("");

  categoryTabs.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function productCard(product) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  return `
    <article class="card">
      <div class="thumb" aria-hidden="true">${product.emoji}</div>
      <div class="card-body">
        <div class="card-top">
          <p class="meta">${product.category}</p>
          <span class="discount">-${discount}%</span>
        </div>
        <h3>${product.name}</h3>
        <p class="stars">★★★★★</p>
        <p class="meta"><s>${formatPEN(product.oldPrice)}</s></p>
        <p class="price">${formatPEN(product.price)}</p>
        <button class="add" data-id="${product.id}">Agregar al carrito</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  const visible = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  productGrid.innerHTML = visible.map(productCard).join("");

  productGrid.querySelectorAll(".add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = Number(btn.dataset.id);
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const row = cart.get(productId);
  if (row) {
    row.qty += 1;
  } else {
    cart.set(productId, { ...product, qty: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

function renderCart() {
  const rows = Array.from(cart.values());

  if (rows.length === 0) {
    cartItems.innerHTML = "<p class='small'>Tu carrito está vacío.</p>";
  } else {
    cartItems.innerHTML = rows
      .map(
        (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <p class="small">${item.qty} x ${formatPEN(item.price)}</p>
          </div>
          <div>
            <strong>${formatPEN(item.price * item.qty)}</strong>
            <button class="small remove" data-id="${item.id}">Quitar</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  const units = rows.reduce((sum, item) => sum + item.qty, 0);
  const total = rows.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCount.textContent = units;
  cartTotal.textContent = formatPEN(total);

  cartItems.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.dataset.id));
    });
  });
}

function setActiveSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === activeSlide);
  });
  if (sliderDots) {
    sliderDots.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === activeSlide);
    });
  }
}

function setupSlider() {
  if (!slides.length || !sliderDots || !prevSlide || !nextSlide) return;
  sliderDots.innerHTML = slides
    .map((_, i) => `<button class="dot ${i === 0 ? "active" : ""}" data-slide="${i}" aria-label="Ir al slide ${i + 1}"></button>`)
    .join("");

  sliderDots.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      setActiveSlide(Number(dot.dataset.slide));
      restartSliderTimer();
    });
  });

  prevSlide.addEventListener("click", () => {
    setActiveSlide(activeSlide - 1);
    restartSliderTimer();
  });

  nextSlide.addEventListener("click", () => {
    setActiveSlide(activeSlide + 1);
    restartSliderTimer();
  });

  restartSliderTimer();
}

function restartSliderTimer() {
  if (sliderTimer) {
    clearInterval(sliderTimer);
  }
  sliderTimer = setInterval(() => {
    setActiveSlide(activeSlide + 1);
  }, 4500);
}

function setupRevealAnimation() {
  if (!revealItems.length) return;
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("show"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
    observer.observe(item);
  });
}

function formatCountdown(value) {
  return String(value).padStart(2, "0");
}

function getNextDealDeadline() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(9, 0, 0, 0);
  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

function setupDealCountdown() {
  if (!dealCountdown) return;
  const deadline = getNextDealDeadline();

  const tick = () => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      dealCountdown.textContent = "00:00:00";
      clearInterval(countdownTimer);
      setupDealCountdown();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    dealCountdown.textContent = `${formatCountdown(hours)}:${formatCountdown(minutes)}:${formatCountdown(seconds)}`;
  };

  tick();
  countdownTimer = setInterval(tick, 1000);
}

cartBtn.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

renderCategories();
renderProducts();
renderCart();
setupSlider();
setupRevealAnimation();
setupDealCountdown();
