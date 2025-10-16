// CONTACT //
// Валидация формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value; 
            const message = document.getElementById('message').value;
            
            // Простая валидация
            if (name.length < 2) {
                alert('Name must contain at least 2 characters');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Валидация номера телефона
            if (phone && !validatePhone(phone)) {
                alert('Please enter a valid phone number (e.g., +7-xxx-xxx-xx-xx or 8-xxx-xxx-xx-xx)');
                return;
            }
            
            if (message.length < 10) {
                alert('Message must contain at least 10 characters');
                return;
            }
            
            
            alert('Thank you! Your message has been sent. We will contact you soon.');
            form.reset();
        });
    }
});

// Функция для проверки email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция для проверки номера телефона
function validatePhone(phone) {
    
    const cleanedPhone = phone.replace(/[\s\(\)\-]/g, '');
    
    // Проверяем разные форматы:
    // +7XXXXXXXXXX, 8XXXXXXXXXX, 7XXXXXXXXXX
    const phoneRegex = /^(\+7|8|7)?\d{10}$/;
    
    return phoneRegex.test(cleanedPhone);
}

// CART //

// Функции для корзины
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    alert(`✅ ${name} added to cart!`);
}

// Обновить счетчик
function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        cartLink.innerHTML = totalItems > 0 ? `Cart 🛒 (${totalItems})` : 'Cart 🛒';
    }
}

// Показать корзину
function displayCart() {
    let container = document.getElementById('cartItemsContainer');
    if (!container) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">Your cart is empty</p>';
        updateSummary(cart);
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        let total = item.price * item.quantity;
        html += `
            <div class="cart-item border-bottom pb-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-6">
                        <h5>${item.name}</h5>
                        <p>${item.price} KZT × ${item.quantity}</p>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-sm btn-outline-success" onclick="changeQty('${item.name}', -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-success" onclick="changeQty('${item.name}', 1)">+</button>
                    </div>
                    <div class="col-2">
                        <button class="btn btn-danger btn-sm" onclick="removeItem('${item.name}')">×</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateSummary(cart);
}

// Обновить итоги
function updateSummary(cart) {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let delivery = 1000;
    let final = total + delivery;
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Обновляем по ID
    document.getElementById('productsText').textContent = `Products (${count}):`;
    document.getElementById('productsTotal').textContent = `${total.toLocaleString()} KZT`;
    document.getElementById('deliveryCost').textContent = `${delivery.toLocaleString()} KZT`;
    document.getElementById('totalCost').textContent = `${final.toLocaleString()} KZT`;
}

// Изменить количество
function changeQty(name, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCounter();
    }
}

// Удалить товар
function removeItem(name) {
    if (confirm(`Remove ${name}?`)) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.name !== name);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCounter();
    }
}

// Оформить заказ
function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    document.getElementById('checkoutForm').style.display = 'block';
}

// Отмена заказа
function cancelOrder() {
    document.getElementById('checkoutForm').style.display = 'none';
}

// Валидация формы
document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById('orderForm');
    updateCartCounter();
    displayCart();
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let name = document.getElementById('fullName').value;
            let phone = document.getElementById('phone').value;
            
            if (name.length < 2 || phone.length < 10) {
                alert('Please fill all fields correctly');
                return;
            }
            
            alert('🎉 Order confirmed! Thank you!');
            localStorage.removeItem('cart');
            updateCartCounter();
            displayCart();
            cancelOrder();
        });
    }
});

// Смена цвета фона
function changeBackgroundColor() {
    let colors = ['#fff', '#f8f9fa', '#e9ecef', '#d1e7dd'];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}

// Время в футере
function updateDateTime() {
    let element = document.getElementById('currentDateTime');
    if (element) {
        element.textContent = 'Current time: ' + new Date().toLocaleString();
    }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 60000);
});



// Task 3: Popup Subscription Form
document.addEventListener('DOMContentLoaded', function() {
    const subscriptionForm = document.getElementById('subscriptionForm');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('subscriberName').value.trim();
            const email = document.getElementById('subscriberEmail').value.trim();
            
            // Валидация имени
            if (name.length < 2) {
                alert('Please enter your name (at least 2 characters)');
                return;
            }
            
            // Валидация email
            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            
            alert(`Thank you ${name}! You've successfully subscribed to our newsletter.`);
            subscriptionForm.reset();
            
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('subscriptionModal'));
            if (modal) {
                modal.hide();
            }
        });
    }
});

// Функция для проверки email 
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Task 4: Background Color Changer
function changeBackgroundColor() {
    const colors = ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#d1e7dd', '#ffe6e6', '#e6f3ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}

// Task 5: Current Date/Time Display
function updateDateTime() {
    const now = new Date();
    
    // Форматируем дату и время
    const date = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
    
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateTimeString = `${date} ${time}`;
    
    // Добавляем в footer
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = 'Current time: ' + dateTimeString;
    }
}

// Обновляем время при загрузке и каждую секунду
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000); // Обновлять каждую секунду
});
//  PRODUCT SEARCH 

// Функция поиска товаров
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    let foundResults = false;

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        const productDescription = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Показываем сообщение если нет результато
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = foundResults ? 'none' : 'block';
    }
}

// Очистка поиска
function clearSearch() {
    document.getElementById('searchInput').value = '';
    searchProducts(); 
}
