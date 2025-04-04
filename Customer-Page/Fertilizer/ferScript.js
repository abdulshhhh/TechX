// Simple animation for filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // In a real app, you would filter the fertilizer cards here
    });
});

// Simple search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.fertilizer-card').forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const subtitle = card.querySelector('.card-subtitle').textContent.toLowerCase();
        const details = card.querySelector('.card-details').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || subtitle.includes(searchTerm) || details.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Buy button animation
document.querySelectorAll('.buy-btn').forEach(button => {
    button.addEventListener('click', () => {
        button.innerHTML = 'Added to Cart <i class="fas fa-check"></i>';
        button.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
            button.innerHTML = 'Buy Now <i class="fas fa-shopping-cart"></i>';
            button.style.backgroundColor = 'var(--primary)';
        }, 2000);
    });
});