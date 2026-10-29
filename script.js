/* ==========================================================================
   1. DADOS DOS PRODUTOS
   ========================================================================== */
const PRODUCTS = [
    {
        id: 1,
        title: "Bíblia Ave Maria de Luxo",
        category: "biblia",
        price: 18500,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        title: "Terço de Madeira Nobre",
        category: "terco",
        price: 6500,
        image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        title: "Catecismo da Igreja Católica",
        category: "livro",
        price: 12000,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        title: "Túnica Litúrgica Branca com Bordado",
        category: "tunica",
        price: 32000,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        title: "Lecionário Dominical e Festivo",
        category: "livro",
        price: 25000,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        title: "Imagem Imaculada Conceição 30cm",
        category: "imagem",
        price: 28000,
        image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 7,
        title: "Terço de Pérola com Cruz Dourada",
        category: "terco",
        price: 9000,
        image: "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 8,
        title: "Vela Aromática Sagrada Família",
        category: "acessorio",
        price: 5500,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"
    }
];

// WhatsApp do negócio em Angola
const ANGOLA_WHATSAPP_NUMBER = "244923000000";

let cart = [];
let currentCategory = "all";
let searchQuery = "";

/* ==========================================================================
   2. INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initDivineCanvas();
    renderProducts(PRODUCTS);
    setupFilters();
    setupSearch();
    setupCartModal();
    setupThemeToggle();
});

/* ==========================================================================
   3. MODO NOTURNO (Dark Mode)
   ========================================================================== */
function setupThemeToggle() {
    const themeBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");

        if (isDark) {
            themeIcon.setAttribute("data-lucide", "sun");
        } else {
            themeIcon.setAttribute("data-lucide", "moon");
        }
        lucide.createIcons();
    });
}

/* ==========================================================================
   4. CANVAS DE POEIRA DIVINA
   ========================================================================== */
function initDivineCanvas() {
    const canvas = document.getElementById("sacredCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.2,
            speedY: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.2,
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#d4af37";
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

/* ==========================================================================
   5. RENDERIZAÇÃO E FILTRAGEM DE PRODUTOS
   ========================================================================== */
function formatKwanza(price) {
    return price.toLocaleString('pt-AO') + " AOA";
}

function filterAndRenderProducts() {
    let filtered = PRODUCTS;

    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    }

    renderProducts(filtered);
}

function renderProducts(productList) {
    const grid = document.getElementById("productsGrid");
    grid.innerHTML = "";

    if (productList.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Nenhum artigo encontrado.</p>`;
        return;
    }

    productList.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image">
                <img src="${prod.image}" alt="${prod.title}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${prod.category}</span>
                <h3 class="product-title">${prod.title}</h3>
                <div class="product-bottom">
                    <span class="product-price">${formatKwanza(prod.price)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${prod.id})" aria-label="Adicionar ao carrinho">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    lucide.createIcons();
}

/* ==========================================================================
   6. FILTROS E PESQUISA
   ========================================================================== */
function setupFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentCategory = btn.getAttribute("data-filter");
            filterAndRenderProducts();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        filterAndRenderProducts();
    });
}

/* ==========================================================================
   7. CARRINHO DE COMPRAS & CONTROLO DE QUANTIDADES (+ e -)
   ========================================================================== */
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product: product, quantity: 1 });
    }

    updateCartUI();
    openCartModal();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.product.id !== productId);
    }

    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartBody = document.getElementById("cartBody");
    const cartTotal = document.getElementById("cartTotal");

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        cartBody.innerHTML = `<p class="empty-cart-msg">O seu carrinho está vazio.</p>`;
        cartTotal.textContent = "0 AOA";
        return;
    }

    cartBody.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.product.title}</div>
                <div class="cart-item-price">${formatKwanza(item.product.price)} un.</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="changeQuantity(${item.product.id}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.product.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="changeQuantity(${item.product.id}, -${item.quantity})" aria-label="Remover">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        cartBody.appendChild(itemEl);
    });

    cartTotal.textContent = formatKwanza(total);
    lucide.createIcons();
}

function setupCartModal() {
    const modal = document.getElementById("cartModal");
    const cartBtn = document.getElementById("cartBtn");
    const closeBtn = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutWhatsappBtn");

    cartBtn.addEventListener("click", openCartModal);
    closeBtn.addEventListener("click", closeCartModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeCartModal();
    });

    checkoutBtn.addEventListener("click", sendWhatsAppOrder);
}

function openCartModal() {
    document.getElementById("cartModal").classList.add("active");
}

function closeCartModal() {
    document.getElementById("cartModal").classList.remove("active");
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }

    const currentHour = new Date().getHours();
    if (currentHour < 7 || currentHour >= 22) {
        alert("Pedimos desculpa, mas os pedidos via WhatsApp só estão disponíveis entre as 07:00 e as 22:00. Por favor, volte amanhã dentro do horário de atendimento!");
        return;
    }

    let message = "Olá! Gostaria de encomendar os seguintes artigos na *Hosana.ao*:\n\n";
    let total = 0;

    cart.forEach((item, idx) => {
        const itemTotal = item.product.price * item.quantity;
        message += `${idx + 1}. *${item.product.title}* (${item.quantity}x) - ${formatKwanza(itemTotal)}\n`;
        total += itemTotal;
    });

    message += `\n*Total do Pedido:* ${formatKwanza(total)}`;
    message += `\n\nPor favor, gostaria de combinar o pagamento e a entrega para Angola.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ANGOLA_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
}