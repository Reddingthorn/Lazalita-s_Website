let checkoutCartHTML = document.querySelector('.checkoutCart');
let checkoutTotalHTML = document.getElementById('checkoutTotal');
let placeOrderBtn = document.getElementById('placeOrder');

let carts = JSON.parse(localStorage.getItem('cart')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];

const renderCheckout = () => {
    checkoutCartHTML.innerHTML = '';
    let total = 0;

    carts.forEach(cart => {
        let product = products.find(p => p.id == cart.product_id);
        if (!product) return;

        let itemTotal = product.price * cart.quantity;
        total += itemTotal;

        checkoutCartHTML.innerHTML += `
            <div class="checkout-item">
                <p>${product.name} × ${cart.quantity}</p>
                <p>₱${itemTotal}</p>
            </div>
        `;
    });

    checkoutTotalHTML.innerText = total;
};

placeOrderBtn.addEventListener('click', () => {
    let name = document.getElementById('name').value;
    let address = document.getElementById('address').value;
    let phone = document.getElementById('phone').value;

    if (!name || !address || !phone) {
        alert('Please fill up all fields');
        return;
    }

    alert('Order placed successfully!');

    localStorage.removeItem('cart');
    window.location.href = 'index.html';
});

renderCheckout();
