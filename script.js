document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuIcon = document.querySelector('.menu-icon');
    const menuItems = document.getElementById('MenuItems');
    
    menuIcon.addEventListener('click', function() {
        menuItems.classList.toggle('active');
    });
    
    // Search Toggle
    const searchBtn = document.getElementById('search-btn');
    const searchBox = document.querySelector('.search-box');
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        searchBox.classList.toggle('active');
    });
    
    // Cart Toggle
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    // Login Modal Toggle
    const userBtn = document.getElementById('user-btn');
    const loginModal = document.querySelector('.login-modal');
    const closeLogin = document.querySelector('.close-login');
    
    userBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('active');
    });
    
    closeLogin.addEventListener('click', function() {
        loginModal.classList.remove('active');
    });
    
    // Shopping Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total span');
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // Update cart total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="decrement">-</button>
                        <input type="text" value="${item.quantity}" class="quantity-input">
                        <button class="increment">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add event listeners for quantity buttons
            const decrementBtn = cartItemElement.querySelector('.decrement');
            const incrementBtn = cartItemElement.querySelector('.increment');
            const quantityInput = cartItemElement.querySelector('.quantity-input');
            const removeBtn = cartItemElement.querySelector('.remove-item');
            
            decrementBtn.addEventListener('click', function() {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantityInput.value = item.quantity;
                    saveCart();
                    updateCartCount();
                    updateCartTotal();
                }
            });
            
            incrementBtn.addEventListener('click', function() {
                item.quantity++;
                quantityInput.value = item.quantity;
                saveCart();
                updateCartCount();
                updateCartTotal();
            });
            
            quantityInput.addEventListener('change', function() {
                const newQuantity = parseInt(this.value);
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    item.quantity = newQuantity;
                    saveCart();
                    updateCartCount();
                    updateCartTotal();
                } else {
                    this.value = item.quantity;
                }
            });
            
            removeBtn.addEventListener('click', function() {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                saveCart();
                renderCartItems();
                updateCartCount();
                updateCartTotal();
            });
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const image = this.getAttribute('data-image');
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            saveCart();
            updateCartCount();
            
            // Show cart sidebar
            renderCartItems();
            updateCartTotal();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            
            // Add animation to button
            this.textContent = 'Added!';
            this.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#ff523b';
            }, 1000);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Proceeding to checkout! In a real app, this would redirect to a checkout page.');
        // In a real app, you would redirect to a checkout page
        // window.location.href = '/checkout';
    });
    
    // Initialize cart
    updateCartCount();
    renderCartItems();
    updateCartTotal();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (menuItems.classList.contains('active')) {
                    menuItems.classList.remove('active');
                }
            }
        });
    });
    
    // Register link in login modal
    const registerLink = document.querySelector('.register-link');
    
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Registration form would appear here in a real app.');
    });
});
