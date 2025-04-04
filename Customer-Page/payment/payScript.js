document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');
    const productImageElement = document.getElementById('product-image');
    const unitElement = document.getElementById('unit');
    const quantityInput = document.getElementById('quantity');
    const totalSpan = document.getElementById('total');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const paymentButton = document.getElementById('rzp-button1');

    
    // Get product details from sessionStorage
    const productName = sessionStorage.getItem('productName');
    const productPrice = sessionStorage.getItem('productPrice');
    const productUnit = sessionStorage.getItem('productUnit');
    const productImage = sessionStorage.getItem('productImage');

    // Display product details
    
    productNameElement.textContent = productName;
    productPriceElement.textContent = `₹${productPrice}/${productUnit}`;
    productImageElement.src = productImage;
    unitElement.textContent = productUnit;

    // Calculate total amount
    function calculateTotal() {
        const quantity = parseInt(quantityInput.value);
        const total = quantity * parseInt(productPrice);
        totalSpan.textContent = `₹${total}`;
        return total;
    }

    // Plus button functionality
    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
        calculateTotal();
    });

    // Minus button functionality
    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > parseInt(quantityInput.min)) {
            quantityInput.value = value - 1;
            calculateTotal();
        }
    });

    // Input validation
    quantityInput.addEventListener('keydown', function(e) {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Update total when quantity changes
    quantityInput.addEventListener('input', calculateTotal);

    // Initialize with first calculation
    calculateTotal();

    // Razorpay integration
    paymentButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const totalAmount = calculateTotal();
        
        const options = {
            "key": "rzp_test_JC0iBpddI1hl5V",
            "amount": totalAmount * 100,
            "currency": "INR",
            "name": "Organic Farm",
            "description": `Payment for ${productName}`,
            "image": "https://example.com/your_logo.jpg",
            "prefill": {
                "email": "samrajk2005@gmail.com",
                "contact": "7550001912"
            },
            "handler": function(response) {
                alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                // Redirect to thank you page
                window.location.href = '../thank-you.html';
            },
            "modal": {
                "ondismiss": function() {
                    if(confirm("Are you sure you want to cancel the payment?")) {
                        console.log("Payment cancelled by user");
                    }
                }
            }
        };
        
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });
});