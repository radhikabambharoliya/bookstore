// In-memory storage for cart and orders (will reset when page refreshes)
let cart = [];
let orders = [];
let bookIdCounter = 1;

// Books will be stored in localStorage to persist across page reloads
let books = [];

// Initialize with some sample books and load from localStorage
function initializeSampleBooks() {
    // Try to load books from localStorage first
    const savedBooks = localStorage.getItem('bookstore_books');
    const savedCounter = localStorage.getItem('bookstore_counter');
    
    if (savedBooks) {
        books = JSON.parse(savedBooks);
        bookIdCounter = savedCounter ? parseInt(savedCounter) : books.length + 1;
    } else {
        // If no saved books, initialize with sample books
        const sampleBooks = [
            {
                id: bookIdCounter++,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                price: 12.99,
                category: "FICTION",
                description: "A classic American novel set in the Jazz Age."
            },
            {
                id: bookIdCounter++,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                price: 14.99,
                category: "FICTION",
                description: "A gripping tale of racial injustice and childhood innocence."
            },
            {
                id: bookIdCounter++,
                title: "1984",
                author: "George Orwell",
                price: 13.99,
                category: "FICTION",
                description: "A dystopian social science fiction novel."
            },
            {
                id: bookIdCounter++,
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                price: 11.99,
                category: "FICTION",
                description: "A controversial novel about teenage rebellion."
            },
            {
                id: bookIdCounter++,
                title: "A Brief History of Time",
                author: "Stephen Hawking",
                price: 16.99,
                category: "SCIENCE",
                description: "A landmark volume in science writing."
            },
            {
                id: bookIdCounter++,
                title: "Steve Jobs",
                author: "Walter Isaacson",
                price: 18.99,
                category: "BIOGRAPHY",
                description: "The exclusive biography of Apple's co-founder."
            }
        ];
        
        books = [...sampleBooks];
        saveBooksToStorage();
    }
}

// Save books to localStorage
function saveBooksToStorage() {
    localStorage.setItem('bookstore_books', JSON.stringify(books));
    localStorage.setItem('bookstore_counter', bookIdCounter.toString());
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleBooks();
    
    // Check if we're on admin page or user page
    if (document.getElementById('add-book-form')) {
        initializeAdminPage();
    } else {
        initializeUserPage();
    }
});

// User Page Functions
function initializeUserPage() {
    loadBooks();
    updateCartUI();
    
    // Search functionality
    const searchInput = document.getElementById('search-books');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm)
            );
            displayBooks(filteredBooks);
        });
    }
}

function loadBooks() {
    displayBooks(books);
}

