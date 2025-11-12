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

    //  ФУНКЦИЯ ADD TO CART
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
    
 showSimpleNotification(`🛒 ${name} добавлен в корзину!`);
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


// ===== DAY/NIGHT THEME =====
// ===== IMPROVED DAY/NIGHT THEME =====
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.classList.contains('dark-theme')) {
        // Switch to light theme
        body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        console.log('Switched to light theme');
    } else {
        // Switch to dark theme
        body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        console.log('Switched to dark theme');
    }
}

// Load saved theme on page load with better initialization
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
        console.log('Loaded dark theme from storage');
    } else {
        // Ensure light theme is properly set
        body.classList.remove('dark-theme');
        console.log('Loaded light theme');
    }
    
    // Force re-render of all elements
    setTimeout(() => {
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }, 10);
});
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
// ===== ИСПРАВЛЕННАЯ ФИЛЬТРАЦИЯ =====
let originalProducts = null; // Сохраняем оригинальные товары

function filterProducts(category) {
    const $allRows = $('.row');
    const $productsRow = $allRows.eq(2);
    
    // Сохраняем оригинальные товары при первом вызове
    if (!originalProducts) {
        originalProducts = $('.product-card').parent().clone();
    }
    
    $('.filters .btn').removeClass('active');
    $(event.target).addClass('active');
    
    let visibleProducts = [];
    
    // Фильтруем из ОРИГИНАЛЬНЫХ товаров
    originalProducts.each(function() {
        const $card = $(this).clone(); // Клонируем элемент
        const productName = $card.find('.card-title').text();
        let showProduct = false;
        
        switch(category) {
            case 'all': 
                showProduct = true; 
                break;
            case 'jerseys': 
                showProduct = productName.includes('Jersey') || productName.includes('Kit'); 
                break;
            case 'balls': 
                showProduct = productName.includes('Ball'); 
                break;
            case 'cleats': 
                showProduct = productName.includes('Cleats'); 
                break;
            case 'accessories': 
                showProduct = productName.includes('Socks') || productName.includes('Guards'); 
                break;
            default: 
                showProduct = true;
        }
        
        if (showProduct) {
            visibleProducts.push($card);
        }
    });
    
    // Очищаем и добавляем отфильтрованные товары
    $productsRow.empty();
    visibleProducts.forEach($product => {
        $productsRow.append($product);
    });
    
    // Восстанавливаем обработчики событий
    restoreEventHandlers();
    
    playSound('click');
}

// Восстанавливаем обработчики событий
function restoreEventHandlers() {
    // Обработчики для кнопок "Add to Cart"
    $('.btn-success[onclick*="addToCart"]').off('click').on('click', function() {
        const match = this.onclick.toString().match(/addToCart\('([^']+)',\s*(\d+)\)/);
        if (match) {
            addToCart(match[1], parseInt(match[2]));
        }
    });
    
    // Обработчики для кнопок "Read More"
    $('.read-more-btn').off('click').on('click', function() {
        toggleReadMore(this);
    });
}

// Восстанавливаем обработчики событий
function restoreEventHandlers() {
    // Обработчики для кнопок "Add to Cart"
    $('.btn-success[onclick*="addToCart"]').off('click').on('click', function() {
        const match = this.onclick.toString().match(/addToCart\('([^']+)',\s*(\d+)\)/);
        if (match) {
            addToCart(match[1], parseInt(match[2]));
        }
    });
    
    // Обработчики для кнопок "Read More"
    $('.read-more-btn').off('click').on('click', function() {
        toggleReadMore(this);
    });
}

// ===== PLAY SOUNDS - ТОЛЬКО НУЖНЫЕ ЗВУКИ =====
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        switch(type) {
            case 'addToCart':
                playBeepSound(audioContext, 1000, 0.3); // Приятный звук добавления
                break;
                
            case 'success':
                playBeepSound(audioContext, 1200, 0.4); // Радостный успех
                break;
                
            default:
                return; // Никаких других звуков
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

// ===== ЗВУК ПРИ ДОБАВЛЕНИИ В КОРЗИНУ =====
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
    
    // 🔥 ЗВУК ДОБАВЛЕНИЯ В КОРЗИНУ
    playSound('addToCart');
    
    alert(`✅ ${name} added to cart!`);
}

