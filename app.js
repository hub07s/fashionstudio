// Fashion Studio JavaScript

// Product data
const products = [
    {
        id: 1,
        name: "Classic",
        category: "Suits",
        price: 59,
        description: "Timeless denim button-up perfect for casual or dressed-up looks",
        image: "img6.avif"
    },
    {
        id: 2,
        name: "Silk",
        category: "Suits",
        price: 149,
        description: "Elegant silk dress with refined details for special occasions",
        image: "img7.avif"
    },
    {
        id: 3,
        name: "High-classic",
        category: "Suits",
        price: 79,
        description: "Flattering high-waist jeans in premium denim",
        image: "img8.avif"
    },
    {
        id: 4,
        name: "blue and white",
        category: "Suits",
        price: 89,
        description: "Cozy two-tone knitted sweater for cool weather",
        image: "img9.avif"
    },
    {
        id: 5,
        name: "Tailored Blazer",
        category: "Suits",
        price: 129,
        description: "Professional blazer with clean lines and perfect fit",
        image: "img10.avif"
    },
    {
        id: 6,
        name: "Casual blazer",
        category: "Suits",
        price: 69,
        description: "Light and breezy dress perfect for warm weather",
        image: "img11.avif"
    },
    {
        id: 7,
        name: "black and white",
        category: "Dresses",
        price: 119,
        description: "Versatile leather boots that pair with any outfit",
        image: "img0.avif"
    },
    {
        id: 8,
        name: "Silk Scarf",
        category: "Dresses",
        price: 39,
        description: "Luxurious silk scarf to elevate any ensemble",
        image: "img1.avif"
    },
    {
        id: 9,
        name: "Wide-Leg Trousers",
        category: "Dresses",
        price: 89,
        description: "Comfortable wide-leg trousers in breathable fabric",
        image: "img2.avif"
    },
    {
        id: 10,
        name: "white and pink saree",
        category: "Dresses",
        price: 159,
        description: "Designer handbag with unique detailing",
        image: "img3.avif"
    },
    {
        id: 11,
        name: "wedding wear",
        category: "Dresses",
        price: 199,
        description: "Luxurious cashmere coat for ultimate sophistication",
        image: "img4.avif"
    },
    {
        id: 12,
        name: "Classic White Saree",
        category: "Dresses",
        price: 99,
        description: "Timeless white sneakers for everyday comfort and style",
        image: "img5.avif"
    }
];

// Global state
let cart = [];
let currentFilter = 'all';
let currentSlide = 0;

// DOM elements
let hamburger, mobileMenu, cartBtn, cartCount, cartModal, productModal, productsGrid;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeDOM();
    initializeApp();
});

function initializeDOM() {
    hamburger = document.getElementById('hamburger');
    mobileMenu = document.getElementById('mobileMenu');
    cartBtn = document.getElementById('cartBtn');
    cartCount = document.getElementById('cartCount');
    cartModal = document.getElementById('cartModal');
    productModal = document.getElementById('productModal');
    productsGrid = document.getElementById('productsGrid');
}

function initializeApp() {
    loadCartFromStorage();
    renderProducts();
    setupEventListeners();
    startHeroCarousel();
    updateCartUI();
}

