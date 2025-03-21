// Global variables for product functionality
let products = [];
let filteredProducts = [];
let baseUrl = 'http://localhost:5000';

// Initialize product functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up product-specific event listeners
    setupProductEventListeners();
    
    // Check if we're on the product list page
    if (window.location.pathname.includes('product-list.html')) {
        // Load products
        loadProducts();
        
        // Initialize filters
        initializeFilters();
    }
    
    // Check if we're on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        // Load product details
        loadProductDetails();
    }
});

// Set up product-specific event listeners
function setupProductEventListeners() {
    // Search form submission
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

    // Search buttons
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            if (searchInput.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // Mobile search button
    const mobileSearchInput = document.getElementById('mobile-search-input');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                window.location.href = `product-list.html?search=${encodeURIComponent(this.value.trim())}`;
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Initialize filters on product list page
function initializeFilters() {
    // Category filter event listeners
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Brand filter event listeners
    const brandFilters = document.querySelectorAll('.brand-filter');
    brandFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Rating filter event listeners
    const ratingFilters = document.querySelectorAll('.rating-filter');
    ratingFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    // Price filter button
    const applyPriceButton = document.getElementById('apply-price-filter');
    if (applyPriceButton) {
        applyPriceButton.addEventListener('click', applyFilters);
    }

    // Sort selection
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // View toggle buttons
    const gridViewButton = document.getElementById('grid-view');
    const listViewButton = document.getElementById('list-view');
    const productsContainer = document.getElementById('products-container');
    
    if (gridViewButton && listViewButton && productsContainer) {
        gridViewButton.addEventListener('click', function() {
            productsContainer.classList.remove('grid-cols-1');
            productsContainer.classList.add('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
            gridViewButton.classList.add('text-blue-600');
            gridViewButton.classList.remove('text-gray-400');
            listViewButton.classList.add('text-gray-400');
            listViewButton.classList.remove('text-blue-600');
        });
        
        listViewButton.addEventListener('click', function() {
            productsContainer.classList.remove('sm:grid-cols-2', 'lg:grid-cols-3');
            productsContainer.classList.add('grid-cols-1');
            listViewButton.classList.add('text-blue-600');
            listViewButton.classList.remove('text-gray-400');
            gridViewButton.classList.add('text-gray-400');
            gridViewButton.classList.remove('text-blue-600');
        });
    }

    // Clear filters button
    const clearFiltersButton = document.getElementById('clear-filters');
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', function() {
            // Clear all checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear price inputs
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';
            
            // Reset sort to default
            document.getElementById('sort-by').value = 'featured';
            
            // Apply cleared filters
            applyFilters();
        });
    }

    // Reset search button
    const resetSearchButton = document.getElementById('reset-search');
    if (resetSearchButton) {
        resetSearchButton.addEventListener('click', function() {
            window.location.href = 'product-list.html';
        });
    }

    // Check URL parameters for initial filtering
    handleUrlParams();
}