// ===== ЗВУК ПРИ СМЕНЕ СТРАНИЦ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔊 Sound system activated!");
    
    // Звук при клике на навигационные ссылки (смена страниц)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            playSound('success'); // Используем success звук для смены страниц
        });
    });
});

// ===== ЗВУК УСПЕХА ДЛЯ ФОРМ =====
// В контактной форме оставляем только success звук
function onSuccess(response) {
    console.log("✅ Форма отправлена:", response);
    showFormLoading(false);
    showSuccessMessage();
    form.reset();
    playSound('success'); // Звук успеха
}

function onError(error) {
    console.log("❌ Ошибка отправки:", error);
    showFormLoading(false);
    showErrorMessage();
    // БЕЗ ЗВУКА ДЛЯ ОШИБКИ
}

// ===== ТЕСТОВАЯ КНОПКА =====
function testSounds() {
    console.log("🔊 Testing sounds...");
    playSound('addToCart');
    setTimeout(() => playSound('success'), 500);
}
// ===== SOUND TOGGLE SYSTEM =====
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

// ===== ASSIGNMENT 7: JQUERY TASKS =====

// Task 0: jQuery Ready Test
$(document).ready(function() {
    console.log("✅ jQuery is ready and working!");
    
    // Task 4: Scroll Progress Bar
    initScrollProgressBar();
    
    // Task 1: jQuery Search
    initJquerySearch();
});

// ===== TASK 4: SCROLL PROGRESS BAR =====
function initScrollProgressBar() {
    // Создаем прогресс-бар
    $('body').prepend(`
        <div class="scroll-progress-container">
            <div class="scroll-progress-bar"></div>
        </div>
    `);
    
    const $progressBar = $('.scroll-progress-bar');
    
    $(window).on('scroll', function() {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollTop = $(window).scrollTop();
        
        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
        $progressBar.css('width', progress + '%');
        
        // Меняем цвет в зависимости от прогресса
        if (progress < 33) {
            $progressBar.css('background', 'linear-gradient(90deg, #28a745, #20c997)');
        } else if (progress < 66) {
            $progressBar.css('background', 'linear-gradient(90deg, #20c997, #17a2b8)');
        } else {
            $progressBar.css('background', 'linear-gradient(90deg, #17a2b8, #6f42c1)');
        }
    });
}

// ===== ИСПРАВЛЕННЫЙ ПОИСК =====
function initJquerySearch() {
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        const $allRows = $('.row');
        const $productsRow = $allRows.eq(2);
        
        if (!originalProducts) {
            originalProducts = $('.product-card').parent().clone();
        }
        
        let foundResults = false;
        let visibleProducts = [];

        if (searchTerm.length > 0) {
            // Поиск по оригинальным товарам
            originalProducts.each(function() {
                const $card = $(this).clone();
                const productName = $card.find('.card-title').text().toLowerCase();
                const productDescription = $card.find('.short-text').text().toLowerCase();
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    foundResults = true;
                    visibleProducts.push($card);
                }
            });
        } else {
            // Если поиск пустой - показываем все оригинальные товары
            originalProducts.each(function() {
                visibleProducts.push($(this).clone());
            });
            foundResults = true;
        }

        // Обновляем отображение
        $productsRow.empty();
        visibleProducts.forEach($product => {
            $productsRow.append($product);
        });
        
        restoreEventHandlers();
        $('#noResults').toggle(!foundResults && searchTerm.length > 0);
    });
}

// ===== JQUERY FEATURES =====
$(document).ready(function() {
    console.log("✅ jQuery is ready!");
    
    // Анимированные счетчики
    $('.number-counter').each(function() {
        const $this = $(this);
        const target = parseInt($this.data('target'));
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                $this.text(target + '+');
                clearInterval(timer);
            } else {
                $this.text(Math.floor(current) + '+');
            }
        }, 20);
    });
    
    // Прогресс-бар при скролле
    $('body').prepend('<div class="scroll-progress"><div class="scroll-bar"></div></div>');
    $(window).scroll(function() {
        var scrollPercent = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
        $('.scroll-bar').css('width', scrollPercent + '%');
    });
});
// ===== JQUERY READY =====

