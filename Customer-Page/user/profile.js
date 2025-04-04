document.addEventListener('DOMContentLoaded', function() {
    // Horizontal scrolling for orders
    const ordersScroll = document.querySelector('.orders-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    
    if (ordersScroll) {
        scrollLeftBtn.addEventListener('click', () => {
            ordersScroll.scrollBy({ left: -400, behavior: 'smooth' });
        });
        
        scrollRightBtn.addEventListener('click', () => {
            ordersScroll.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }
    
    // Horizontal scrolling for products
    const productsScroll = document.querySelector('.items-scroll');
    const productsScrollContainer = document.querySelector('.items-scroll-container');
    
    if (productsScroll) {
        // Add scroll buttons for products (you would duplicate the buttons in HTML)
        // Similar functionality as above
    }
    
    // Buy Again button functionality
    const buyAgainButtons = document.querySelectorAll('.buy-again');
    
    buyAgainButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1500);
                
                // In a real app, this would add items to cart
                alert('Items from this order have been added to your cart');
            }, 1000);
        });
    });
    
    // Action links
    const actionLinks = document.querySelectorAll('.action-link');
    actionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real app, this would perform the action
            console.log('Action clicked:', link.textContent);
        });
    });
    
    // Simulate loading
    setTimeout(() => {
        document.querySelectorAll('.order-card, .product-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 100);
});