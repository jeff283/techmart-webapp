// Global variables for product functionality
let products = [];
let baseUrl = 'http://localhost:5000';

// Initialize product functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up product-specific event listeners
    setupProductEventListeners();
    
    // Check if we're on the product list page
    if (window.location.pathname.includes('product-list.html')) {
        // Load products
        loadProducts();
        
        // Handle URL parameters (for filtering)
        handleUrlParams();
    }
    
    // Check if we're on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        // Load product details
        loadProductDetails();
    }
});

// Set up product-specific event listeners
function setupProductEventListeners() {
    // Search form submission on product pages
    const searchForm = document.querySelector('form[action="/search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            if (searchInput.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }
}

// Load products from API
async function loadProducts() {
    try {
        // Try to fetch from API first
        const response = await fetch(`${baseUrl}/api/products`);
        
        // Check if the request was successful
        if (response.ok) {
            products = await response.json();
            
            // Display products on the page if we're on a product page
            if (window.location.pathname.includes('product-list.html')) {
                handleUrlParams(); // This will apply any filters and render the list
            }
        } else {
            // If API request fails, use fallback data
            loadFallbackProducts();
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
    
    // If we're on the product list page, render products
    if (window.location.pathname.includes('product-list.html')) {
        handleUrlParams(); // This will apply any filters and render the list
    }
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
        const response = await fetch(`${baseUrl}/api/products/${productId}`);
        
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

// Filter products by search term
function searchProducts(searchTerm) {
    if (!searchTerm) return products;
    
    searchTerm = searchTerm.toLowerCase();
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
}