// Load products from API or fallback data
async function loadProducts() {
    try {
        // Try to fetch from API first
        const response = await fetch(`${baseUrl}/api/products`);
        
        // Check if the request was successful
        if (response.ok) {
            products = await response.json();
            filteredProducts = [...products];
            renderProductList(filteredProducts);
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
            name: 'MacBook Pro 13"',
            description: 'Latest model with Apple M2 chip, 8GB RAM, 256GB SSD',
            price: 1299.99,
            category: 'laptops',
            brand: 'apple',
            rating: 4.5,
            reviewCount: 128,
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 2,
            name: 'Samsung Galaxy S23',
            description: '6.1" Display, 128GB Storage, 8GB RAM, 50MP Camera',
            price: 899.99,
            category: 'smartphones',
            brand: 'samsung',
            rating: 4.8,
            reviewCount: 95,
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 3,
            name: 'Sony WH-1000XM5',
            description: 'Wireless Premium Noise Cancelling Headphones',
            price: 249.99,
            category: 'accessories',
            brand: 'sony',
            rating: 4.3,
            reviewCount: 74,
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 4,
            name: 'Apple Watch Series 8',
            description: 'GPS, 41mm Aluminum Case with Sport Band',
            price: 399.99,
            category: 'wearables',
            brand: 'apple',
            rating: 4.6,
            reviewCount: 112,
            image: 'https://placehold.co/300x200',
            featured: true
        },
        {
            id: 5,
            name: 'Dell XPS 13',
            description: '13.3" FHD Display, Intel Core i5, 8GB RAM, 256GB SSD',
            price: 849.99,
            category: 'laptops',
            brand: 'dell',
            rating: 4.2,
            reviewCount: 63,
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 6,
            name: 'Samsung Galaxy Buds Pro',
            description: 'Wireless Earbuds with Active Noise Cancellation',
            price: 129.99,
            category: 'accessories',
            brand: 'samsung',
            rating: 4.1,
            reviewCount: 87,
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 7,
            name: 'iPad Air',
            description: '10.9-inch display, A14 Bionic chip, 64GB storage',
            price: 599.99,
            category: 'tablets',
            brand: 'apple',
            rating: 4.7,
            reviewCount: 92,
            image: 'https://placehold.co/300x200',
            featured: false
        },
        {
            id: 8,
            name: 'Logitech MX Master 3',
            description: 'Advanced Wireless Mouse for Mac and PC',
            price: 99.99,
            category: 'accessories',
            brand: 'logitech',
            rating: 4.4,
            reviewCount: 56,
            image: 'https://placehold.co/300x200',
            featured: false
        }
    ];
    
    filteredProducts = [...products];
    
    // If we're on the product list page, render products
    if (window.location.pathname.includes('product-list.html')) {
        handleUrlParams(); // This will apply any filters and render the list
    }
}

// Handle URL parameters for filtering products
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    // Reset filters first
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Apply category filter from URL if present
    if (categoryParam) {
        const categoryCheckbox = document.getElementById(`category-${categoryParam}`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
        
        // Update the category title
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
        }
    }
    
    // Apply search filter if present
    if (searchParam) {
        document.getElementById('search-input').value = searchParam;
        
        // Update the search result title
        const searchTitle = document.getElementById('search-title');
        if (searchTitle) {
            searchTitle.textContent = `Search Results for "${searchParam}"`;
        }
    }
    
    // Apply filters
    applyFilters();
}

// Apply all active filters and sort options
function applyFilters() {
    // Start with all products
    filteredProducts = [...products];
    
    // Get filter values
    const selectedCategories = getSelectedValues('.category-filter');
    const selectedBrands = getSelectedValues('.brand-filter');
    const selectedRatings = getSelectedValues('.rating-filter');
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Number.MAX_VALUE;
    const sortBy = document.getElementById('sort-by').value;
    
    // Apply search filter from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
        const searchTerm = searchParam.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedBrands.includes(product.brand)
        );
    }
    
    // Apply rating filter (products with rating >= selected)
    if (selectedRatings.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedRatings.some(rating => product.rating >= parseInt(rating))
        );
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
    
    // Apply sorting
    sortProducts(sortBy);
    
    // Render the filtered products
    renderProductList(filteredProducts);
}

// Get selected values from a group of checkboxes
function getSelectedValues(selector) {
    const selectedValues = [];
    document.querySelectorAll(selector).forEach(checkbox => {
        if (checkbox.checked) {
            selectedValues.push(checkbox.value);
        }
    });
    return selectedValues;
}

// Sort products based on selected option
function sortProducts(sortOption) {
    switch (sortOption) {
        case 'featured':
            filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Assuming newer products have higher IDs
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
}

// Render product list on product-list.html
function renderProductList(products) {
    const productsContainer = document.getElementById('products-container');
    const noResultsElement = document.getElementById('no-results');
    
    if (!productsContainer) return;
    
    // Clear any existing content
    productsContainer.innerHTML = '';
    
    // Check if we have any products
    if (products.length === 0) {
        noResultsElement.classList.remove('hidden');
        productsContainer.classList.add('hidden');
        return;
    }
    
    // Hide no results message if we have products
    noResultsElement.classList.add('hidden');
    productsContainer.classList.remove('hidden');
    
    // Add each product
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300';
        productElement.dataset.category = product.category;
        productElement.dataset.price = product.price;
        productElement.dataset.rating = product.rating;
        productElement.dataset.brand = product.brand;
        
        // Generate star rating HTML
        const ratingHtml = generateRatingStars(product.rating);
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <div class="text-yellow-400 mb-2">
                    ${ratingHtml}
                    <span class="text-gray-600 text-sm ml-1">(${product.reviewCount || 0})</span>
                </div>
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
        productsContainer.appendChild(productElement);
    });
    
    // Update the product count in the header if it exists
    const productCountElement = document.getElementById('product-count');
    if (productCountElement) {
        productCountElement.textContent = `${products.length} products`;
    }
}

