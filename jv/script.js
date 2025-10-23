// CONTACT //
// Асинхронная отправка формы с Callback функциями
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

            // Показываем загрузку
            showFormLoading(true);
            
            // Данные формы
            const formData = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                timestamp: new Date().toISOString()
            };

            // Callback функция при успешной отправке
            function onSuccess(response) {
                console.log("✅ Форма отправлена:", response);
                showFormLoading(false);
                showSuccessMessage();
                form.reset();
                playSound('success');
            }

            // Callback функция при ошибке
            function onError(error) {
                console.log("❌ Ошибка отправки:", error);
                showFormLoading(false);
                showErrorMessage();
                playSound('error');
            }

            // Отправляем форму с callback функциями
            submitContactForm(formData, onSuccess, onError);
        });
    }
});

// ===== CALLBACK ФУНКЦИИ =====

// Функция отправки формы (симуляция асинхронного запроса)
function submitContactForm(formData, successCallback, errorCallback) {
    console.log("🔄 Отправка данных...", formData);
    
    // Создаем промис для асинхронной операции
    const submissionPromise = new Promise((resolve, reject) => {
        // Симуляция задержки сети 2 секунды
        setTimeout(() => {
            // 85% шанс успеха, 15% шанс ошибки (для демонстрации)
            const isSuccess = Math.random() > 0.15;
            
            if (isSuccess) {
                resolve({
                    status: 'success',
                    messageId: 'msg_' + Date.now(),
                    timestamp: new Date().toLocaleString(),
                    data: formData
                });
            } else {
                reject({
                    status: 'error',
                    errorCode: 'NETWORK_ERROR',
                    message: 'Connection failed. Please try again.',
                    timestamp: new Date().toLocaleString()
                });
            }
        }, 2000);
    });

    // Обрабатываем результат с callback функциями
    submissionPromise
        .then(result => {
            successCallback(result);
        })
        .catch(error => {
            errorCallback(error);
        });
}

// Функция показа загрузки
function showFormLoading(show) {
    const submitBtn = document.querySelector('#feedbackForm button[type="submit"]');
    if (submitBtn) {
        if (show) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('sending');
        } else {
            submitBtn.innerHTML = 'Send Message';
            submitBtn.disabled = false;
            submitBtn.classList.remove('sending');
        }
    }
}

// Функция показа успешного сообщения
function showSuccessMessage() {
    // Создаем красивый alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <strong>✅ Success!</strong> Thank you! Your message has been sent. We will contact you soon.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Вставляем перед формой
    const form = document.getElementById('feedbackForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Функция показа ошибки
function showErrorMessage() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <strong>❌ Error!</strong> Sorry, there was a problem sending your message. Please try again.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.getElementById('feedbackForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Функция для звуков (добавь звуковые файлы в папку sounds/)
function playSound(type) {
    try {
        const audio = new Audio();
        switch(type) {
            case 'success':
                // Можно добавить звук успеха
                console.log("🔊 Success sound played");
                break;
            case 'error':
                // Можно добавить звук ошибки
                console.log("🔊 Error sound played");
                break;
        }
    } catch (e) {
        console.log("Sound not available:", e);
    }
}

// Функция для проверки email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция для проверки номера телефона
function validatePhone(phone) {
    const cleanedPhone = phone.replace(/[\s\(\)\-]/g, '');
    const phoneRegex = /^(\+7|8|7)?\d{10}$/;
    return phoneRegex.test(cleanedPhone);
}
// CART /

// Функции для корзины

    // ===== ИСПРАВЛЕННАЯ ФУНКЦИЯ ADD TO CART =====
function addToCart(name, price) {
    // Получаем корзину из Local Storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ищем товар в корзине
    let item = cart.find(item => item.name === name);
    
    if (item) {
        // Если товар уже есть - увеличиваем количество
        item.quantity += 1;
    } else {
        // Если товара нет - добавляем новый
        cart.push({ 
            name: name, 
            price: price, 
            quantity: 1 
        });
    }
    
    // Сохраняем корзину
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик корзины
    updateCartCounter();
    
    // Анимация кнопки (если есть event)
    if (event && event.target) {
        animateAddToCart(event.target);
    }
    
    // Сообщение об успехе
    alert(`✅ ${name} added to cart!`);
}

// ===== АНИМАЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ =====
function animateAddToCart(button) {
    // Сохраняем оригинальный текст и стили
    const originalText = button.innerHTML;
    const originalBackground = button.style.backgroundColor;
    
    // Анимация
    button.style.animation = 'bounce 0.5s';
    button.style.backgroundColor = '#28a745';
    button.innerHTML = '✅ Added!';
    
    // Возвращаем обратно через 1 секунду
    setTimeout(() => {
        button.style.animation = '';
        button.style.backgroundColor = originalBackground;
        button.innerHTML = originalText;
    }, 1000);
}

// ===== ОБНОВЛЕННЫЙ СЧЕТЧИК КОРЗИНЫ =====
function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        cartLink.innerHTML = totalItems > 0 ? `Cart 🛒 (${totalItems})` : 'Cart 🛒';
        
        // Анимация счетчика
        if (totalItems > 0) {
            cartLink.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                cartLink.style.animation = '';
            }, 500);
        }
    }
}

