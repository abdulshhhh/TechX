
        // Toggle chat window
        const chatBtn = document.querySelector('.chat-btn');
        const chatWindow = document.querySelector('.chat-window');
        const closeChat = document.querySelector('.close-chat');
        
        chatBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
        
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
        
        // Category scroll arrows
        const scrollLeft = document.querySelector('.scroll-arrow.left');
        const scrollRight = document.querySelector('.scroll-arrow.right');
        const categories = document.querySelector('.categories');
        
        scrollLeft.addEventListener('click', () => {
            categories.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        scrollRight.addEventListener('click', () => {
            categories.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navIcons = document.querySelector('.nav-icons');
        
        mobileMenuBtn.addEventListener('click', () => {
            navIcons.style.display = navIcons.style.display === 'flex' ? 'none' : 'flex';
        });
        
        // Responsive adjustments
        function handleResize() {
            if (window.innerWidth > 768) {
                navIcons.style.display = 'flex';
            } else {
                navIcons.style.display = 'none';
            }
        }
        function switchLanguage() {
            window.location.href = "Tamil.html"; // Redirect to English page
        }
        function switchLanguage2() {
            window.location.href = "English.html"; // Redirect to English page
        }
        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Get product details from data attributes
                const productName = this.getAttribute('data-name');
                const productPrice = this.getAttribute('data-price');
                const productUnit = this.getAttribute('data-unit');
                const productImage = this.getAttribute('data-image');
                
                // Store in sessionStorage to pass to pay.html
                sessionStorage.setItem('productName', productName);
                sessionStorage.setItem('productPrice', productPrice);
                sessionStorage.setItem('productUnit', productUnit);
                sessionStorage.setItem('productImage', productImage);
                
                // Redirect to payment page
                window.location.href = '/payment/pay.html';
            });
        });

        // Seasonal Insights Infinite Scroll
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.insights-track');
    const cards = document.querySelectorAll('.insight-card');
    
    // Only clone cards if there are cards to clone
    if (cards.length > 0) {
        // Clone cards for infinite scroll effect
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
        
        // Reset animation when it completes to prevent jumping
        track.addEventListener('animationiteration', () => {
            // Remove the animation temporarily
            track.style.animation = 'none';
            
            // Trigger reflow
            void track.offsetWidth;
            
            // Re-add the animation
            track.style.animation = 'scroll 30s linear infinite';
        });
    }
    
    // Pause/play on hover for better UX
    const container = document.querySelector('.insights-scroll-container');
    container.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    
    container.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
});
// Nearby Farmers Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const nearbyBtn = document.querySelector('.nearby-btn');
    const nearbyModal = document.getElementById('nearbyModal');
    const nearbyClose = document.querySelector('.nearby-close');
    const allowLocationBtn = document.getElementById('allowLocation');
    const nearbyFarmersList = document.getElementById('nearbyFarmersList');
    const locationPermission = document.querySelector('.location-permission');
    const locationError = document.querySelector('.location-error');
    const loadingSpinner = document.createElement('div');
    
    // Create loading spinner element
    loadingSpinner.className = 'loading-spinner';
    loadingSpinner.innerHTML = `
        <div class="spinner"></div>
        <p>Finding farmers near you...</p>
    `;
    nearbyModal.querySelector('.nearby-modal-body').appendChild(loadingSpinner);
    
    // Mock farmer data - in a real app, this would come from your backend
    const mockFarmers = [
        {
            id: 1,
            name: "Farmer Ramesh",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            distance: 2.5,
            products: ["Tomatoes", "Brinjal", "Okra"],
            rating: 4.8
        },
        {
            id: 2,
            name: "Farmer Lakshmi",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            distance: 3.2,
            products: ["Bananas", "Coconuts", "Mangoes"],
            rating: 4.7
        },
        {
            id: 3,
            name: "Farmer Murugan",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            distance: 5.1,
            products: ["Carrots", "Beans", "Pumpkin"],
            rating: 4.9
        },
        {
            id: 4,
            name: "Farmer Geetha",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg",
            distance: 7.3,
            products: ["Okra", "Ladies Finger", "Bitter Gourd"],
            rating: 4.6
        }
    ];
    
    // Open modal when nearby button is clicked
    nearbyBtn.addEventListener('click', function() {
        nearbyModal.style.display = 'block';
        locationPermission.style.display = 'block';
        nearbyFarmersList.style.display = 'none';
        locationError.style.display = 'none';
        loadingSpinner.style.display = 'none';
    });
    
    // Close modal when X is clicked
    nearbyClose.addEventListener('click', function() {
        nearbyModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === nearbyModal) {
            nearbyModal.style.display = 'none';
        }
    });
    
    // Handle location permission
    allowLocationBtn.addEventListener('click', function() {
        locationPermission.style.display = 'none';
        loadingSpinner.style.display = 'block';
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // Success - show nearby farmers
                        loadingSpinner.style.display = 'none';
                        displayNearbyFarmers(position.coords.latitude, position.coords.longitude);
                    },
                    function(error) {
                        // Error - show error message
                        loadingSpinner.style.display = 'none';
                        locationError.style.display = 'block';
                        console.error("Error getting location:", error);
                    }
                );
            } else {
                // Geolocation not supported
                loadingSpinner.style.display = 'none';
                locationError.style.display = 'block';
                console.error("Geolocation is not supported by this browser.");
            }
        }, 1500); // Simulate network delay
    });
    
    // Display nearby farmers (in a real app, this would use actual distance calculations)
    function displayNearbyFarmers(lat, lng) {
        nearbyFarmersList.style.display = 'block';
        nearbyFarmersList.innerHTML = '';
        
        // Sort farmers by distance (mock data already has distances)
        const sortedFarmers = [...mockFarmers].sort((a, b) => a.distance - b.distance);
        
        sortedFarmers.forEach(farmer => {
            const farmerItem = document.createElement('div');
            farmerItem.className = 'farmer-item';
            
            farmerItem.innerHTML = `
                <img src="${farmer.avatar}" alt="${farmer.name}" class="farmer-avatar">
                <div class="farmer-details">
                    <div class="farmer-name">${farmer.name} • ${farmer.rating}★</div>
                    <div class="farmer-distance">${farmer.distance} km away</div>
                    <div class="farmer-products">
                        ${farmer.products.map(product => 
                            `<span class="farmer-product-tag">${product}</span>`
                        ).join('')}
                    </div>
                </div>
                <button class="view-farmer-btn" data-id="${farmer.id}">View</button>
            `;
            
            nearbyFarmersList.appendChild(farmerItem);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-farmer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const farmerId = this.getAttribute('data-id');
                // In a real app, this would redirect to the farmer's page
                alert(`Viewing farmer with ID: ${farmerId}`);
            });
        });
    }
});
        window.addEventListener('resize', handleResize);