// Generate HTML for star ratings
function generateRatingStars(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Load product details for the product detail page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'product-list.html';
        return;
    }
    
    // If we haven't loaded products yet, load them
    if (products.length === 0) {
        // Try to fetch product details directly
        fetchProductDetails(productId);
        return;
    }
    
    // Try to find the product in our loaded products
    const product = products.find(p => p.id === productId);
    
    // If product wasn't found
    if (!product) {
        // Try to fetch it directly
        fetchProductDetails(productId);
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
            // Try the fallback data
            loadFallbackProducts();
            const product = products.find(p => p.id === productId);
            
            if (product) {
                renderProductDetails(product);
            } else {
                document.getElementById('product-not-found').classList.remove('hidden');
                document.getElementById('product-details').classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        
        // Try the fallback data
        loadFallbackProducts();
        const product = products.find(p => p.id === productId);
        
        if (product) {
            renderProductDetails(product);
        } else {
            document.getElementById('product-not-found').classList.remove('hidden');
            document.getElementById('product-details').classList.add('hidden');
        }
    }
}

// Render product details on the product detail page
function renderProductDetails(product) {
    const productDetailsElement = document.getElementById('product-details');
    if (!productDetailsElement) return;
    
    // Show the product details section
    productDetailsElement.classList.remove('hidden');
    
    // Hide the not found message
    const notFoundElement = document.getElementById('product-not-found');
    if (notFoundElement) {
        notFoundElement.classList.add('hidden');
    }
    
    // Update page elements with product details
    document.title = `${product.name} - TechMart`;
    
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    
    // Update rating if available
    if (product.rating) {
        const ratingElement = document.getElementById('product-rating');
        if (ratingElement) {
            ratingElement.innerHTML = generateRatingStars(product.rating);
        }
        
        const reviewCountElement = document.getElementById('review-count');
        if (reviewCountElement) {
            reviewCountElement.textContent = `(${product.reviewCount || 0} reviews)`;
        }
    }
    
    // Set up the add to cart button
    const addToCartButton = document.getElementById('add-to-cart-button');
    if (addToCartButton) {
        addToCartButton.onclick = function() {
            addToCart(product.id);
        };
    }
    
    // Add to recently viewed (if supported)
    addToRecentlyViewed(product);
}

// Add a product to recently viewed list (stored in localStorage)
function addToRecentlyViewed(product) {
    // Try to get existing recently viewed items
    let recentlyViewed = [];
    try {
        recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    } catch (e) {
        recentlyViewed = [];
    }
    
    // Remove the product if it's already in the list
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
    
    // Add the product to the beginning of the list
    recentlyViewed.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
    });
    
    // Keep only the 4 most recent items
    recentlyViewed = recentlyViewed.slice(0, 4);
    
    // Save to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Function used by addToCart button
function addToCart(productId) {
    // Find the product by ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Dispatch custom event for app.js to handle
    const event = new CustomEvent('addToCart', {
        detail: { product: product, quantity: 1 }
    });
    document.dispatchEvent(event);
    
    // Show confirmation message
    showToast(`${product.name} added to cart!`);
}

// Show a toast notification
function showToast(message) {
    // Check if a toast container already exists
    let toastContainer = document.getElementById('toast-container');
    
    // If not, create one
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }
    
    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'bg-green-500 text-white px-4 py-2 rounded shadow-lg mb-2 transition-opacity duration-500 opacity-0';
    toast.innerText = message;
    
    // Add it to the container
    toastContainer.appendChild(toast);
    
    // Trigger animation to fade in
    setTimeout(() => {
        toast.classList.remove('opacity-0');
    }, 10);
    
    // Fade out and remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}