// Enhanced Farm-to-Consumer Platform - Hackathon Edition

// Rich farmer database with detailed information
const farmers = [
    { 
      id: 1,
      name: "Farmer Jack's Organic Farm", 
      lat: 12.9716, 
      lon: 77.5946,
      products: ["Tomatoes", "Carrots", "Lettuce"],
      rating: 4.8,
      deliveryDays: ["Monday", "Thursday"],
      organic: true,
      image: "farmer1.jpg",
      description: "Family-owned farm with 15 years of organic farming experience"
    },
    { 
      id: 2,
      name: "Green Valley Produce", 
      lat: 12.9260, 
      lon: 77.6762,
      products: ["Potatoes", "Onions", "Herbs"],
      rating: 4.5,
      deliveryDays: ["Tuesday", "Friday"],
      organic: false,
      image: "farmer2.jpg",
      description: "Specializing in root vegetables and fresh herbs"
    },
    { 
      id: 3,
      name: "Sunrise Organic Dairy", 
      lat: 12.8452, 
      lon: 77.6511,
      products: ["Milk", "Cheese", "Yogurt"],
      rating: 4.9,
      deliveryDays: ["Wednesday", "Saturday"],
      organic: true,
      image: "farmer3.jpg",
      description: "Award-winning dairy products from grass-fed cows"
    },
    { 
      id: 4,
      name: "Fresh Greens Co-op", 
      lat: 12.9100, 
      lon: 77.5800,
      products: ["Spinach", "Kale", "Arugula"],
      rating: 4.7,
      deliveryDays: ["Monday", "Wednesday", "Friday"],
      organic: true,
      image: "farmer4.jpg",
      description: "Cooperative of small-scale farmers growing leafy greens"
    },
    { 
      id: 5,
      name: "Spice Garden", 
      lat: 12.8800, 
      lon: 77.6300,
      products: ["Turmeric", "Ginger", "Chili"],
      rating: 4.6,
      deliveryDays: ["Tuesday", "Saturday"],
      organic: true,
      image: "farmer5.jpg",
      description: "Exotic spices grown using traditional methods"
    }
  ];
  
  // Multiple delivery zones with different characteristics
  const deliveryZones = [
    {
      id: 1,
      name: "Central Zone",
      latMin: 12.9000,
      latMax: 13.0000,
      lonMin: 77.5500,
      lonMax: 77.6500,
      deliveryFee: 0, // Free delivery
      minOrder: 200,
      maxDeliveryTime: "1 hour"
    },
    {
      id: 2,
      name: "North Zone",
      latMin: 13.0000,
      latMax: 13.1000,
      lonMin: 77.5000,
      lonMax: 77.7000,
      deliveryFee: 50,
      minOrder: 300,
      maxDeliveryTime: "2 hours"
    },
    {
      id: 3,
      name: "South Zone",
      latMin: 12.8000,
      latMax: 12.9000,
      lonMin: 77.5000,
      lonMax: 77.7000,
      deliveryFee: 75,
      minOrder: 350,
      maxDeliveryTime: "2.5 hours"
    }
  ];
  
  // Get user's location with enhanced error handling and loading indicators
  function getUserLocation() {
    // Show loading indicator
    document.getElementById("location-status").innerHTML = 
      '<div class="spinner"></div> Getting your location...';
    
    if (navigator.geolocation) {
      // Use high accuracy and set timeout values
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        options
      );
    } else {
      document.getElementById("location-status").innerHTML = 
        '<span class="error">❌ Geolocation is not supported by this browser.</span>';
      
      // Fall back to IP-based location
      getLocationFromIP();
    }
  }
  
  // Handle successful location retrieval
  function handleLocationSuccess(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    document.getElementById("location-status").innerHTML = 
      `<span class="success">✅ Location found (accuracy: ${accuracy.toFixed(2)}m)</span>`;
    
    // Save user location data
    saveUserLocation(userLat, userLon);
    
    // Update UI with location information
    document.getElementById("user-coordinates").innerHTML = 
      `<strong>Your coordinates:</strong> ${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;
    
    // Show on Map
    showUserOnMap(userLat, userLon);
    
    // Check delivery availability
    const deliveryZone = checkDeliveryZone(userLat, userLon);
    displayDeliveryInformation(deliveryZone);
    
    // Find nearby farmers
    findNearbyFarmers(userLat, userLon);
    
    // Show recommendations based on location
    showRecommendations(userLat, userLon);
  }
  
  // Handle location errors with helpful messages
  function handleLocationError(error) {
    let errorMessage = "";
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied. Please enable location services.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable. Trying alternative method...";
        getLocationFromIP();
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Trying alternative method...";
        getLocationFromIP();
        break;
      default:
        errorMessage = `Unknown error occurred: ${error.message}`;
    }
    
    document.getElementById("location-status").innerHTML = 
      `<span class="error">❌ ${errorMessage}</span>`;
    
    // Show manual location entry form
    document.getElementById("manual-location-entry").style.display = "block";
  }
  
  // Fallback: Get approximate location from IP address using a third-party service
  function getLocationFromIP() {
    document.getElementById("location-status").innerHTML += 
      '<div class="spinner"></div> Getting approximate location from IP...';
    
    // This would be implemented with an actual API call
    // For hackathon demo purposes, we'll simulate a response
    setTimeout(() => {
      // Simulated response - would come from API in real implementation
      const approximateLocation = {
        lat: 12.9716,
        lon: 77.5946,
        city: "Bangalore",
        accuracy: "City level"
      };
      
      document.getElementById("location-status").innerHTML = 
        `<span class="warning">⚠️ Using approximate location (${approximateLocation.city})</span>`;
      
      showUserOnMap(approximateLocation.lat, approximateLocation.lon);
      findNearbyFarmers(approximateLocation.lat, approximateLocation.lon);
      
      const deliveryZone = checkDeliveryZone(approximateLocation.lat, approximateLocation.lon);
      displayDeliveryInformation(deliveryZone);
    }, 1000);
  }
  
  // Allow users to manually enter their location
  function setupManualLocationForm() {
    document.getElementById("manual-location-form").addEventListener("submit", function(e) {
      e.preventDefault();
      
      const lat = parseFloat(document.getElementById("manual-lat").value);
      const lon = parseFloat(document.getElementById("manual-lon").value);
      
      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        alert("Please enter valid coordinates (latitude: -90 to 90, longitude: -180 to 180)");
        return;
      }
      
      document.getElementById("location-status").innerHTML = 
        '<span class="info">ℹ️ Using manually entered location</span>';
      
      showUserOnMap(lat, lon);
      findNearbyFarmers(lat, lon);
      
      const deliveryZone = checkDeliveryZone(lat, lon);
      displayDeliveryInformation(deliveryZone);
    });
  }
  
  // Initialize map with Leaflet.js
  let map, userMarker, farmerMarkers = [];
  
  function initMap() {
    // Create map centered on Bangalore
    map = L.map('map').setView([12.9716, 77.5946], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add delivery zone overlays
    addDeliveryZoneOverlays();
  }
  
  // Show user location on map
  function showUserOnMap(lat, lon) {
    // If map not initialized, do it now
    if (!map) {
      initMap();
    }
    
    // Remove existing user marker if present
    if (userMarker) {
      map.removeLayer(userMarker);
    }
    
    // Create custom user marker with pulsing effect
    userMarker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: 'user-location-marker',
        html: '<div class="pulse"></div><div class="marker-icon">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(map);
    
    userMarker.bindPopup("<strong>Your Location</strong><br>Click to see options").openPopup();
    
    // Center map on user location
    map.setView([lat, lon], 13);
    
    // Save for later use
    userLocation = {lat, lon};
  }
  
  // Add delivery zone overlays to the map
  function addDeliveryZoneOverlays() {
    deliveryZones.forEach(zone => {
      // Create rectangle for the zone
      const bounds = [
        [zone.latMin, zone.lonMin],
        [zone.latMax, zone.lonMax]
      ];
      
      // Color based on delivery fee
      let color;
      if (zone.deliveryFee === 0) {
        color = 'green';
      } else if (zone.deliveryFee <= 50) {
        color = 'yellow';
      } else {
        color = 'orange';
      }
      
      const rectangle = L.rectangle(bounds, {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.2
      }).addTo(map);
      
      rectangle.bindPopup(`
        <strong>${zone.name}</strong><br>
        Delivery Fee: ₹${zone.deliveryFee}<br>
        Min Order: ₹${zone.minOrder}<br>
        Delivery Time: ${zone.maxDeliveryTime}
      `);
    });
  }
  
  // Find nearby farmers using an efficient algorithm
  function findNearbyFarmers(userLat, userLon) {
    // Remove existing markers
    if (farmerMarkers.length > 0) {
      farmerMarkers.forEach(marker => map.removeLayer(marker));
      farmerMarkers = [];
    }
    
    // Calculate distance for all farmers
    const farmersWithDistance = farmers.map(farmer => {
      const distance = getDistance(userLat, userLon, farmer.lat, farmer.lon);
      return {...farmer, distance};
    });
    
    // Sort by distance
    farmersWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Add markers for nearby farmers (all in this demo)
    farmersWithDistance.forEach(farmer => {
      const marker = L.marker([farmer.lat, farmer.lon], {
        icon: L.divIcon({
          className: 'farmer-marker',
          html: `<div class="marker-icon ${farmer.organic ? 'organic' : ''}">🚜</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })
      }).addTo(map);
      
      marker.bindPopup(`
        <strong>${farmer.name}</strong><br>
        Distance: ${farmer.distance.toFixed(2)} km<br>
        Rating: ${'⭐'.repeat(Math.round(farmer.rating))}<br>
        <button onclick="showFarmerDetails(${farmer.id})">View Details</button>
      `);
      
      farmerMarkers.push(marker);
    });
    
    // Display list of farmers
    displayFarmers(farmersWithDistance);
    
    // Update heatmap
    updateDistanceHeatmap(farmersWithDistance);
    
    return farmersWithDistance;
  }
  
  // Haversine formula to calculate distance with optimization
  function getDistance(lat1, lon1, lat2, lon2) {
    // Use cached results if available
    const cacheKey = `${lat1.toFixed(4)}-${lon1.toFixed(4)}-${lat2.toFixed(4)}-${lon2.toFixed(4)}`;
    
    if (window.distanceCache && window.distanceCache[cacheKey]) {
      return window.distanceCache[cacheKey];
    }
    
    // Initialize cache if not exists
    if (!window.distanceCache) {
      window.distanceCache = {};
    }
    
    // Earth's radius in km
    const R = 6371;
    
    // Convert to radians
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    // Pre-calculate these values for performance
    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    
    // Calculate haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    // Cache the result
    window.distanceCache[cacheKey] = distance;
    
    return distance;
  }
  
  // Display farmers in list view with enhanced UI
  function displayFarmers(nearbyFarmers) {
    const farmerList = document.getElementById("farmer-list");
    farmerList.innerHTML = ""; // Clear previous results
    
    if (nearbyFarmers.length === 0) {
      farmerList.innerHTML = `
        <div class="no-results">
          <img src="sad-vegetable.svg" alt="No results" class="no-results-icon">
          <p>No farmers found in your area.</p>
          <button onclick="expandSearchRadius()">Expand Search Area</button>
        </div>
      `;
      return;
    }
    
    // Create a search/filter input
    const filterDiv = document.createElement("div");
    filterDiv.className = "filter-controls";
    filterDiv.innerHTML = `
      <input type="text" id="farmer-search" placeholder="Search by name or products..." class="search-input">
      <div class="filter-buttons">
        <button onclick="filterFarmers('all')" class="filter-btn active">All</button>
        <button onclick="filterFarmers('organic')" class="filter-btn">Organic</button>
        <button onclick="sortFarmers('distance')" class="sort-btn">Distance ↓</button>
        <button onclick="sortFarmers('rating')" class="sort-btn">Rating ↓</button>
      </div>
    `;
    farmerList.appendChild(filterDiv);
    
    // Set up event listener for search
    setTimeout(() => {
      const searchInput = document.getElementById("farmer-search");
      searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        
        document.querySelectorAll('.farmer-card').forEach(card => {
          const farmerName = card.querySelector('.farmer-name').textContent.toLowerCase();
          const farmerProducts = card.querySelector('.farmer-products').textContent.toLowerCase();
          
          if (farmerName.includes(searchTerm) || farmerProducts.includes(searchTerm)) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    }, 100);
    
    // Create list container
    const listContainer = document.createElement("div");
    listContainer.className = "farmer-list-container";
    
    // Add each farmer as a card
    nearbyFarmers.forEach(farmer => {
      const card = document.createElement("div");
      card.className = `farmer-card ${farmer.organic ? 'organic-farmer' : ''}`;
      card.dataset.id = farmer.id;
      card.dataset.distance = farmer.distance;
      card.dataset.rating = farmer.rating;
      
      // Format the delivery days
      const deliveryDays = farmer.deliveryDays.join(", ");
      
      card.innerHTML = `
        <div class="farmer-image">
          <img src="${farmer.image}" alt="${farmer.name}" onerror="this.src='default-farmer.jpg'">
          ${farmer.organic ? '<span class="organic-badge">Organic</span>' : ''}
        </div>
        <div class="farmer-details">
          <h3 class="farmer-name">${farmer.name}</h3>
          <div class="farmer-rating">${'⭐'.repeat(Math.round(farmer.rating))}</div>
          <p class="farmer-distance"><strong>${farmer.distance.toFixed(1)} km</strong> from your location</p>
          <p class="farmer-products">Products: ${farmer.products.join(", ")}</p>
          <p>Delivery days: ${deliveryDays}</p>
          <div class="farmer-actions">
            <button onclick="showFarmerDetails(${farmer.id})">View Details</button>
            <button onclick="startOrder(${farmer.id})" class="primary-btn">Order Now</button>
          </div>
        </div>
      `;
      
      listContainer.appendChild(card);
    });
    
    farmerList.appendChild(listContainer);
    
    // Add pagination if more than 5 farmers
    if (nearbyFarmers.length > 5) {
      addPagination(listContainer, 5);
    }
  }
  
  // Add pagination to the farmer list
  function addPagination(container, itemsPerPage) {
    const items = container.querySelectorAll('.farmer-card');
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    // Hide all items except first page
    for (let i = itemsPerPage; i < items.length; i++) {
      items[i].style.display = 'none';
    }
    
    // Create pagination controls
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.className = i === 1 ? 'active' : '';
      
      pageBtn.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.pagination button').forEach(btn => {
          btn.className = '';
        });
        this.className = 'active';
        
        // Show appropriate items
        const startIdx = (i - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        
        items.forEach((item, idx) => {
          item.style.display = (idx >= startIdx && idx < endIdx) ? 'flex' : 'none';
        });
      });
      
      paginationDiv.appendChild(pageBtn);
    }
    
    container.parentNode.appendChild(paginationDiv);
  }
  
  // Filter farmers by criteria
  function filterFarmers(criteria) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const cards = document.querySelectorAll('.farmer-card');
    
    cards.forEach(card => {
      if (criteria === 'all') {
        card.style.display = 'flex';
      } else if (criteria === 'organic') {
        card.style.display = card.classList.contains('organic-farmer') ? 'flex' : 'none';
      }
    });
  }
  
  // Sort farmers by criteria
  function sortFarmers(criteria) {
    const container = document.querySelector('.farmer-list-container');
    const cards = Array.from(container.querySelectorAll('.farmer-card'));
    
    cards.sort((a, b) => {
      if (criteria === 'distance') {
        return parseFloat(a.dataset.distance) - parseFloat(b.dataset.distance);
      } else if (criteria === 'rating') {
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      }
    });
    
    // Update DOM
    cards.forEach(card => {
      container.appendChild(card);
    });
  }
  
  // Check if user is in a delivery zone
  function checkDeliveryZone(userLat, userLon) {
    for (const zone of deliveryZones) {
      if (userLat >= zone.latMin && userLat <= zone.latMax &&
          userLon >= zone.lonMin && userLon <= zone.lonMax) {
        return zone;
      }
    }
    return null;
  }
  
  // Display delivery information
  function displayDeliveryInformation(zone) {
    const deliveryInfoDiv = document.getElementById("delivery-info");
    
    if (!zone) {
      deliveryInfoDiv.innerHTML = `
        <div class="delivery-unavailable">
          <h3>❌ No Delivery Available</h3>
          <p>Sorry, we don't currently deliver to your location.</p>
          <button onclick="showNearestPickupPoints()">Show Pickup Points</button>
        </div>
      `;
    } else {
      deliveryInfoDiv.innerHTML = `
        <div class="delivery-available">
          <h3>✅ Delivery Available in ${zone.name}!</h3>
          <div class="delivery-details">
            <div class="detail-item">
              <span class="detail-icon">🚚</span>
              <span class="detail-text">Delivery Fee: ₹${zone.deliveryFee}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🛒</span>
              <span class="detail-text">Min Order: ₹${zone.minOrder}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⏱️</span>
              <span class="detail-text">Est. Delivery: ${zone.maxDeliveryTime}</span>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  // Show farmer details in a modal
  function showFarmerDetails(farmerId) {
    const farmer = farmers.find(f => f.id === farmerId);
    
    if (!farmer) return;
    
    // Calculate distance if we have user location
    let distanceText = '';
    if (userLocation) {
      const distance = getDistance(
        userLocation.lat, 
        userLocation.lon, 
        farmer.lat, 
        farmer.lon
      );
      distanceText = `<p><strong>Distance:</strong> ${distance.toFixed(2)} km</p>`;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button" onclick="closeModal()">&times;</span>
        <div class="farmer-detail-view">
          <div class="farmer-header">
            <img src="${farmer.image}" alt="${farmer.name}" class="farmer-detail-image">
            <div>
              <h2>${farmer.name}</h2>
              <div class="rating">${'⭐'.repeat(Math.round(farmer.rating))}</div>
              ${distanceText}
              ${farmer.organic ? '<span class="organic-badge large">Organic Certified</span>' : ''}
            </div>
          </div>
          
          <div class="farmer-description">
            <p>${farmer.description}</p>
          </div>
          
          <div class="farmer-products-section">
            <h3>Available Products</h3>
            <div class="product-grid">
              ${farmer.products.map(product => `
                <div class="product-card">
                  <span class="product-icon">🌱</span>
                  <span class="product-name">${product}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="delivery-info">
            <h3>Delivery Information</h3>
            <p>Delivery days: ${farmer.deliveryDays.join(', ')}</p>
          </div>
          
          <div class="action-buttons">
            <button onclick="viewOnMap(${farmer.lat}, ${farmer.lon})">View on Map</button>
            <button class="primary-btn" onclick="startOrder(${farmer.id})">Order Now</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }
  
  // Close modal
  function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('show');
    
    // Remove after animation completes
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }
  
  // View farmer location on map
  function viewOnMap(lat, lon) {
    // Close the modal
    closeModal();
    
    // Center map and zoom to location
    map.setView([lat, lon], 15);
    
    // Find and open the corresponding marker popup
    farmerMarkers.forEach(marker => {
      const markerLat = marker.getLatLng().lat;
      const markerLng = marker.getLatLng().lng;
      
      if (Math.abs(markerLat - lat) < 0.0001 && Math.abs(markerLng - lon) < 0.0001) {
        marker.openPopup();
      }
    });
  }
  
  // Start order process
  function startOrder(farmerId) {
    const farmer = farmers.find(f => f.id === farmerId);
    
    if (!farmer) return;
    
    // Check if delivery is available
    if (!userLocation) {
      alert("Please share your location first to check delivery availability.");
      return;
    }
    
    const deliveryZone = checkDeliveryZone(userLocation.lat, userLocation.lon);
    
    if (!deliveryZone) {
      alert("Sorry, delivery is not available at your location. Please check pickup options.");
      showNearestPickupPoints();
      return;
    }
    
    // Create order form modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content order-form">
        <span class="close-button" onclick="closeModal()">&times;</span>
        <h2>Order from ${farmer.name}</h2>
        
        <div class="order-details">
          <p>Delivery Fee: ₹${deliveryZone.deliveryFee}</p>
          <p>Minimum Order: ₹${deliveryZone.minOrder}</p>
          <p>Estimated Delivery Time: ${deliveryZone.maxDeliveryTime}</p>
        </div>
        
        <form id="order-form">
          <h3>Available Products</h3>
          <div class="product-selection">
            ${farmer.products.map(product => `
              <div class="product-item">
                <label>
                  <input type="checkbox" name="product" value="${product}">
                  ${product}
                </label>
                <div class="quantity-control">
                  <button type="button" onclick="decrementQuantity(this)">-</button>
                  <input type="number" min="0" value="0" class="quantity">
                  <button type="button" onclick="incrementQuantity(this)">+</button>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="delivery-preferences">
            <h3>Delivery Preferences</h3>
            <div class="form-group">
              <label for="delivery-date">Delivery Date:</label>
              <select id="delivery-date">
                ${getNextDeliveryDates(farmer.deliveryDays, 3).map(date => 
                  `<option value="${date.value}">${date.label}</option>`
                ).join('')}
              </select>
            </div>
            
            <div class="form-group">
              <label for="delivery-time">Preferred Time:</label>
              <select id="delivery-time">
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                <option value="evening">Evening (4pm - 8pm)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="notes">Special Instructions:</label>
              <textarea id="notes" rows="3" placeholder="Any special instructions for delivery"></textarea>
            </div>
          </div>
          
          <div class="contact-info">
            <h3>Contact Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name:</label>
                <input type="text" id="name" required>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number:</label>
                <input type="tel" id="phone" required>
              </div>
            </div>
            <div class="form-group">
              <label for="address">Delivery Address:</label>
              <textarea id="address" rows="3" required></textarea>
            </div>
          </div>
          
          <div class="order-summary">
            <h3>Order Summary</h3>
            <div id="order-items">No items selected</div>
            <div class="total">
              <span>Total:</span>
              <span id="total-amount">₹0</span>
            </div>
           <div class="form-actions">
          <button type="button" onclick="closeModal()">Cancel</button>
          <button type="submit" class="primary-btn">Place Order</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Set up event listeners for the order form
  setupOrderForm(farmer, deliveryZone);
}

// Set up order form functionality
function setupOrderForm(farmer, deliveryZone) {
  const form = document.getElementById('order-form');
  const orderItemsDiv = document.getElementById('order-items');
  const totalAmountDiv = document.getElementById('total-amount');
  
  // Update order summary when products are selected
  form.addEventListener('change', function() {
    updateOrderSummary(farmer, deliveryZone);
  });
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitOrder(farmer, deliveryZone);
  });
}

// Update the order summary section
function updateOrderSummary(farmer, deliveryZone) {
  const form = document.getElementById('order-form');
  const orderItemsDiv = document.getElementById('order-items');
  const totalAmountDiv = document.getElementById('total-amount');
  
  const checkboxes = form.querySelectorAll('input[name="product"]:checked');
  let itemsHtml = '';
  let subtotal = 0;
  
  if (checkboxes.length === 0) {
    orderItemsDiv.innerHTML = 'No items selected';
    totalAmountDiv.textContent = '₹0';
    return;
  }
  
  checkboxes.forEach(checkbox => {
    const productName = checkbox.value;
    const quantityInput = checkbox.closest('.product-item').querySelector('.quantity');
    const quantity = parseInt(quantityInput.value);
    
    if (quantity > 0) {
      // In a real app, we would get prices from the farmer data
      const price = getProductPrice(productName); // Assume this function exists
      const itemTotal = price * quantity;
      subtotal += itemTotal;
      
      itemsHtml += `
        <div class="order-item">
          <span>${productName} (${quantity} kg)</span>
          <span>₹${itemTotal}</span>
        </div>
      `;
    }
  });
  
  if (itemsHtml === '') {
    orderItemsDiv.innerHTML = 'No items selected';
    totalAmountDiv.textContent = '₹0';
    return;
  }
  
  orderItemsDiv.innerHTML = itemsHtml;
  
  // Calculate total including delivery fee
  const total = subtotal >= deliveryZone.minOrder ? subtotal + deliveryZone.deliveryFee : subtotal;
  
  totalAmountDiv.textContent = `₹${total}`;
  
  // Show warning if minimum order not met
  if (subtotal < deliveryZone.minOrder) {
    orderItemsDiv.innerHTML += `
      <div class="warning-message">
        Minimum order of ₹${deliveryZone.minOrder} not met (add ₹${deliveryZone.minOrder - subtotal} more)
      </div>
    `;
  }
}

// Submit the order
function submitOrder(farmer, deliveryZone) {
  const form = document.getElementById('order-form');
  const name = form.querySelector('#name').value;
  const phone = form.querySelector('#phone').value;
  const address = form.querySelector('#address').value;
  const deliveryDate = form.querySelector('#delivery-date').value;
  const deliveryTime = form.querySelector('#delivery-time').value;
  const notes = form.querySelector('#notes').value;
  
  // Get selected products and quantities
  const products = [];
  form.querySelectorAll('input[name="product"]:checked').forEach(checkbox => {
    const productName = checkbox.value;
    const quantity = parseInt(checkbox.closest('.product-item').querySelector('.quantity').value);
    
    if (quantity > 0) {
      products.push({
        name: productName,
        quantity: quantity,
        price: getProductPrice(productName) // Assume this function exists
      });
    }
  });
  
  // Validate minimum order
  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  if (subtotal < deliveryZone.minOrder) {
    alert(`Minimum order amount is ₹${deliveryZone.minOrder}. Please add more items.`);
    return;
  }
  
  // Create order object
  const order = {
    farmerId: farmer.id,
    farmerName: farmer.name,
    customerName: name,
    customerPhone: phone,
    deliveryAddress: address,
    deliveryDate: deliveryDate,
    deliveryTime: deliveryTime,
    notes: notes,
    products: products,
    subtotal: subtotal,
    deliveryFee: deliveryZone.deliveryFee,
    total: subtotal + deliveryZone.deliveryFee,
    orderDate: new Date().toISOString(),
    status: 'pending'
  };
  
  // In a real app, this would be an API call
  console.log('Submitting order:', order);
  
  // Show confirmation
  showOrderConfirmation(order);
}

// Show order confirmation
function showOrderConfirmation(order) {
  closeModal(); // Close the order form
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content confirmation">
      <div class="confirmation-icon">🎉</div>
      <h2>Order Placed Successfully!</h2>
      
      <div class="order-details">
        <p><strong>Order #:</strong> ${Math.floor(Math.random() * 1000000)}</p>
        <p><strong>Farmer:</strong> ${order.farmerName}</p>
        <p><strong>Delivery Date:</strong> ${order.deliveryDate}</p>
        <p><strong>Delivery Time:</strong> ${order.deliveryTime}</p>
        <p><strong>Total Amount:</strong> ₹${order.total}</p>
      </div>
      
      <div class="confirmation-actions">
        <button onclick="closeModal()" class="primary-btn">Done</button>
        <button onclick="viewOrderDetails()">View Order Details</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Save order to local storage
  saveOrderToHistory(order);
}

// Helper function to get next available delivery dates
function getNextDeliveryDates(deliveryDays, count) {
  const dates = [];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let date = new Date();
  
  while (dates.length < count) {
    date.setDate(date.getDate() + 1);
    const dayName = daysOfWeek[date.getDay()];
    
    if (deliveryDays.includes(dayName)) {
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      dates.push({
        value: date.toISOString().split('T')[0],
        label: formattedDate
      });
    }
  }
  
  return dates;
}

// Helper function to increment quantity
function incrementQuantity(button) {
  const input = button.previousElementSibling;
  input.value = parseInt(input.value) + 1;
  input.dispatchEvent(new Event('change'));
}

// Helper function to decrement quantity
function decrementQuantity(button) {
  const input = button.nextElementSibling;
  if (parseInt(input.value) > 0) {
    input.value = parseInt(input.value) - 1;
    input.dispatchEvent(new Event('change'));
  }
}

// Save order to local storage
function saveOrderToHistory(order) {
  let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  orders.push(order);
  localStorage.setItem('orderHistory', JSON.stringify(orders));
}

// Show nearest pickup points
function showNearestPickupPoints() {
  if (!userLocation) return;
  
  const pickupPoints = [
    { name: "Central Market", lat: 12.9750, lon: 77.6000, distance: 1.2 },
    { name: "Northside Collection", lat: 12.9900, lon: 77.5800, distance: 2.5 },
    { name: "Southside Collection", lat: 12.9500, lon: 77.6200, distance: 3.1 }
  ];
  
  // Calculate distances
  pickupPoints.forEach(point => {
    point.distance = getDistance(userLocation.lat, userLocation.lon, point.lat, point.lon);
  });
  
  // Sort by distance
  pickupPoints.sort((a, b) => a.distance - b.distance);
  
  // Show in modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button" onclick="closeModal()">&times;</span>
      <h2>Nearest Pickup Points</h2>
      
      <div class="pickup-points-list">
        ${pickupPoints.map(point => `
          <div class="pickup-point">
            <h3>${point.name}</h3>
            <p>Distance: ${point.distance.toFixed(1)} km</p>
            <button onclick="showPickupOnMap(${point.lat}, ${point.lon})">View on Map</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Show pickup point on map
function showPickupOnMap(lat, lon) {
  closeModal();
  
  // Center map on pickup point
  map.setView([lat, lon], 15);
  
  // Add temporary marker
  const marker = L.marker([lat, lon], {
    icon: L.divIcon({
      className: 'pickup-marker',
      html: '<div class="marker-icon">📍</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map);
  
  marker.bindPopup("<strong>Pickup Point</strong><br>Available 8am-8pm daily").openPopup();
  
  // Remove after 30 seconds
  setTimeout(() => {
    map.removeLayer(marker);
  }, 30000);
}

// Show recommendations based on location
function showRecommendations(lat, lon) {
  // In a real app, this would be more sophisticated
  const season = getCurrentSeason();
  const recommendations = {
    summer: ["Watermelon", "Cucumber", "Tomatoes"],
    winter: ["Carrots", "Spinach", "Potatoes"],
    monsoon: ["Ginger", "Turmeric", "Leafy Greens"]
  };
  
  const recDiv = document.getElementById('recommendations');
  recDiv.innerHTML = `
    <h3>Seasonal Recommendations (${season})</h3>
    <div class="recommendation-items">
      ${recommendations[season].map(item => `
        <div class="recommendation-item">
          <span class="emoji">${getProductEmoji(item)}</span>
          <span>${item}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Helper function to get current season
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  return 'winter';
}

// Helper function to get product emoji
function getProductEmoji(product) {
  const emojiMap = {
    "Tomatoes": "🍅",
    "Carrots": "🥕",
    "Lettuce": "🥬",
    "Potatoes": "🥔",
    "Onions": "🧅",
    "Herbs": "🌿",
    "Milk": "🥛",
    "Cheese": "🧀",
    "Yogurt": "🥄",
    "Spinach": "🍃",
    "Kale": "🥬",
    "Arugula": "🌱",
    "Turmeric": "🟨",
    "Ginger": "🟫",
    "Chili": "🌶️",
    "Watermelon": "🍉",
    "Cucumber": "🥒"
  };
  
  return emojiMap[product] || "🌱";
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize map
  initMap();
  
  // Set up manual location form
  setupManualLocationForm();
  
  // Set up event listeners
  document.getElementById('get-location-btn').addEventListener('click', getUserLocation);
  
  // Show welcome message
  document.getElementById('welcome-message').innerHTML = `
    <h2>Fresh Farm Produce Delivered to Your Doorstep</h2>
    <p>Connect directly with local farmers for the freshest produce available</p>
    <button id="get-started-btn" class="primary-btn">Get Started</button>
  `;
  
  document.getElementById('get-started-btn').addEventListener('click', function() {
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('location-prompt').style.display = 'block';
  });
});

// Save user location to localStorage
function saveUserLocation(lat, lon) {
  localStorage.setItem('userLocation', JSON.stringify({ lat, lon }));
}

// Load user location from localStorage
function loadUserLocation() {
  const location = JSON.parse(localStorage.getItem('userLocation'));
  if (location) {
    showUserOnMap(location.lat, location.lon);
    findNearbyFarmers(location.lat, location.lon);
    return location;
  }
  return null;
}

// Try to load saved location when page loads
window.addEventListener('load', function() {
  const savedLocation = loadUserLocation();
  if (savedLocation) {
    document.getElementById('location-status').innerHTML = 
      '<span class="success">✅ Using your saved location</span>';
    document.getElementById('user-coordinates').innerHTML = 
      `<strong>Your coordinates:</strong> ${savedLocation.lat.toFixed(4)}, ${savedLocation.lon.toFixed(4)}`;
  }
});

// Update distance heatmap visualization
function updateDistanceHeatmap(farmersWithDistance) {
  // In a real app, this would create a heatmap visualization
  // For this demo, we'll just log the distances
  console.log('Farmers by distance:', farmersWithDistance.map(f => ({
    name: f.name,
    distance: f.distance.toFixed(2) + ' km'
  })));
}

// Expand search radius
function expandSearchRadius() {
  if (!userLocation) return;
  
  // In a real app, this would call findNearbyFarmers with a larger radius
  alert("Expanding search radius to 10km");
  findNearbyFarmers(userLocation.lat, userLocation.lon);
}

// View order details
function viewOrderDetails() {
  // In a real app, this would show order details
  alert("Showing order details");
  closeModal();
}

// Simulated function to get product price
function getProductPrice(product) {
  // In a real app, this would come from the farmer's data
  const prices = {
    "Tomatoes": 40,
    "Carrots": 30,
    "Lettuce": 25,
    "Potatoes": 20,
    "Onions": 35,
    "Herbs": 15,
    "Milk": 50,
    "Cheese": 120,
    "Yogurt": 40,
    "Spinach": 20,
    "Kale": 30,
    "Arugula": 35,
    "Turmeric": 60,
    "Ginger": 50,
    "Chili": 40,
    "Watermelon": 25,
    "Cucumber": 20
  };
  
  return prices[product] || 30;
}