$(document).ready(function() {
    console.log("✅ jQuery is ready!");
    
    // Task 8: Copy to Clipboard
    initCopyToClipboard();
});

// ===== TASK 8: COPY TO CLIPBOARD =====
function initCopyToClipboard() {
    $('.copy-btn').on('click', function() {
        const textToCopy = $(this).data('text');
        
        // Копируем в буфер обмена
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Меняем текст кнопки на "Скопировано!"
            const originalText = $(this).html();
            $(this).html('✅ Copied!');
            $(this).addClass('btn-success').removeClass('btn-outline-success');
            
            // Возвращаем обратно через 2 секунды
            setTimeout(() => {
                $(this).html(originalText);
                $(this).addClass('btn-outline-success').removeClass('btn-success');
            }, 2000);
            
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            alert('Не удалось скопировать текст');
        });
    });
}
// ===== TASK 6: LOADING SPINNER ON SUBMIT =====
function initLoadingSpinner() {
    $('#feedbackForm').on('submit', function(e) {
        e.preventDefault();
        
        const $submitBtn = $('#submitBtn');
        const $btnText = $submitBtn.find('.btn-text');
        const $spinner = $submitBtn.find('.spinner-border');
        
        console.log("🔄 Form submission started");
        
        // Показываем спиннер
        $btnText.text('Sending...');
        $spinner.removeClass('d-none');
        $submitBtn.prop('disabled', true);
        
        // Симуляция отправки (2 секунды)
        setTimeout(() => {
            console.log("✅ Form submission completed");
            
            // Возвращаем кнопку в исходное состояние
            $btnText.text('Send Message');
            $spinner.addClass('d-none');
            $submitBtn.prop('disabled', false);
            
            // ТОЛЬКО ОДНО уведомление об успехе
            showJqueryNotification('✅ Thank you! Your message has been sent successfully!', 'success');
            
            // Очищаем форму
            $('#feedbackForm')[0].reset();
            
        }, 2000);
    });
}
$(document).ready(function() {
    console.log("✅ jQuery is ready!");
    
    // Task 6: Loading Spinner
    initLoadingSpinner();
    
    // ... другие функции ...
});
// ===== TASK 2: SEARCH AUTOCOMPLETE =====
function initSearchAutocomplete() {
    const products = [
        "FC Barcelona Jersey",
        "Soccer Ball", 
        "Football Cleats",
        "Real Madrid Jersey",
        "Football Socks",
        "Shin Guards",
        "Barcelona",
        "Real Madrid", 
        "Nike",
        "Adidas",
        "Goalkeeper Gloves",
        "Jersey",
        "Cleats",
        "Ball",
        "Socks"
    ];
    
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase().trim();
        
        // Удаляем старые подсказки
        $('#autocomplete-suggestions').remove();
        
        if (searchTerm.length > 1) {
            const matches = products.filter(product => 
                product.toLowerCase().includes(searchTerm)
            ).slice(0, 5); // Максимум 5 подсказок
            
            if (matches.length > 0) {
                const $suggestions = $(`
                    <div id="autocomplete-suggestions" class="autocomplete-suggestions">
                        ${matches.map(match => `
                            <div class="suggestion-item" data-product="${match}">
                                🔍 ${match}
                            </div>
                        `).join('')}
                    </div>
                `);
                
                $(this).parent().append($suggestions);
                
                // Клик по подсказке
                $('.suggestion-item').on('click', function() {
                    const product = $(this).data('product');
                    $('#searchInput').val(product);
                    $('#autocomplete-suggestions').remove();
                    // Запускаем поиск
                    $('#searchInput').trigger('keyup');
                });
            }
        }
    });
    
    // Скрываем подсказки при клике вне
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#searchInput, #autocomplete-suggestions').length) {
            $('#autocomplete-suggestions').remove();
        }
    });
    
    // Скрываем подсказки при нажатии Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#autocomplete-suggestions').remove();
        }
    });
}
$(document).ready(function() {
    console.log("✅ jQuery is ready!");
    
    // Task 2: Search Autocomplete
    initSearchAutocomplete();
    
    // ... другие функции ...
});