function displayBooks(booksToDisplay) {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;
    
    booksGrid.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
        booksGrid.innerHTML = '<div class="col-span-full text-center py-8"><p class="text-gray-500 text-lg">No books found</p></div>';
        return;
    }
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow';
        bookCard.innerHTML = `
            <div class="p-6">
                <div class="text-4xl mb-4 text-center">📖</div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">${book.title}</h3>
                <p class="text-gray-600 mb-2">by ${book.author}</p>
                <p class="text-sm text-indigo-600 mb-2">${book.category}</p>
                <p class="text-gray-700 text-sm mb-4">${book.description || 'No description available'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-green-600">$${book.price}</span>
                    <button onclick="addToCart(${book.id})" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        booksGrid.appendChild(bookCard);
    });
}

// Cart Functions
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const existingItem = cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Book added to cart!');
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCartUI();
}

function updateQuantity(bookId, change) {
    const item = cart.find(item => item.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalCheckout = document.getElementById('cart-total-checkout');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartBadge) cartBadge.textContent = totalItems;
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = totalPrice.toFixed(2);
    if (cartTotalCheckout) cartTotalCheckout.textContent = `$${totalPrice.toFixed(2)}`;
    
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'bg-gray-50 rounded-lg p-4';
            cartItem.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-gray-800">${item.title}</h4>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">×</button>
                </div>
                <p class="text-sm text-gray-600 mb-2">by ${item.author}</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <button onclick="updateQuantity(${item.id}, -1)" class="bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm">-</button>
                        <span class="font-medium">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="bg-gray-300 hover:bg-gray-400 w-6 h-6 rounded text-sm">+</button>
                    </div>
                    <span class="font-bold text-green-600">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
        }
    }
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    
    if (cartElement && overlay) {
        cartElement.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    }
}

// Checkout Functions
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function payment() {
    const name = document.getElementById('uname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('add').value;
    
    if (!name || !email || !address) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }
    
    // Create order
    const order = {
        id: Date.now(),
        customerName: name,
        email: email,
        address: address,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString()
    };
    
    orders.push(order);
    
    // Clear cart
    cart = [];
    updateCartUI();
    
    // Close modals
    closeCheckout();
    toggleCart();
    
    // Reset form
    document.getElementById('checkout-form').reset();
    
    showNotification('Order placed successfully! Thank you for your purchase!', 'success');
}

// Admin Page Functions
function initializeAdminPage() {
    loadAdminBooks();
    
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addBook();
        });
    }
}

function addBook() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const price = parseFloat(document.getElementById('book-price').value);
    const category = document.getElementById('book-category').value;
    const description = document.getElementById('book-description').value.trim();
    
    if (!title || !author || !price || !category) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    if (price <= 0) {
        showNotification('Price must be greater than 0!', 'error');
        return;
    }
    
    const newBook = {
        id: bookIdCounter++,
        title,
        author,
        price,
        category,
        description
    };
    
    books.push(newBook);
    saveBooksToStorage(); // Save to localStorage
    loadAdminBooks();
    
    // Reset form
    document.getElementById('add-book-form').reset();
    
    showNotification('Book added successfully!', 'success');
}

function deleteBook(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(book => book.id !== bookId);
        saveBooksToStorage(); // Save to localStorage
        loadAdminBooks();
        showNotification('Book deleted successfully!', 'success');
    }
}

function loadAdminBooks() {
    const adminBooksList = document.getElementById('admin-books-list');
    if (!adminBooksList) return;
    
    adminBooksList.innerHTML = '';
    
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'bg-gray-50 rounded-lg p-4 border';
        bookItem.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800">${book.title}</h4>
                    <p class="text-sm text-gray-600">by ${book.author}</p>
                    <p class="text-sm text-indigo-600">${book.category}</p>
                    <p class="text-lg font-semibold text-green-600">$${book.price}</p>
                    ${book.description ? `<p class="text-xs text-gray-500 mt-1">${book.description}</p>` : ''}
                </div>
                <button onclick="deleteBook(${book.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm">
                    Delete
                </button>
            </div>
        `;
        adminBooksList.appendChild(bookItem);
    });
    
    if (books.length === 0) {
        adminBooksList.innerHTML = '<p class="text-gray-500 text-center">No books available</p>';
    }
}

