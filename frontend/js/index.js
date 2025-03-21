// Global variables for index page
let featuredProducts = [];
let baseUrl = 'http://localhost:5000';

// Initialize the index page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        // Load featured products
        loadFeaturedProducts();
        
        // Set up homepage-specific event listeners
        setupIndexEventListeners();
    }
});

// Set up index page event listeners
function setupIndexEventListeners() {
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
}

// Load featured products for homepage
async function loadFeaturedProducts() {
    try {
        // Try to fetch from API first
        const response = await fetch(`${baseUrl}/api/products?featured=true`);
        
        // Check if the request was successful
        if (response.ok) {
            featuredProducts = await response.json();
            renderFeaturedProducts(featuredProducts);
        } else {
            // If API request fails, use fallback data
            loadFallbackFeaturedProducts();
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
        // Use fallback data if API request fails
        loadFallbackFeaturedProducts();
    }
}

// Load fallback featured products
function loadFallbackFeaturedProducts() {
    // Fallback data for offline development or when API is down
    featuredProducts = [
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
        }
    ];
    
    // Render the featured products
    renderFeaturedProducts(featuredProducts);
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