// Функция для плавного удаления уведомления
function removeNotification($notification) {
    $notification.slideUp(300, function() {
        $(this).remove();
    });
}

// Функции для быстрого вызова уведомлений
function showSuccessNotification(message) {
    showJqueryNotification(message, 'success');
}

function showErrorNotification(message) {
    showJqueryNotification(message, 'error');
}

function showWarningNotification(message) {
    showJqueryNotification(message, 'warning');
}

function showInfoNotification(message) {
    showJqueryNotification(message, 'info');
}
// ===== SIZE SELECTION FUNCTIONALITY =====
function initSizeSelection() {
    // Обработчик для кнопок размеров
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-outline-success') && 
            e.target.closest('.btn-group')) {
            
            const btnGroup = e.target.closest('.btn-group');
            const allButtons = btnGroup.querySelectorAll('.btn');
            const clickedSize = e.target.textContent.trim();
            
            // Убираем активный класс у всех кнопок в группе
            allButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-success');
            });
            
            // Добавляем активный класс к нажатой кнопке
            e.target.classList.remove('btn-outline-success');
            e.target.classList.add('btn-success', 'active');
            
            // Сохраняем выбранный размер в data-атрибут карточки
            const productCard = btnGroup.closest('.product-card');
            if (productCard) {
                productCard.setAttribute('data-selected-size', clickedSize);
            }
            
            console.log(`Selected size: ${clickedSize}`);
            playSound('click');
        }
    });
}