// Utility function to clear all data (for testing purposes)
function clearAllData() {
    if (confirm('Are you sure you want to clear all books? This will remove all books including sample books.')) {
        localStorage.removeItem('bookstore_books');
        localStorage.removeItem('bookstore_counter');
        books = [];
        bookIdCounter = 1;
        cart = [];
        orders = [];
        
        if (document.getElementById('admin-books-list')) {
            loadAdminBooks();
        } else {
            loadBooks();
        }
        updateCartUI();
        showNotification('All data cleared successfully!', 'success');
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform translate-x-full`;
    notification.className += type === 'success' ? ' bg-green-500' : ' bg-red-500';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cart = document.getElementById('cart');
    const cartToggle = document.getElementById('cart-toggle');
    
    if (cart && !cart.classList.contains('hidden') && 
        !cart.contains(e.target) && 
        !cartToggle.contains(e.target)) {
        toggleCart();
    }
});

// Add keyboard shortcuts for admin (optional)
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + C to clear all data (admin only)
    if (e.ctrlKey && e.shiftKey && e.key === 'C' && document.getElementById('add-book-form')) {
        e.preventDefault();
        clearAllData();
    }
});


// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
}

// Process order based on payment method
function processOrder() {
    const name = document.getElementById('uname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('add').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // Validate form
    if (!name || !email || !phone || !address) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address!', 'error');
        return;
    }

    if (!validatePhone(phone)) {
        showNotification('Please enter a valid phone number!', 'error');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    if (paymentMethod === 'online') {
        // Use existing Razorpay payment function
        startPayment();
    } else {
        // Process COD order
        processCODOrder({
            name,
            email,
            phone,
            address,
            paymentMethod,
            items: [...cart],
            total: calculateTotal()
        });
    }
}

// Process COD Order
function processCODOrder(orderData) {
    const orderId = generateOrderId();
    
    // Prepare order data for backend
    const orderPayload = {
        orderId: orderId,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        paymentMethod: 'COD',
        items: orderData.items,
        amount: orderData.total,
        paymentStatus: 'COD - Pending',
        orderStatus: 'Confirmed'
    };

    // Send COD order to backend
    $.ajax({
        url: "/home/save_cod_order",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(orderPayload),
        success: function(response) {
            console.log("COD Order saved:", response);
            
            // Show success message
            showOrderSuccessPopup(orderPayload);
            
            // Clear cart and close checkout
            clearCartAndCloseCheckout();
        },
        error: function(error) {
            console.log("Error saving COD order:", error);
            showNotification('Failed to place order. Please try again!', 'error');
        }
    });
}

// Show order success popup
function showOrderSuccessPopup(order) {
    // Create and show success modal
    const successModal = document.createElement('div');
    successModal.id = 'order-success-modal';
    successModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-60';
    successModal.innerHTML = `
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-lg max-w-md w-full p-6 fade-in text-center">
                <div class="text-green-500 text-6xl mb-4">✅</div>
                <h3 class="text-xl font-bold mb-4">Order Placed Successfully!</h3>
                <div class="text-left bg-gray-50 p-4 rounded-lg mb-4">
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Total Amount:</strong> $${order.amount.toFixed(2)}</p>
                    <p><strong>Items:</strong> ${order.items.length} book(s)</p>
                    <p><strong>Status:</strong> ${order.orderStatus}</p>
                </div>
                <p class="text-gray-600 mb-6">Thank you for your purchase! You will receive a confirmation email shortly.</p>
                <button onclick="closeOrderSuccess()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
}

// Close order success modal
function closeOrderSuccess() {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Clear cart and close checkout
function clearCartAndCloseCheckout() {
    cart = [];
    updateCartUI();
    closeCheckout();
    toggleCart();
    
    // Reset form
    document.getElementById('checkout-form').reset();
    
    // Reset payment method to online
    document.querySelector('input[name="payment-method"][value="online"]').checked = true;
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Update your existing checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Update checkout total
        const checkoutTotal = document.getElementById('cart-total-checkout');
        if (checkoutTotal) {
            checkoutTotal.textContent = `$${calculateTotal().toFixed(2)}`;
        }
    }
}

// Update your existing Razorpay payment function to include phone
const startPayment = () => {
    let amount = document.querySelector("#cart-total-checkout").textContent;
    console.log("Payment started " + amount);
    
    // Get form data including phone
    const orderData = {
        name: document.querySelector('#uname').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        address: document.querySelector('#add').value,
        paymentMethod: 'online',
        items: [...cart],
        total: calculateTotal()
    };
    
    // Create order via AJAX
    $.ajax({
        url: "/home/create_order",
        data: JSON.stringify({amount: amount, info: "order_request"}), 
        contentType: "application/json",   
        type: "POST",
        dataType: "json",
        success: function(response) {
            console.log("Order created:", response);
            if(response.status == "created") {
                let option = {
                    key: "rzp_test_R9T8RmakvWjomW",
                    amount: response.amount,
                    currency: "INR",
                    name: "BookStore Purchase",
                    description: "Book Purchase",
                    order_id: response.id,
                    handler: function(response) {
                        console.log(response.razorpay_payment_id);
                        console.log(response.razorpay_order_id);
                        console.log(response.razorpay_signature);
                        
                        // Save payment to backend
                        $.ajax({
                            url: "/home/save_payment",
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                name: orderData.name,
                                email: orderData.email,
                                phone: orderData.phone,
                                address: orderData.address,
                                amount: option.amount / 100,
                                items: orderData.items
                            }),
                            success: function (res) {
                                console.log("Payment saved:", res);
                                
                                // Show success popup instead of redirect
                                showOrderSuccessPopup({
                                    orderId: response.razorpay_order_id,
                                    name: orderData.name,
                                    email: orderData.email,
                                    phone: orderData.phone,
                                    address: orderData.address,
                                    paymentMethod: 'Online Payment',
                                    items: orderData.items,
                                    amount: orderData.total,
                                    paymentStatus: 'Paid',
                                    orderStatus: 'Confirmed'
                                });
                                
                                // Clear cart and close checkout
                                clearCartAndCloseCheckout();
                            },
                            error: function (err) {
                                console.log("Error saving payment", err);
                                showNotification('Payment successful but failed to save order details!', 'error');
                            }
                        });
                    }, 
                    prefill: { 
                        name: orderData.name, 
                        email: orderData.email, 
                        contact: orderData.phone 
                    }, 
                    notes: { 
                        address: orderData.address,
                    }, 
                    theme: { 
                        color: "#3399cc",
                    },
                };
                
                let rzp = new Razorpay(option); 
                rzp.on('payment.failed', function (response){ 
                    console.log(response.error);
                    showNotification('Payment failed! Please try again.', 'error');
                }); 
                rzp.open();
            }
        },
        error: function(error) {
            showNotification('Something went wrong! Please try again.', 'error');
            console.log(error);
        }
    });
}
 