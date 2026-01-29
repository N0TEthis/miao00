

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Страница 404 загружена! Начинаем поиск выхода...');
    
    
    initTheme();
    initEmojiAnimations();
    initMobInteractions();
    initSearch();
    initMiniGame();
    initCounter();
    initPanicMode();
    initAlertSystem();
    
    
    startAutomaticAnimations();
    
    
    consoleTips();
});

// ===== ТЕМА =====
function initTheme() {
    const themeBtn = document.getElementById('themeBtn');
    if (!themeBtn) return;
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('mc404Theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    themeBtn.textContent = savedTheme === 'dark' ? '🌞' : '🌙';
    
    // Обработчик переключения темы
    themeBtn.addEventListener('click', function() {
        toggleTheme();
    });
}

function toggleTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const isDark = document.body.classList.toggle('dark-theme');
    
    themeBtn.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('mc404Theme', isDark ? 'dark' : 'light');
    
    // Анимация переключения
    themeBtn.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        themeBtn.style.transform = '';
    }, 300);
    
    // Показываем уведомление
    showAlert(`Тема изменена: ${isDark ? 'Темная' : 'Светлая'}`, isDark ? '🌙' : '☀️');
}

// ===== АНИМАЦИИ ЭМОДЗИ =====
function initEmojiAnimations() {
    const errorEmoji = document.getElementById('errorEmoji');
    if (!errorEmoji) return;
    
    const emojis = ['😱', '🤔', '😅', '🧐', '💀', '👻', '🕵️', '🧭', '🗺️', '⚡', '🎮', '⛏️'];
    
    // Меняем эмодзи каждые 3 секунды
    setInterval(() => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Анимация смены
        errorEmoji.style.transform = 'scale(1.3) rotate(180deg)';
        errorEmoji.style.opacity = '0.5';
        
        setTimeout(() => {
            errorEmoji.textContent = randomEmoji;
            errorEmoji.style.transform = 'scale(1) rotate(0deg)';
            errorEmoji.style.opacity = '1';
        }, 150);
    }, 3000);
    
    // Добавляем эффект при наведении
    errorEmoji.addEventListener('mouseenter', () => {
        errorEmoji.style.transform = 'scale(1.5)';
        errorEmoji.style.cursor = 'pointer';
    });
    
    errorEmoji.addEventListener('mouseleave', () => {
        errorEmoji.style.transform = 'scale(1)';
    });
    
    errorEmoji.addEventListener('click', () => {
        errorEmoji.classList.toggle('spin');
        showAlert('🌀 Эмодзи закрутился!', '🎡');
    });
}

// ===== ВЗАИМОДЕЙСТВИЕ С МОБАМИ =====
function initMobInteractions() {
    // Готовые сообщения для каждого моба
    const mobMessages = {
        'creeper': {
            message: '💥 Тсссс... БУМ! Ой, шучу! Не волнуйтесь, я сегодня не взрываюсь. Может, поищем страницу вместе?',
            sound: '💣'
        },
        'villager': {
            message: '🧔 Хммм... Потерянная страница? Я мог бы продать вам компас за 3 изумруда! Или просто подсказать дорогу бесплатно...',
            sound: '💰'
        },
        'cat': {
            message: '🐱 Мяу! Следуй за мной, я знаю все тайные проходы! Но сначала дай рыбки... Мяяяу!',
            sound: '🐟'
        },
        'enderman': {
            message: '🟪 *Издает странные звуки* Не смотри на меня! Ладно, смотри... Страница? Она в другом измерении!',
            sound: '🌀'
        }
    };
    
    window.talkToMob = function(mobType) {
        const mobData = mobMessages[mobType];
        if (!mobData) return;
        
        // Показываем сообщение
        showAlert(mobData.message, mobData.sound);
        
        // Анимация кнопки моба
        const mobBtn = event?.target.closest('.mob-btn') || document.querySelector(`.mob-btn[onclick*="${mobType}"]`);
        if (mobBtn) {
            mobBtn.style.transform = 'scale(0.9)';
            mobBtn.style.background = '#E8F5E9';
            
            setTimeout(() => {
                mobBtn.style.transform = '';
                mobBtn.style.background = '';
            }, 300);
        }
        
        // Случайный звуковой эффект в консоли
        const sounds = [
            `🔊 ${mobType} издает звуки!`,
            '🎮 Моб что-то говорит...',
            '🗣️ Диалог с мобом начат!'
        ];
        console.log(sounds[Math.floor(Math.random() * sounds.length)]);
    };
}

