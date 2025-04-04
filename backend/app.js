document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsContainer = document.getElementById('productsContainer');
    const productSearch = document.getElementById('productSearch');
    const locationSearch = document.getElementById('locationSearch');
    const applyFilters = document.getElementById('applyFilters');
    const sortBy = document.getElementById('sortBy');
    const pagination = document.getElementById('pagination');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    // Chat bubble functionality
    const chatBtn = document.querySelector('.chat-btn');
    const chatWindow = document.querySelector('.chat-window');
    const closeChat = document.querySelector('.close-chat');
    
    chatBtn.addEventListener('click', function() {
        chatWindow.classList.toggle('active');
    });
    
    closeChat.addEventListener('click', function() {
        chatWindow.classList.remove('active');
    });
    
    // Current page and items per page
    let currentPage = 1;
    const itemsPerPage = 8;
    
    // Fetch products from API
    async function fetchProducts() {
        try {
            // Show loading state
            productsContainer.innerHTML = `
                <div class="loading-spinner" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                    <p>Loading products...</p>
                </div>
            `;
            
            // Get search parameters
            const productName = productSearch.value.trim();
            const location = locationSearch.value.trim();
            const sortOption = sortBy.value;
            
            // Build query parameters
            let queryParams = `page=${currentPage}&limit=${itemsPerPage}`;
            
            if (productName) {
                queryParams += `&name=${encodeURIComponent(productName)}`;
            }
            
            if (location) {
                queryParams += `&location=${encodeURIComponent(location)}`;
            }
            
            // Add sorting
            switch(sortOption) {
                case 'priceLow':
                    queryParams += '&sort=price&order=1';
                    break;
                case 'priceHigh':
                    queryParams += '&sort=price&order=-1';
                    break;
                case 'distance':
                    // This would require geolocation implementation
                    queryParams += '&sort=distance&order=1';
                    break;
                default:
                    queryParams += '&sort=createdAt&order=-1';
            }
            
            // Fetch products from your API
            const response = await fetch(`/api/products?${queryParams}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch products');
            }
            
            // Display products or no results message
            if (data.products.length === 0) {
                noProductsMessage.style.display = 'block';
                productsContainer.innerHTML = '';
            } else {
                noProductsMessage.style.display = 'none';
                displayProducts(data.products);
                setupPagination(data.total, data.pages);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            productsContainer.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; background-color: var(--card-bg); border-radius: 8px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--accent); margin-bottom: 15px;"></i>
                    <h3>Error loading products</h3>
                    <p>${error.message}</p>
                    <button onclick="fetchProducts()" class="btn btn-primary" style="margin-top: 15px;">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
    
    // Display products in the grid
    function displayProducts(products) {
        productsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image-container">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" class="product-image">` : 
                        `<div style="width: 100%; height: 100%; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-leaf" style="font-size: 2rem; color: #2e7d32;"></i>
                        </div>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-farmer">
                        <img src="https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg" class="farmer-avatar">
                        <span>Farmer ${product.location}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹${product.price.toFixed(2)}</span>
                        <span class="quantity">| ${product.quantity}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="addToWishlist('${product._id}')">
                            <i class="far fa-heart"></i> Wishlist
                        </button>
                        <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                            <i class="fas fa-shopping-cart"></i> Add
                        </button>
                    </div>
                    ${product.deliveryOption === 'yes' ? 
                        `<div style="margin-top: 10px; font-size: 0.8rem; color: var(--success);">
                            <i class="fas fa-truck"></i> Delivery available
                        </div>` : 
                        `<div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">
                            <i class="fas fa-store"></i> Pickup only
                        </div>`
                    }
                </div>
            `;
            
            productsContainer.appendChild(productCard);
        });
    }
    
    // Setup pagination
    function setupPagination(totalItems, totalPages) {
        pagination.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'btn btn-secondary';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchProducts();
            }
        });
        pagination.appendChild(prevButton);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.className = 'btn btn-secondary';
            firstPageButton.textContent = '1';
            firstPageButton.addEventListener('click', () => {
                currentPage = 1;
                fetchProducts();
            });
            pagination.appendChild(firstPageButton);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 10px';
                pagination.appendChild(ellipsis);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = i === currentPage ? 'btn btn-primary' : 'btn btn-secondary';
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                fetchProducts();
            });
            pagination.appendChild(pageButton);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 10px';
                pagination.appendChild(ellipsis);
            }
            
            const lastPageButton = document.createElement('button');
            lastPageButton.className = 'btn btn-secondary';
            lastPageButton.textContent = totalPages;
            lastPageButton.addEventListener('click', () => {
                currentPage = totalPages;
                fetchProducts();
            });
            pagination.appendChild(lastPageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'btn btn-secondary';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchProducts();
            }
        });
        pagination.appendChild(nextButton);
    }
    
    // Event listeners
    applyFilters.addEventListener('click', () => {
        currentPage = 1;
        fetchProducts();
    });
    
    sortBy.addEventListener('change', fetchProducts);
    
    // Search on Enter key
    [productSearch, locationSearch].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentPage = 1;
                fetchProducts();
            }
        });
    });
    
    // Initial load
    fetchProducts();
    
    // Geolocation for distance sorting (optional)
    if (navigator.geolocation && sortBy.value === 'distance') {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('User location:', position.coords.latitude, position.coords.longitude);
                // You would send these coordinates to your backend to sort by distance
            },
            (error) => {
                console.error('Geolocation error:', error);
                // Fall back to another sorting method
                sortBy.value = 'newest';
                fetchProducts();
            }
        );
    }
});

// These would be implemented with your actual API calls
function addToWishlist(productId) {
    console.log('Adding to wishlist:', productId);
    // Implement API call to add to wishlist
    alert('Added to wishlist!');
}

function addToCart(productId) {
    console.log('Adding to cart:', productId);
    // Implement API call to add to cart
    alert('Added to cart!');
}