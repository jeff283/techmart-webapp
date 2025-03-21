
// Global variables
let cart = [];
let products = [];
let featuredProducts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the cart from localStorage
    initCart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load products from API (or fallback to local data if needed)
    loadProducts();
    
    // Check if we're on the product list page
    if (window.location.pathname.includes('product-list.html')) {
        // Handle URL parameters (for filtering)
        handleUrlParams();
    }
    
    // Check if we're on the cart page
    if (window.location.pathname.includes('cart.html')) {
        // Render cart items
        renderCartPage();
    }
    
    // Check if we're on the orders page
    if (window.location.pathname.includes('orders.html')) {
        // Load order history
        loadOrderHistory();
    }
    
    // Check if we're on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        // Load product details
        loadProductDetails();
    }
});

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('techmart-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('techmart-cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in the UI
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountElement.innerText = totalItems;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Search form submission
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            if (searchInput.value.trim()) {
                window.location.href = `pages/product-list.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('form[class*="newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value.trim()) {
                // This would normally send to an API
                alert('Thanks for subscribing!');
                emailInput.value = '';
            }
        });
    }
}

// Load products from API
async function loadProducts() {
    try {
        // Try to fetch from API first
        const response = await fetch('/api/products');
        
        // Check if the request was successful
        if (response.ok) {
            products = await response.json();
        } else {
            // If API request fails, use fallback data
            loadFallbackProducts();
        }
        
        // Display products on the page if we're on a product page
        if (window.location.pathname.includes('product-list.html')) {
            renderProductList(products);
        }
        
        // If we're on the homepage, update the featured products
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            featuredProducts = products.filter(product => product.featured).slice(0, 4);
            renderFeaturedProducts(featuredProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        // Use fallback data if API request fails
        loadFallbackProducts();
    }
}

// Load fallback product data (used when API is unavailable)
function loadFallbackProducts() {
    // Fallback data for offline development or when API is down
    products = [
        {
            id: 1,
            name: 'Premium Laptop',
            description: 'Ultra-thin design with powerful performance.',
            price: 1299.99,
            category: 'laptops',
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 2,
            name: 'Wireless Earbuds',
            description: 'Noise-cancelling with crystal clear sound.',
            price: 129.99,
            category: 'accessories',
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 3,
            name: 'Smart Watch',
            description: 'Monitor your health and stay connected.',
            price: 249.99,
            category: 'wearables',
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 4,
            name: '4K Smart TV',
            description: 'Immersive viewing experience with AI features.',
            price: 799.99,
            category: 'electronics',
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 5,
            name: 'Gaming Laptop',
            description: 'High-performance gaming laptop with RGB keyboard.',
            price: 1499.99,
            category: 'laptops',
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 6,
            name: 'Smartphone Pro',
            description: 'Latest flagship smartphone with advanced camera system.',
            price: 999.99,
            category: 'smartphones',
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 7,
            name: 'Bluetooth Speaker',
            description: 'Portable speaker with rich bass and long battery life.',
            price: 89.99,
            category: 'accessories',
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 8,
            name: 'Fitness Tracker',
            description: 'Track your workouts and health metrics.',
            price: 79.99,
            category: 'wearables',
            image: 'https://placehold.co/300x200',
            featured: false
        }
    ];
    
    // Set featured products for homepage
    featuredProducts = products.filter(product => product.featured);
    
    // Render products if on appropriate page
    if (window.location.pathname.includes('product-list.html')) {
        renderProductList(products);
    }
    
    // If we're on the homepage, update the featured products
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        renderFeaturedProducts(featuredProducts);
    }
}

// Render featured products on homepage
function renderFeaturedProducts(featuredProducts) {
    const featuredSection = document.querySelector('#featured .grid');
    if (!featuredSection) return;
    
    // Clear any existing content
    featuredSection.innerHTML = '';
    
    // Add each featured product
    featuredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">$${product.price.toFixed(2)}</span>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
                            onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        featuredSection.appendChild(productElement);
    });
}

// Render product list on product-list.html
function renderProductList(products) {
    const productListElement = document.getElementById('product-list');
    if (!productListElement) return;
    
    // Clear any existing content
    productListElement.innerHTML = '';
    
    // Check if we have any products
    if (products.length === 0) {
        productListElement.innerHTML = '<p class="text-center text-gray-500 py-8">No products found matching your criteria.</p>';
        return;
    }
    
    // Add each product
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-blue-600 font-bold">$${product.price.toFixed(2)}</span>
                    <div class="flex space-x-2">
                        <a href="product-detail.html?id=${product.id}" 
                           class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Details</a>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
                                onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        productListElement.appendChild(productElement);
    });
}

// Handle URL parameters for filtering products
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    // Filter products based on URL parameters
    let filteredProducts = [...products];
    
    if (categoryParam) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === categoryParam.toLowerCase()
        );
        
        // Update the category title
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
        }
    }
    
    if (searchParam) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchParam.toLowerCase()) || 
            product.description.toLowerCase().includes(searchParam.toLowerCase())
        );
        
        // Update the search result title
        const searchTitle = document.getElementById('search-title');
        if (searchTitle) {
            searchTitle.textContent = `Search Results for "${searchParam}"`;
        }
    }
    
    // Render the filtered products
    renderProductList(filteredProducts);
}

// Add product to cart
function addToCart(productId) {
    // Find the product by ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
    }
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Show notification
function showNotification(message) {
    // Check if a notification container already exists
    let notificationContainer = document.getElementById('notification-container');
    
    // Create one if it doesn't exist
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(notificationContainer);
    }
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = 'bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg mb-2 transform transition-all duration-300 translate-y-full opacity-0';
    notification.textContent = message;
    
    // Add it to the container
    notificationContainer.appendChild(notification);
    
    // Trigger animation to show the notification
    setTimeout(() => {
        notification.classList.remove('translate-y-full', 'opacity-0');
    }, 10);
    
    // Remove the notification after a delay
    setTimeout(() => {
        notification.classList.add('translate-y-full', 'opacity-0');
        
        // Remove the element from the DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Render cart page
function renderCartPage() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (!cartItemsElement || !cartTotalElement) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
        if (cartItemsElement) cartItemsElement.classList.add('hidden');
        if (checkoutButton) checkoutButton.classList.add('hidden');
        if (cartTotalElement) cartTotalElement.textContent = '$0.00';
        return;
    }
    
    // Cart has items
    if (cartEmptyMessage) cartEmptyMessage.classList.add('hidden');
    if (cartItemsElement) cartItemsElement.classList.remove('hidden');
    if (checkoutButton) checkoutButton.classList.remove('hidden');
    
    // Clear current items
    cartItemsElement.innerHTML = '';
    
    // Calculate total
    let total = 0;
    
    // Add each item to the cart
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'flex items-center py-4 border-b';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
            <div class="flex-grow">
                <h3 class="font-medium">${item.name}</h3>
                <p class="text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button class="bg-gray-200 text-gray-800 w-8 h-8 rounded-full" 
                        onclick="updateCartItem(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="bg-gray-200 text-gray-800 w-8 h-8 rounded-full" 
                        onclick="updateCartItem(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="ml-4 font-medium">$${itemTotal.toFixed(2)}</div>
            <button class="ml-4 text-red-500" onclick="removeCartItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsElement.appendChild(cartItemElement);
    });
    
    // Update total
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Update cart item quantity
function updateCartItem(productId, newQuantity) {
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    // If quantity is 0 or less, remove the item
    if (newQuantity <= 0) {
        removeCartItem(productId);
        return;
    }
    
    // Update the quantity
    cart[itemIndex].quantity = newQuantity;
    
    // Save cart to localStorage
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Remove item from cart
function removeCartItem(productId) {
    // Filter out the item with the given ID
    cart = cart.filter(item => item.id !== productId);
    
    // Save cart to localStorage
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    
    // Re-render the cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// Load product details for the product detail page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'product-list.html';
        return;
    }
    
    // Try to find the product in our loaded products
    let product = products.find(p => p.id === productId);
    
    // If we couldn't find it, try to fetch it from API
    if (!product && products.length === 0) {
        fetchProductDetails(productId);
        return;
    }
    
    // If product wasn't found even in loaded products
    if (!product) {
        document.getElementById('product-not-found').classList.remove('hidden');
        document.getElementById('product-details').classList.add('hidden');
        return;
    }
    
    // Display product details
    renderProductDetails(product);
}

// Fetch a single product's details from API
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.ok) {
            const product = await response.json();
            renderProductDetails(product);
        } else {
            document.getElementById('product-not-found').classList.remove('hidden');
            document.getElementById('product-details').classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('product-not-found').classList.remove('hidden');
        document.getElementById('product-details').classList.add('hidden');
    }
}

// Render product details on the product detail page
function renderProductDetails(product) {
    const productDetailsElement = document.getElementById('product-details');
    if (!productDetailsElement) return;
    
    // Update page elements with product details
    document.title = `${product.name} - TechMart`;
    
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    
    // Set up the add to cart button
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(product.id);
        };
    }
}

// Load order history
function loadOrderHistory() {
    // This would normally fetch from an API, but for demo we'll use localStorage
    const orders = JSON.parse(localStorage.getItem('techmart-orders') || '[]');
    
    const orderHistoryElement = document.getElementById('order-history');
    const emptyOrdersMessage = document.getElementById('empty-orders');
    
    if (!orderHistoryElement) return;
    
    // Check if there are no orders
    if (orders.length === 0) {
        if (emptyOrdersMessage) emptyOrdersMessage.classList.remove('hidden');
        orderHistoryElement.classList.add('hidden');
        return;
    }
    
    // Orders exist
    if (emptyOrdersMessage) emptyOrdersMessage.classList.add('hidden');
    orderHistoryElement.classList.remove('hidden');
    
    // Clear existing content
    orderHistoryElement.innerHTML = '';
    
    // Add each order
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'bg-white rounded-lg shadow-md p-4 mb-4';
        
        // Calculate order total
        let orderTotal = 0;
        order.items.forEach(item => {
            orderTotal += item.price * item.quantity;
        });
        
        // Create order header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'flex justify-between items-center border-b pb-2 mb-3';
        orderHeader.innerHTML = `
            <div>
                <h3 class="font-bold">Order #${order.id}</h3>
                <p class="text-sm text-gray-600">${new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
                <span class="px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                }">${order.status}</span>
            </div>
        `;
        orderElement.appendChild(orderHeader);
        
        // Create order items
        const orderItems = document.createElement('div');
        orderItems.className = 'space-y-2 mb-3';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between py-1';
            itemElement.innerHTML = `
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded mr-3">
                    <span>${item.name} x ${item.quantity}</span>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItems.appendChild(itemElement);
        });
        
        orderElement.appendChild(orderItems);
        
        // Create order footer
        const orderFooter = document.createElement('div');
        orderFooter.className = 'flex justify-between border-t pt-2';
        orderFooter.innerHTML = `
            <span class="font-bold">Total</span>
            <span class="font-bold">$${orderTotal.toFixed(2)}</span>
        `;
        orderElement.appendChild(orderFooter);
        
        orderHistoryElement.appendChild(orderElement);
    });
}

// Process checkout (for the checkout page)
async function processCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // TODO:
    // send the order to an API
    // For demo purposes, we'll just save it to localStorage
    
    const orders = JSON.parse(localStorage.getItem('techmart-orders') || '[]');
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'Processing',
        items: [...cart]
    };
    
    orders.push(newOrder);
    localStorage.setItem('techmart-orders', JSON.stringify(orders));
    
    // Clear the cart
    clearCart();
    
    // Show success message
    showNotification('Order placed successfully!');
    
    // Redirect to orders page
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 2000);
}

// Filter products by search term
function searchProducts(searchTerm) {
    if (!searchTerm) return products;
    
    searchTerm = searchTerm.toLowerCase();
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
}

// This is the public function that will be called from HTML
window.addToCart = addToCart;
window.updateCartItem = updateCartItem;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.processCheckout = processCheckout;