// ===== ПОИСК =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Автофокус на поле поиска
        setTimeout(() => {
            searchInput.focus();
        }, 1000);
        
        // Обработчик поиска
        window.startSearch = function() {
            const query = searchInput.value.trim();
            if (!query) {
                searchInput.style.borderColor = '#FF5722';
                searchInput.placeholder = 'Введите хоть что-нибудь!';
                setTimeout(() => {
                    searchInput.style.borderColor = '';
                    searchInput.placeholder = 'Введите что искали (или просто крикните "ПОМОГИТЕ!")';
                }, 2000);
                return;
            }
            
            // Анимация поиска
            searchBtn.textContent = '🔍 Ищем...';
            searchBtn.disabled = true;
            
            // Показываем "процесс поиска"
            setTimeout(() => {
                const responses = [
                    `🔎 По запросу "${query}" ничего не найдено... Может, крипер съел?`,
                    '🎯 Ищем-ищем... Ой, страница в другом измерении!',
                    '🧭 Компас показывает, что страница очень далеко!',
                    '💎 Алмазная кирка не помогает найти эту страницу!'
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                showAlert(randomResponse, '🔍');
                
                searchBtn.textContent = '🔎 Искать';
                searchBtn.disabled = false;
                
                // Очищаем поле
                searchInput.value = '';
            }, 1500);
        };
        
        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startSearch();
            }
        });
    }
    
    // Быстрые подсказки
    window.suggestSearch = function(query) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
            searchInput.focus();
            
            showAlert(`🔍 Ищем "${query}"... Хмм, интересно что найдем?`, '🤔');
        }
    };
}

