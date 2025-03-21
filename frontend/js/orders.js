
document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();
});

// Fetch orders from the API
async function fetchOrders() {
    try {
        const response = await fetch(`${baseUrl}/api/orders`);
        if (!response.ok) {
            throw new Error("Failed to fetch orders. Please try again.");
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        showNotification("Error fetching orders. Please try again.", "error");
    }
}

// Display orders in the orders list
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear any existing orders

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="text-gray-600">No orders found.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('border-b', 'pb-4');

        // Order Header - Order Number & Status
        const orderHeader = document.createElement('div');
        orderHeader.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
        orderHeader.innerHTML = `
            <span class="text-gray-700 font-semibold">Order #${order._id}</span>
            <span class="${getStatusClass(order.status)} font-semibold">${order.status}</span>
        `;
        orderElement.appendChild(orderHeader);

        // Order Items
        order.items.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.classList.add('flex', 'justify-between');
            itemRow.innerHTML = `
                <p class="text-gray-600">${item.name} x ${item.quantity}</p>
                <p class="font-semibold">$${item.total}</p>
            `;
            orderElement.appendChild(itemRow);
        });

        // Order Summary & Timestamp
        const orderFooter = document.createElement('div');
        orderFooter.classList.add('text-gray-500', 'text-sm', 'mt-2');

        // const orderDate = new Date(order.createdAt).toLocaleDateString();
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        orderFooter.innerHTML = `
            <div>Subtotal: $${order.summary.subtotal}</div>
            <div>Tax: $${order.summary.tax}</div>
            <div>Total: <span class="font-semibold">$${order.summary.total}</span></div>
            <div>Ordered on ${orderDate}</div>
        `;
        orderElement.appendChild(orderFooter);

        ordersList.appendChild(orderElement);
    });
}

// Helper function to get status class based on the order status
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'text-green-600';
        case 'shipped':
            return 'text-yellow-500';
        case 'processing':
            return 'text-blue-600';
        case 'pending':
            return 'text-gray-500';
        default:
            return 'text-gray-500';
    }
}