// ===== UPDATE ADD TO CART TO INCLUDE SIZE =====
function addToCart(name, price) {
    const productCard = event.target.closest('.product-card');
    let selectedSize = 'Default';
    
    if (productCard) {
        selectedSize = productCard.getAttribute('data-selected-size') || 'Default';
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ищем товар с таким же названием И размером
    let item = cart.find(item => item.name === name && item.size === selectedSize);
    
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ 
            name: name, 
            price: price, 
            quantity: 1,
            size: selectedSize
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Анимация кнопки
    animateAddToCart(event.target);
    
    showSimpleNotification(`🛒 ${name} (${selectedSize}) добавлен в корзину!`);
}

// ===== UPDATE CART DISPLAY TO SHOW SIZES =====
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
        let sizeInfo = item.size && item.size !== 'Default' ? ` • Size: ${item.size}` : '';
        
        html += `
            <div class="cart-item border-bottom pb-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-6">
                        <h5>${item.name}</h5>
                        <p>${item.price} KZT × ${item.quantity}${sizeInfo}</p>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-sm btn-outline-success" onclick="changeQty('${item.name}', '${item.size}', -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-success" onclick="changeQty('${item.name}', '${item.size}', 1)">+</button>
                    </div>
                    <div class="col-2">
                        <button class="btn btn-danger btn-sm" onclick="removeItem('${item.name}', '${item.size}')">×</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateSummary(cart);
}

// ===== UPDATE CART FUNCTIONS FOR SIZES =====
function changeQty(name, size, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.name === name && item.size === size);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => !(i.name === name && i.size === size));
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCounter();
    }
}

function removeItem(name, size) {
    if (confirm(`Remove ${name}${size && size !== 'Default' ? ` (Size: ${size})` : ''}?`)) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => !(item.name === name && item.size === size));
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCounter();
    }
}
// ===== INITIALIZE ALL FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    updateCartCounter();
    displayCart();
    initSizeSelection(); // ← ДОБАВЬ ЭТУ СТРОЧКУ
    
    // Остальной код инициализации...
    setInterval(updateDateTime, 60000);
});
// ===== FIXED READ MORE FUNCTION =====
function toggleReadMore(button) {
    console.log("Read More clicked"); // Для дебага
    
    const description = button.closest('.product-description');
    if (!description) {
        console.error("Product description not found");
        return;
    }
    
    const shortText = description.querySelector('.short-text');
    const fullText = description.querySelector('.full-text');
    
    if (!shortText || !fullText) {
        console.error("Short text or full text not found");
        return;
    }
    
    const isExpanded = fullText.style.display === 'block';
    
    if (isExpanded) {
        // Collapse
        fullText.style.display = 'none';
        shortText.style.display = 'block';
        button.textContent = 'Read More ▼';
        button.setAttribute('aria-expanded', 'false');
    } else {
        // Expand
        fullText.style.display = 'block';
        shortText.style.display = 'none';
        button.textContent = 'Read Less ▲';
        button.setAttribute('aria-expanded', 'true');
    }
    
    // Анимация
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    playSound('click');
}

//INITIALIZE READ MORE BUTTONS
function initReadMoreButtons() {
    console.log("Initializing Read More buttons...");
    
    
    $('.read-more-btn').off('click');
    
    
    $('.read-more-btn').on('click', function() {
        toggleReadMore(this);
    });
    
    console.log(`Found ${$('.read-more-btn').length} Read More buttons`);
}
// ===== AUTHENTICATION SYSTEM =====
let currentUser = null;

// Initialize auth system
function initAuth() {
    loadCurrentUser();
    updateAuthUI();
}

// Load user from localStorage
function loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

// Update UI based on auth status
function updateAuthUI() {
    const loginBtn = document.querySelector('a[data-bs-target="#authModal"]');
    if (loginBtn) {
        if (currentUser) {
            loginBtn.innerHTML = `👤 ${currentUser.name}`;
            loginBtn.setAttribute('href', 'profile.html');
            loginBtn.removeAttribute('data-bs-toggle');
            loginBtn.removeAttribute('data-bs-target');
        } else {
            loginBtn.innerHTML = '👤 Login';
            loginBtn.setAttribute('href', '#');
            loginBtn.setAttribute('data-bs-toggle', 'modal');
            loginBtn.setAttribute('data-bs-target', '#authModal');
        }
    }
}

// Register new user
function registerUser(name, email, password, phone) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        alert('User with this email already exists!');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // In real app, hash this!
        phone: phone,
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    loginUser(email, password);
    return true;
}

// Login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        if (modal) modal.hide();
        
        alert(`Welcome back, ${user.name}!`);
        return true;
    } else {
        alert('Invalid email or password!');
        return false;
    }
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    alert('You have been logged out.');
    window.location.href = 'index.html';
}

// Form validation
function validateRegistration(name, email, password, phone) {
    if (name.length < 2) {
        alert('Name must be at least 2 characters long');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    return true;
}
// Initialize auth when page loads
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            loginUser(email, password);
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const phone = document.getElementById('regPhone').value;
            
            if (validateRegistration(name, email, password, phone)) {
                registerUser(name, email, password, phone);
            }
        });
    }
});
// ===== PROFILE MANAGEMENT =====

// Load and display profile data
function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileContent = document.getElementById('profileContent');
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const profileHTML = `
        <div class="row">
            <div class="col-md-8">
                <table class="table table-borderless">
                    <tr>
                        <th width="30%">Name:</th>
                        <td>${currentUser.name}</td>
                    </tr>
                    <tr>
                        <th>Email:</th>
                        <td>${currentUser.email}</td>
                    </tr>
                    <tr>
                        <th>Phone:</th>
                        <td>${currentUser.phone}</td>
                    </tr>
                    <tr>
                        <th>Member since:</th>
                        <td>${new Date(currentUser.joinDate).toLocaleDateString()}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-4 text-center">
                <div class="profile-avatar bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style="width: 80px; height: 80px; font-size: 2rem;">
                    ${currentUser.name.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
        <div class="mt-4">
            <button class="btn btn-outline-success" onclick="editProfile()">✏️ Edit Profile</button>
            <button class="btn btn-outline-danger ms-2" onclick="logout()">🚪 Logout</button>
        </div>
    `;
    
    if (profileContent) {
        profileContent.innerHTML = profileHTML;
    }
    
    loadOrderHistory();
    loadUserRatings();
}

// Load order history
function loadOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const orderHistory = document.getElementById('orderHistory');
    
    if (orders.length === 0) {
        return;
    }
    
    const ordersHTML = orders.map(order => `
        <div class="order-item border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between">
                <div>
                    <strong>Order #${order.id}</strong>
                    <br>
                    <small class="text-muted">Date: ${new Date(order.date).toLocaleDateString()}</small>
                </div>
                <div class="text-end">
                    <strong>${order.total.toLocaleString()} KZT</strong>
                    <br>
                    <span class="badge bg-success">${order.status}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    if (orderHistory) {
        orderHistory.innerHTML = ordersHTML;
    }
}

// Load user ratings
function loadUserRatings() {
    const allRatings = JSON.parse(localStorage.getItem('productRatings')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userRatings = document.getElementById('userRatings');
    
    if (!currentUser) return;
    
    const userRatingsList = allRatings.filter(rating => rating.userId === currentUser.id);
    
    if (userRatingsList.length === 0) {
        return;
    }
    
    const ratingsHTML = userRatingsList.map(rating => `
        <div class="rating-item border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${rating.productName}</strong>
                    <div class="stars">
                        ${'⭐'.repeat(rating.rating)}${'☆'.repeat(5-rating.rating)}
                    </div>
                </div>
                <small class="text-muted">${new Date(rating.date).toLocaleDateString()}</small>
            </div>
            ${rating.comment ? `<p class="mb-0 mt-1"><em>"${rating.comment}"</em></p>` : ''}
        </div>
    `).join('');
    
    if (userRatings) {
        userRatings.innerHTML = ratingsHTML;
    }
}

// Edit profile function
function editProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const newName = prompt('Enter new name:', currentUser.name);
    const newPhone = prompt('Enter new phone:', currentUser.phone);
    
    if (newName && newPhone) {
        // Update user data
        currentUser.name = newName;
        currentUser.phone = newPhone;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in users list
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Profile updated successfully!');
        loadProfile();
        updateAuthUI();
    }
}

// Protect profile page
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && window.location.pathname.includes('profile.html')) {
        window.location.href = 'index.html';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication for profile page
    checkAuth();
    
    // Load profile if on profile page
    if (window.location.pathname.includes('profile.html')) {
        loadProfile();
    }
    
    // Rest of your existing code...
    initAuth();
    // ... остальной код
});
// ===== TOGGLE STANDINGS VISIBILITY =====
let standingsLoaded = false;