// ===== МИНИ-ИГРА =====
function initMiniGame() {
    window.guessCreepers = function(number) {
        const gameResult = document.getElementById('gameResult');
        if (!gameResult) return;
        
        const responses = [
            `❌ ${number} криперов? Слишком мало! Они бы даже не поцарапали!`,
            `✅ ${number} криперов! Идеально для controlled demolition!`,
            `💥 ${number} криперов? Это уничтожит не только страницу, но и весь сервер!`,
            `🎯 ${number} криперов? Гениально! Именно столько и нужно!`,
            `🤔 ${number} криперов? Хм... интересная теория!`,
            `😂 ${number} криперов? Один крипер и так все взорвет!`,
            `⚡ ${number} криперов? Это вызовет апокалипсис!`,
            `🎮 ${number} криперов? Отличная стратегия!`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Анимация результата
        gameResult.textContent = randomResponse;
        gameResult.style.opacity = '0';
        gameResult.style.transform = 'scale(0.8)';
        
        // Разные цвета для разных ответов
        if (randomResponse.includes('✅') || randomResponse.includes('🎯')) {
            gameResult.style.background = '#E8F5E9';
            gameResult.style.borderColor = '#4CAF50';
            gameResult.style.color = '#2E7D32';
        } else if (randomResponse.includes('❌')) {
            gameResult.style.background = '#FFEBEE';
            gameResult.style.borderColor = '#F44336';
            gameResult.style.color = '#C62828';
        } else {
            gameResult.style.background = '#FFF3E0';
            gameResult.style.borderColor = '#FF9800';
            gameResult.style.color = '#EF6C00';
        }
        
        setTimeout(() => {
            gameResult.style.transition = 'all 0.3s ease';
            gameResult.style.opacity = '1';
            gameResult.style.transform = 'scale(1)';
        }, 50);
        
        // Анимация кнопки
        const clickedBtn = event.target;
        clickedBtn.style.transform = 'scale(0.9)';
        clickedBtn.style.background = '#2196F3';
        clickedBtn.style.color = 'white';
        
        setTimeout(() => {
            clickedBtn.style.transform = '';
            clickedBtn.style.background = '';
            clickedBtn.style.color = '';
        }, 300);
        
        // Случайный комментарий
        console.log(`🎮 Игрок выбрал ${number} криперов: ${randomResponse}`);
    };
}

// ===== СЧЕТЧИК ПОСЕТИТЕЛЕЙ =====
function initCounter() {
    const counterElement = document.getElementById('visitorCounter');
    if (!counterElement) return;
    
    // Генерируем случайное число (имитация счетчика)
    let count = Math.floor(Math.random() * 5000) + 1000;
    counterElement.textContent = count.toLocaleString();
    
    // Анимация счетчика
    const counterFill = document.querySelector('.counter-fill');
    if (counterFill) {
        setTimeout(() => {
            counterFill.style.width = '65%';
        }, 500);
    }
    
    // Увеличиваем счетчик каждые 30 секунд
    setInterval(() => {
        count += Math.floor(Math.random() * 10) + 1;
        counterElement.textContent = count.toLocaleString();
        
        // Случайное уведомление
        if (Math.random() > 0.7) {
            const messages = [
                '🎉 Новый заблудившийся!',
                '👣 Еще один искатель приключений!',
                '🧭 Кто-то еще потерялся!'
            ];
            console.log(messages[Math.floor(Math.random() * messages.length)]);
        }
    }, 30000);
}

// ===== РЕЖИМ ПАНИКИ =====
function initPanicMode() {
    let isPanicMode = false;
    
    window.panicMode = function() {
        if (isPanicMode) return;
        
        isPanicMode = true;
        const panicBtn = document.getElementById('panicBtn');
        
        // Меняем текст кнопки
        const originalText = panicBtn.innerHTML;
        panicBtn.innerHTML = '💥 ВЗРЫВ!';
        panicBtn.disabled = true;
        
        // Добавляем стили для тряски
        const style = document.createElement('style');
        style.id = 'panic-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
            @keyframes flash {
                0%, 100% { background: #FF5722; }
                50% { background: #FF9800; }
            }
            .panic-mode {
                animation: shake 0.5s ease-in-out infinite, flash 0.5s infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Применяем тряску ко всей странице
        document.body.classList.add('panic-mode');
        document.title = '🚨 ПАНИКА! 404! 🚨';
        
        // Показываем предупреждение
        showAlert('⚠️ ВНИМАНИЕ! РЕЖИМ ПАНИКИ АКТИВИРОВАН! F3 ДЛЯ КООРДИНАТ!', '🚨');
        
        // Случайные звуки в консоли
        const panicSounds = [
            '💣 Крипер обнаружен!',
            '🚨 Внимание! Внимание!',
            '⚡ Паника уровня: МАКСИМУМ!',
            '🎮 СЛОМАЛСЯ!'
        ];
        
        let soundInterval = setInterval(() => {
            console.log(panicSounds[Math.floor(Math.random() * panicSounds.length)]);
        }, 500);
        
        // Выключаем панику через 5 секунд
        setTimeout(() => {
            clearInterval(soundInterval);
            document.body.classList.remove('panic-mode');
            document.title = '404 - Заблудился в Minecraft! | Minecraft Meme Universe';
            panicBtn.innerHTML = originalText;
            panicBtn.disabled = false;
            isPanicMode = false;
            
            // Удаляем стили
            const panicStyles = document.getElementById('panic-styles');
            if (panicStyles) {
                panicStyles.remove();
            }
            
            showAlert('✅ Паника отключена! Можно выдохнуть...', '😅');
        }, 5000);
    };
}

// ===== СИСТЕМА УВЕДОМЛЕНИЙ =====
function initAlertSystem() {
    window.showAlert = function(message, emoji = 'ℹ️') {
        const alertBox = document.getElementById('alertBox');
        const alertText = document.getElementById('alertText');
        
        if (alertBox && alertText) {
            alertText.textContent = message;
            
            // Меняем эмодзи если нужно
            const alertEmoji = alertBox.querySelector('.alert-emoji');
            if (alertEmoji && emoji) {
                alertEmoji.textContent = emoji;
            }
            
            // Показываем уведомление
            alertBox.style.display = 'block';
            
            // Автоматически скрываем через 5 секунд
            setTimeout(() => {
                if (alertBox.style.display === 'block') {
                    closeAlert();
                }
            }, 5000);
        } else {
            // Если элемента нет, создаем временное уведомление
            console.log(`${emoji} ${message}`);
        }
    };
    
    window.closeAlert = function() {
        const alertBox = document.getElementById('alertBox');
        if (alertBox) {
            alertBox.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                alertBox.style.display = 'none';
                alertBox.style.animation = '';
            }, 500);
        }
    };
}

// ===== АВТОМАТИЧЕСКИЕ АНИМАЦИИ =====
function startAutomaticAnimations() {
    // Мигающий курсор в консоли
    const consoleBlink = document.querySelector('.console-blink');
    if (consoleBlink) {
        setInterval(() => {
            consoleBlink.style.opacity = consoleBlink.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // Плавающие блоки
    const floatingBlocks = document.querySelectorAll('.block');
    floatingBlocks.forEach((block, index) => {
        setInterval(() => {
            const y = Math.sin(Date.now() / 1000 + index) * 10;
            const x = Math.cos(Date.now() / 1000 + index) * 5;
            block.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);
    });
    
    // Случайные сообщения в консоли
    setInterval(() => {
        if (Math.random() > 0.8) {
            const debugMessages = [
                '[DEBUG] Страница все еще не найдена...',
                '[INFO] Поисковые отряды криперов отправлены',
                '[WARN] Эндермены переносят блоки в другое измерение',
                '[ERROR] Компас показывает на страницу 404',
                '[SYSTEM] Перезагрузка поисковых алгоритмов...'
            ];
            console.log(debugMessages[Math.floor(Math.random() * debugMessages.length)]);
        }
    }, 10000);
}

// ===== СОВЕТЫ В КОНСОЛИ =====
function consoleTips() {
    console.log('%c🎮 Minecraft 404 Console Activated!', 'color: #4CAF50; font-size: 18px; font-weight: bold;');
    console.log('%c💡 Совет: Попробуйте команду /tp @p ~ ~ ~', 'color: #2196F3;');
    console.log('%c🔍 Debug: Вы в измерении "Browser" на координатах X:404 Y:64 Z:404', 'color: #FF9800;');
    console.log('%c🎯 Цель: Найти выход или хотя бы хорошие мемы!', 'color: #9C27B0;');
    
    // Случайные подсказки при взаимодействии
    const interactiveTips = [
        '💎 Попробуйте поговорить с мобами!',
        '🔍 Используйте поиск - вдруг повезет?',
        '🎮 Поиграйте в мини-игру!',
        '🧭 Не паникуйте - выход рядом!'
    ];
    
    // Показываем подсказку каждую минуту
    setInterval(() => {
        const tip = interactiveTips[Math.floor(Math.random() * interactiveTips.length)];
        console.log(`%c${tip}`, 'color: #FF5722; font-style: italic;');
    }, 60000);
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====
// Эффект при наведении на элементы
document.querySelectorAll('.hover-grow').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Звуковые эффекты при клике (в консоли)
document.querySelectorAll('button, .nav-btn, .mob-btn').forEach(button => {
    button.addEventListener('click', function() {
        const sounds = [
            '🔊 Клик!',
            '🎮 Звук кнопки!',
            '⚡ Нажато!',
            '💥 Бабах!'
        ];
        if (Math.random() > 0.7) {
            console.log(sounds[Math.floor(Math.random() * sounds.length)]);
        }
    });
});

// Приветственное сообщение
window.addEventListener('load', function() {
    setTimeout(() => {
        const welcomeMessages = [
            '🎮 Добро пожаловать на самую веселую страницу 404!',
            '⛏️ Кажется, вы заблудились... Но это же приключение!',
            '😂 404 ошибка никогда не была такой смешной!',
            '🧭 Не волнуйтесь, выход всегда найдется!'
        ];
        
        const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        showAlert(randomMessage, '🎯');
        
        // Запоминаем время первого посещения
        const firstVisit = localStorage.getItem('mc404FirstVisit');
        if (!firstVisit) {
            localStorage.setItem('mc404FirstVisit', new Date().toISOString());
            showAlert('🎉 Ваше первое посещение страницы 404! Добро пожаловать в клуб заблудившихся!', '👋');
        }
    }, 1500);
});

// Сохранение статистики
window.addEventListener('beforeunload', function() {
    const visitCount = parseInt(localStorage.getItem('mc404Visits') || '0');
    localStorage.setItem('mc404Visits', (visitCount + 1).toString());
    
    // Сохраняем время последнего посещения
    localStorage.setItem('mc404LastVisit', new Date().toISOString());
});