document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
            }
        });
    });

    // Product data
    const products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 99.99,
            description: 'High-quality wireless headphones with noise cancellation.',
            category: 'electronics',
            image: 'hea.jpeg'
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            description: 'Feature-rich smartwatch with health monitoring.',
            category: 'electronics',
            image: 'smar.jpeg'
        },
        {
            id: 3,
            name: 'Cotton T-Shirt',
            price: 24.99,
            description: 'Comfortable cotton t-shirt available in multiple colors.',
            category: 'clothing',
            image: 'co.jpeg'
        },
        {
            id: 4,
            name: 'Denim Jeans',
            price: 59.99,
            description: 'Classic fit denim jeans for everyday wear.',
            category: 'clothing',
            image: 'de.jpeg'
        },
        {
            id: 5,
            name: 'Ceramic Plant Pot',
            price: 34.99,
            description: 'Beautiful ceramic pot for your indoor plants.',
            category: 'home',
            image: 'p.jpeg'
        },
        {
            id: 6,
            name: 'Wooden Coffee Table',
            price: 149.99,
            description: 'Solid wooden coffee table for your living room.',
            category: 'home',
            image: 'c.jpeg'
        },
        {
            id: 7,
            name: 'Leather Wallet',
            price: 45.99,
            description: 'Genuine leather wallet with multiple card slots.',
            category: 'accessories',
            image: 'w.jpeg'
        },
        {
            id: 8,
            name: 'Sunglasses',
            price: 89.99,
            description: 'UV protection sunglasses with polarized lenses.',
            category: 'accessories',
            image: 's.jpeg'
        }
    ];

    // Display products
    const productGrid = document.getElementById('productGrid');
    
    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="400">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-desc">${product.description}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
    
    // Initial display of all products
    displayProducts(products);
    
    // Category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active state
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === category);
                displayProducts(filteredProducts);
            }
        });
    });
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartIcon = document.getElementById('cartIcon');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Toggle cart sidebar
    function toggleCart() {
        cartOverlay.classList.toggle('active');
        cartSidebar.classList.toggle('active');
    }
    
    cartIcon.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" width="100" height="100">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${product.name}</h4>
                    <p class="cart-item-price">$${product.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${product.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${product.id}">+</button>
                        <button class="remove-item" data-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, -1);
            });
        });
        
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                updateQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
    
    // Add to cart
    function addToCart(id) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, quantity: 1 });
        }
        
        saveCart();
        updateCartCount();
        showAddToCartMessage(id);
    }
    
    // Update quantity
    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
            
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
    
    // Remove from cart
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartDisplay();
        updateCartCount();
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Show add to cart message
    function showAddToCartMessage(id) {
        const product = products.find(p => p.id === id);
        const message = document.createElement('div');
        message.className = 'add-to-cart-message';
        message.innerHTML = `
            <span>${product.name} added to cart!</span>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }
    
    // Add event listeners to add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        }
    });
    
    // Initialize cart
    updateCartCount();
    updateCartDisplay();
    
    // Form validation
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');
        
        let isValid = true;
        
        // Validate name
        if (name.value.trim() === '') {
            nameError.textContent = 'Name is required';
            nameError.style.display = 'block';
            isValid = false;
        } else {
            nameError.style.display = 'none';
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            emailError.textContent = 'Email is required';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            emailError.textContent = 'Please enter a valid email';
            emailError.style.display = 'block';
            isValid = false;
        } else {
            emailError.style.display = 'none';
        }
        
        // Validate message
        if (message.value.trim() === '') {
            messageError.textContent = 'Message is required';
            messageError.style.display = 'block';
            isValid = false;
        } else {
            messageError.style.display = 'none';
        }
        
        // If form is valid, submit it (in a real app, you would send to server)
        if (isValid) {
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section in navigation
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});