function toggleStandings() {
    const standingsBody = document.getElementById("standingsBody");
    const toggleBtn = document.getElementById("standingsToggle");
    
    if (standingsBody.style.display === "none") {
        // Show standings
        standingsBody.style.display = "block";
        toggleBtn.textContent = "📊 Hide Table";
        
        // Load data only once
        if (!standingsLoaded) {
            loadStandingsData();
            standingsLoaded = true;
        }
    } else {
        // Hide standings
        standingsBody.style.display = "none";
        toggleBtn.textContent = "📊 Show Table";
    }
}

function loadStandingsData() {
    fetch("http://localhost:3000/apl")
        .then(res => res.json())
        .then(data => {
            const table = data.standings[0].table;
            const tbody = document.getElementById("league-table");
            
            tbody.innerHTML = ''; // Clear loading spinner
            
            table.forEach(team => {
                tbody.innerHTML += `
                    <tr class="${team.position <= 4 ? 'table-success' : team.position >= 18 ? 'table-danger' : ''}">
                        <td><strong>${team.position}</strong></td>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${team.team.crest}" 
                                     alt="${team.team.name}" 
                                     style="width: 24px; height: 24px; margin-right: 10px;"
                                     onerror="this.style.display='none'">
                                ${team.team.name}
                            </div>
                        </td>
                        <td><strong class="text-success">${team.points}</strong></td>
                    </tr>
                `;
            });
        })
        .catch(err => {
            console.error("Ошибка при загрузке таблицы:", err);
            document.getElementById("league-table").innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-danger">
                        ❌ Failed to load standings. Make sure proxy server is running on localhost:3000
                    </td>
                </tr>
            `;
        });
}