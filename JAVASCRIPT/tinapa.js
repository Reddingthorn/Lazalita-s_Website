let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let checkoutBtn = document.querySelector('.CheckOut');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts = [];
let carts = [];

/* SAVE CART */
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};

/* LOAD CART */
const loadCart = () => {
    let savedCart = localStorage.getItem('cart');
    if (savedCart) {
        carts = JSON.parse(savedCart);
        addCartToHTML();
    }
};

/* OPEN AND CLOSE CART */
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

/* CHECKOUT */
checkoutBtn.addEventListener('click', () => {
    if (carts.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // save cart & products for checkout page
    localStorage.setItem('cart', JSON.stringify(carts));
    localStorage.setItem('products', JSON.stringify(listProducts));

    // go to checkout page
    window.location.href = 'checkout.html';
});

/* RENDER PRODUCTS */
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    listProducts.forEach(product => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('item');
        newProduct.dataset.id = product.id;

        newProduct.innerHTML = `
            <img src="/${product.image}">
            <h2>${product.name}</h2>
            <div class="price">₱${product.price}</div>
            <button class="addCart">Add To Cart</button>
        `;

        listProductHTML.appendChild(newProduct);
    });
};

/* ADD TO CART CLICK */
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        let product_id = event.target.closest('.item').dataset.id;
        addToCart(product_id);
    }
});

/* ADD TO CART FUNCTION */
const addToCart = (product_id) => {
    let position = carts.findIndex(item => item.product_id == product_id);

    if (position === -1) {
        carts.push({ product_id, quantity: 1 });
    } else {
        carts[position].quantity++;
    }

    saveCart();
    addCartToHTML();
};

/* REMOVE FROM CART */
const removeFromCart = (product_id) => {
    carts = carts.filter(item => item.product_id != product_id);
    saveCart();
    addCartToHTML();
};

/* PLUS MINUS REMOVE */
listCartHTML.addEventListener('click', (event) => {
    let target = event.target;
    let cartItem = target.closest('.item');
    if (!cartItem) return;

    let product_id = cartItem.dataset.id;
    let position = carts.findIndex(item => item.product_id == product_id);

    if (target.classList.contains('plus')) {
        carts[position].quantity++;
    }

    if (target.classList.contains('minus')) {
        carts[position].quantity--;
        if (carts[position].quantity <= 0) {
            removeFromCart(product_id);
            return;
        }
    }

    if (target.classList.contains('remove')) {
        removeFromCart(product_id);
        return;
    }

    saveCart();
    addCartToHTML();
});

/* RENDER CART */
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    carts.forEach(cart => {
        let product = listProducts.find(p => p.id == cart.product_id);
        if (!product) return;

        totalQuantity += cart.quantity;

        let newCart = document.createElement('div');
        newCart.classList.add('item');
        newCart.dataset.id = cart.product_id;

        newCart.innerHTML = `
            <div class="image">
                <img src="/${product.image}">
            </div>
            <div class="name">${product.name}</div>
            <div class="totalPrice">₱${product.price * cart.quantity}</div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${cart.quantity}</span>
                <span class="plus">+</span>
            </div>
            <button class="remove">❌</button>
        `;

        listCartHTML.appendChild(newCart);
    });

    iconCartSpan.innerText = totalQuantity;
};

/* INIT APP */
const initApp = () => {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();
            loadCart();
        })
        .catch(err => console.error(err));
};

initApp();