// Cart functionality
function loadCartFromStorage() {
    try {
        const savedCart = sessionStorage.getItem('fashionStudioCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error loading cart from storage:', e);
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        sessionStorage.setItem('fashionStudioCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart to storage:', e);
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    renderCartItems();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = parseInt(quantity);
            saveCartToStorage();
            updateCartUI();
            renderCartItems();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// UI Updates
function updateCartUI() {
    if (!cartCount) return;
    
    const itemCount = getCartItemCount();
    cartCount.textContent = itemCount;
    cartCount.style.display = itemCount > 0 ? 'block' : 'none';
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartEmpty || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.classList.remove('hidden');
        cartTotal.textContent = '0';
        return;
    }
    
    cartEmpty.classList.add('hidden');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-input">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = getCartTotal().toFixed(2);
}

// Product rendering
function renderProducts(filterCategory = 'all') {
    if (!productsGrid) return;
    
    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-actions">
                    <button class="btn btn--primary btn--add-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn--quick-view" onclick="openProductModal(${product.id})">
                        Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Category filtering
function filterProducts(category) {
    currentFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-filter="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Re-render products with filter
    renderProducts(category);
    
    // Scroll to products section
    const productsSection = document.getElementById('shop');
    if (productsSection) {
        smoothScrollTo('shop');
    }
}

// Modal functionality
function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

function openCartModal() {
    renderCartItems();
    openModal(cartModal);
}

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !productModal) return;
    
    document.getElementById('productModalImage').src = product.image;
    document.getElementById('productModalImage').alt = product.name;
    document.getElementById('productModalName').textContent = product.name;
    document.getElementById('productModalPrice').textContent = product.price;
    document.getElementById('productModalDescription').textContent = product.description;
    document.getElementById('productQuantity').value = 1;
    
    // Store current product for add to cart
    productModal.dataset.productId = productId;
    
    openModal(productModal);
}

// Hero carousel
function startHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Auto-advance slides
    setInterval(nextSlide, 5000);
    
    // Manual navigation
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    
    const isOpen = mobileMenu.classList.contains('show');
    
    if (isOpen) {
        mobileMenu.classList.remove('show');
        hamburger.classList.remove('active');
    } else {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('show');
        hamburger.classList.add('active');
    }
}

// Smooth scrolling
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId.replace('#', ''));
    if (!target) return;
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
    const targetPosition = target.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-success);
        color: var(--color-btn-primary-text);
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event listeners setup
function setupEventListeners() {
    // Mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Cart modal
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartModal);
    }
    
    const closeCartBtn = document.getElementById('closeCartModal');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => closeModal(cartModal));
    }
    
    const continueShoppingBtn = document.getElementById('continueShopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => closeModal(cartModal));
    }
    
    // Product modal
    const closeProductBtn = document.getElementById('closeProductModal');
    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => closeModal(productModal));
    }
    
    // Product modal quantity controls
    const increaseQtyBtn = document.getElementById('increaseQty');
    if (increaseQtyBtn) {
        increaseQtyBtn.addEventListener('click', () => {
            const qtyInput = document.getElementById('productQuantity');
            if (qtyInput) {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            }
        });
    }
    
    const decreaseQtyBtn = document.getElementById('decreaseQty');
    if (decreaseQtyBtn) {
        decreaseQtyBtn.addEventListener('click', () => {
            const qtyInput = document.getElementById('productQuantity');
            if (qtyInput) {
                const currentValue = parseInt(qtyInput.value);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                }
            }
        });
    }
    
    // Add to cart from modal
    const addToCartModalBtn = document.getElementById('addToCartModal');
    if (addToCartModalBtn) {
        addToCartModalBtn.addEventListener('click', () => {
            if (productModal) {
                const productId = parseInt(productModal.dataset.productId);
                const quantityInput = document.getElementById('productQuantity');
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                addToCart(productId, quantity);
                closeModal(productModal);
            }
        });
    }
    
    // Category filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            filterProducts(category);
        });
    });
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterProducts(category);
        });
    });
    
    // Navigation links
    document.querySelectorAll('a[href^="#"], .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                smoothScrollTo(href);
            }
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Hero CTA buttons
    document.querySelectorAll('.hero-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            smoothScrollTo('shop');
        });
    });
    
    // Modal overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            if (email) {
                showNotification('Successfully subscribed to newsletter!');
                e.target.reset();
            }
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                showNotification('Checkout functionality would be implemented here!', 'info');
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.modal.show').forEach(modal => {
                closeModal(modal);
            });
            
            // Close mobile menu
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Scroll effects
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    if (header) {
        // Add transition to header
        header.style.transition = 'transform 0.3s ease';
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
}

// Initialize intersection observer for animations
function initializeAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    document.querySelectorAll('.category-card, .product-card, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize animations after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeAnimations, 500);
});

// Export functions for global access (for onclick handlers)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.openProductModal = openProductModal;
window.filterProducts = filterProducts;