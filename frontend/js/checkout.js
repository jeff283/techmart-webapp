let taxRate = 0.05;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the checkout page
    if (window.location.pathname.includes('checkout.html')) {
        renderOrderSummary();

        // Add a submit event listener to the form
        const checkoutForm = document.querySelector('form');
        checkoutForm.addEventListener('submit', handleFormSubmit);
    }
});

// Get cart data from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('techmart-cart')) || [];
}

// Render the order summary
function renderOrderSummary() {
    const cartItems = getCartItems();
    const orderSummary = document.getElementById('order-summary');
    let subtotal = 0;
    let tax = 0;
    let total = 0;

    // Clear the order summary
    orderSummary.innerHTML = '';

    // Loop through the cart items and calculate totals
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;

        const itemRow = document.createElement('div');
        itemRow.classList.add('flex', 'justify-between', 'mb-2');
        itemRow.innerHTML = `
            <span>${item.name} <span class="font-bold">x ${item.quantity}</span></span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;

        orderSummary.appendChild(itemRow);
    });

    // Calculate tax and total
    tax = subtotal * taxRate;
    total = subtotal + tax;

    const taxRow = document.createElement('div');
    taxRow.classList.add('flex', 'justify-between', 'mb-2');
    taxRow.innerHTML = `
        <span>Tax (5%)</span>
        <span>$${tax.toFixed(2)}</span>
    `;
    orderSummary.appendChild(taxRow);

    const totalRow = document.createElement('div');
    totalRow.classList.add('flex', 'justify-between', 'font-bold', 'text-lg');
    totalRow.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
    `;
    orderSummary.appendChild(totalRow);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading animation
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    try {
        // Get form data
        const fullName = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zip = document.getElementById('zip').value;

        // Get order summary details
        const cartItems = getCartItems();
        let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let tax = subtotal * taxRate;
        let total = subtotal + tax;

        // Create the JSON object for submission
        const orderDetails = {
            customer: {
                fullName,
                email,
                address,
                city,
                zip
            },
            items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price.toFixed(2),
                total: (item.price * item.quantity).toFixed(2)
            })),
            summary: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            }
        };

        // Submit order to the server using POST
        const response = await fetch(`${baseUrl}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            throw new Error('Failed to place the order. Please try again.');
        }

        // Show success notification and clear form
        showNotification("Order placed successfully!", "success");
        event.target.reset();
        localStorage.removeItem('techmart-cart');
        renderOrderSummary(); // Clear order summary

    } catch (error) {
        showNotification(error.message, "error");
        console.error("Order submission error:", error);
    } finally {
        // Hide loading animation
        submitButton.disabled = false;
        submitButton.textContent = "Complete Purchase";
    }
}