// Остальные функции остаются без изменений
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
// ===== PRODUCT SEARCH =====
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    let foundResults = false;

    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description .short-text').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
            foundResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Показываем сообщение если нет результатов
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = foundResults ? 'none' : 'block';
    }
    
    playSound('click');
}

// Очистка поиска
function clearSearch() {
    document.getElementById('searchInput').value = '';
    searchProducts(); 
}
// ===== DAY/NIGHT THEME =====
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.classList.contains('dark-theme')) {
        // Switch to light theme
        body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark theme
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeIcon').textContent = '☀️';
    }
});
// ===== READ MORE BUTTON =====
function toggleReadMore(button) {
    const description = button.closest('.product-description');
    const shortText = description.querySelector('.short-text');
    const fullText = description.querySelector('.full-text');
    const isExpanded = fullText.style.display === 'block';
    
    if (isExpanded) {
        // Collapse
        fullText.style.display = 'none';
        shortText.style.display = 'block';
        button.textContent = 'Read More ▼';
    } else {
        // Expand
        fullText.style.display = 'block';
        shortText.style.display = 'none';
        button.textContent = 'Read Less ▲';
    }
    
    
}
// ===== RESET FORM BUTTON =====
function resetContactForm() {
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
        input.value = '';
    });
    alert('Form has been reset!');
    playSound('click');
}
// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(event) {
    const menuItems = document.querySelectorAll('.navbar-nav .nav-link');
    let currentIndex = -1;
    
    // Найти текущий активный элемент
    menuItems.forEach((item, index) => {
        if (document.activeElement === item) {
            currentIndex = index;
        }
    });
    
    switch(event.key) {
        case 'ArrowRight':
            event.preventDefault();
            currentIndex = (currentIndex + 1) % menuItems.length;
            menuItems[currentIndex].focus();
            playSound('click');
            break;
            
        case 'ArrowLeft':
            event.preventDefault();
            currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[currentIndex].focus();
            playSound('click');
            break;
            
        case 'Enter':
            if (document.activeElement.classList.contains('nav-link')) {
                event.preventDefault();
                document.activeElement.click();
                playSound('click');
            }
            break;
    }
});
//  PRODUCT FILTERING WITH SWITCH 
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    // Обновляем активную кнопку
    document.querySelectorAll('.filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Фильтрация через switch statement
    products.forEach(product => {
        let showProduct = false;
        
        switch(category) {
            case 'all':
                showProduct = true;
                break;
                
            case 'jerseys':
                showProduct = product.querySelector('.card-title').textContent.includes('Jersey') || 
                             product.querySelector('.card-title').textContent.includes('Kit');
                break;
                
            case 'balls':
                showProduct = product.querySelector('.card-title').textContent.includes('Ball');
                break;
                
            case 'cleats':
                showProduct = product.querySelector('.card-title').textContent.includes('Cleats');
                break;
                
            case 'accessories':
                showProduct = product.querySelector('.card-title').textContent.includes('Socks') || 
                             product.querySelector('.card-title').textContent.includes('Guards');
                break;
                
            default:
                showProduct = true;
        }
        
        product.style.display = showProduct ? 'block' : 'none';
    });
    
    playSound('click');
}
// PLAY SOUNDS - ТОЛЬКО НУЖНЫЕ ЗВУКИ
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        switch(type) {
            case 'addToCart':
                playBeepSound(audioContext, 1000, 0.3); 
                break;
                
            case 'success':
                playBeepSound(audioContext, 1200, 0.4); 
                break;
                
            default:
                return; 
        }
    } catch (e) {
        console.log("🔇 Sounds not available");
    }
}

function playBeepSound(audioContext, frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

//  ЗВУК ПРИ ДОБАВЛЕНИИ В КОРЗИН
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
    
    
    playSound('addToCart');
    
    alert(`✅ ${name} added to cart!`);
}

//ЗВУК ПРИ СМЕНЕ СТРАНИЦ 
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔊 Sound system activated!");
    
    // Звук при клике на навигационные ссылки (смена страниц)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            playSound('success'); 
        });
    });
});


function onSuccess(response) {
    console.log("✅ Форма отправлена:", response);
    showFormLoading(false);
    showSuccessMessage();
    form.reset();
    playSound('success'); 
}

function onError(error) {
    console.log("❌ Ошибка отправки:", error);
    showFormLoading(false);
    showErrorMessage();
    
}

//  ТЕСТОВАЯ КНОПКА 
function testSounds() {
    console.log("🔊 Testing sounds...");
    playSound('addToCart');
    setTimeout(() => playSound('success'), 500);
}
//  SOUND TOGGLE SYSTEM
let soundEnabled = true;

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    alert(soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF");
}

// ===== PLAY SOUNDS - С ПРОВЕРКОЙ =====
function playSound(type) {
    if (!soundEnabled) return; //
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        switch(type) {
            case 'addToCart':
                playBeepSound(audioContext, 1000, 0.3);
                break;
            case 'success':
                playBeepSound(audioContext, 1200, 0.4);
                break;
            default:
                return;
        }
    } catch (e) {
        console.log("🔇 Sounds not available");
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем настройку звука
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
        soundEnabled = savedSound === 'true';
    }
    
    // Обновляем иконку
    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) {
        soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    console.log("🔊 Sound system ready:", soundEnabled ? "ON" : "OFF");
});

