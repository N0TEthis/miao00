// Данные мемов
const memesData = [
    {
        id: 1,
        title: "Когда находишь алмазы рядом с лавой",
        description: "И твое сердце пропускает удар... или десять",
        image: "images/memes/meme1.jpg",
        category: "newbies",
        reactions: {
            laugh: 245,
            cry: 189,
            wow: 156,
            fire: 302
        },
        author: "Steve",
        date: "2024-01-15",
        views: 1250
    },
    {
        id: 2,
        title: "Крипер подкрался незаметно",
        description: "Тссс... не двигайся, он тебя не увидит",
        image: "images/memes/meme2.jpg",
        category: "creepers",
        reactions: {
            laugh: 421,
            cry: 98,
            wow: 203,
            fire: 567
        },
        author: "CreeperGuy",
        date: "2024-01-14",
        views: 2100
    },
    {
        id: 3,
        title: "Деревенский житель и изумруд",
        description: "Хм... хмммммм...",
        image: "images/memes/meme3.jpg",
        category: "villagers",
        reactions: {
            laugh: 389,
            cry: 45,
            wow: 167,
            fire: 423
        },
        author: "VillagerTrader",
        date: "2024-01-13",
        views: 1780
    },
    {
        id: 4,
        title: "Моя редстоун схема",
        description: "Работает? Не работает? Кто знает...",
        image: "https://via.placeholder.com/300x250/4169E1/ffffff?text=Redstone+Fail",
        category: "redstone",
        reactions: {
            laugh: 312,
            cry: 201,
            wow: 289,
            fire: 156
        },
        author: "RedstoneWizard",
        date: "2024-01-12",
        views: 1450
    },
    {
        id: 5,
        title: "Первая ночь в Майнкрафте",
        description: "Почему так темно? И что это за звуки?",
        image: "https://via.placeholder.com/300x250/32CD32/ffffff?text=First+Night",
        category: "newbies",
        reactions: {
            laugh: 567,
            cry: 234,
            wow: 189,
            fire: 678
        },
        author: "NewPlayer42",
        date: "2024-01-11",
        views: 2950
    },
    {
        id: 6,
        title: "Когда пытаешься построить дом",
        description: "По плану vs В реальности",
        image: "https://via.placeholder.com/300x250/8B4513/ffffff?text=Building+Fail",
        category: "newbies",
        reactions: {
            laugh: 478,
            cry: 156,
            wow: 234,
            fire: 512
        },
        author: "BuilderPro",
        date: "2024-01-10",
        views: 1870
    }
];

// Инициализация страницы мемов
document.addEventListener('DOMContentLoaded', function() {
    const memesGrid = document.getElementById('memesGrid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const memeModal = document.getElementById('memeModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    // Отображение всех мемов
    displayMemes(memesData);
    
    // Фильтрация по категориям
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            if (category === 'all') {
                displayMemes(memesData);
            } else {
                const filteredMemes = memesData.filter(meme => meme.category === category);
                displayMemes(filteredMemes);
            }
        });
    });
    
    // Функция отображения мемов
    function displayMemes(memes) {
        memesGrid.innerHTML = '';
        
        memes.forEach(meme => {
            const memeCard = createMemeCard(meme);
            memesGrid.appendChild(memeCard);
        });
    }
    
    // Функция создания карточки мема
    function createMemeCard(meme) {
        const card = document.createElement('div');
        card.className = 'meme-card';
        card.dataset.id = meme.id;
        card.dataset.category = meme.category;
        
        const totalReactions = Object.values(meme.reactions).reduce((a, b) => a + b, 0);
        
        card.innerHTML = `
            <img src="${meme.image}" alt="${meme.title}" class="meme-image">
            <div class="meme-info">
                <h3 class="meme-title">${meme.title}</h3>
                <p class="meme-description">${meme.description}</p>
                <div class="meme-reactions">
                    <div class="reaction-buttons">
                        <button class="reaction-btn" data-emoji="😂" data-meme="${meme.id}">
                            😂 ${meme.reactions.laugh}
                        </button>
                        <button class="reaction-btn" data-emoji="😭" data-meme="${meme.id}">
                            😭 ${meme.reactions.cry}
                        </button>
                        <button class="reaction-btn" data-emoji="🔥" data-meme="${meme.id}">
                            🔥 ${meme.reactions.fire}
                        </button>
                    </div>
                    <span class="meme-stats">👁️ ${meme.views}</span>
                </div>
                <div class="meme-author">
                    <img src="images/avatar.jpg" alt="${meme.author}" class="author-avatar">
                    <span class="author-name">${meme.author}</span>
                    <span class="meme-date">${formatDate(meme.date)}</span>
                </div>
            </div>
        `;
        
        // Клик по картинке для открытия модального окна
        const memeImage = card.querySelector('.meme-image');
        memeImage.addEventListener('click', () => openMemeModal(meme));
        
        // Обработчики для кнопок реакций
        const reactionButtons = card.querySelectorAll('.reaction-btn');
        reactionButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const emoji = this.dataset.emoji;
                const memeId = parseInt(this.dataset.meme);
                reactToMeme(memeId, emoji, this);
            });
        });
        
        return card;
    }
    
    // Открытие модального окна
    function openMemeModal(meme) {
        modalImage.src = meme.image;
        modalImage.alt = meme.title;
        modalTitle.textContent = meme.title;
        modalDescription.textContent = meme.description;
        memeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие модального окна
    modalClose.addEventListener('click', closeMemeModal);
    
    memeModal.addEventListener('click', function(e) {
        if (e.target === memeModal) {
            closeMemeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMemeModal();
        }
    });
    
    function closeMemeModal() {
        memeModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Реакция на мем
    function reactToMeme(memeId, emoji, buttonElement) {
        const meme = memesData.find(m => m.id === memeId);
        
        if (meme) {
            // Увеличиваем счетчик реакции
            if (emoji === '😂') meme.reactions.laugh++;
            if (emoji === '😭') meme.reactions.cry++;
            if (emoji === '🔥') meme.reactions.fire++;
            if (emoji === '😲') meme.reactions.wow++;
            
            // Обновляем текст кнопки
            const currentText = buttonElement.textContent;
            const newCount = parseInt(currentText.match(/\d+/)[0]) + 1;
            buttonElement.innerHTML = `${emoji} ${newCount}`;
            
            // Анимация
            buttonElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                buttonElement.style.transform = 'scale(1)';
            }, 300);
            
            // Сохраняем в localStorage
            saveReaction(memeId, emoji);
        }
    }
    
    // Сохранение реакции в localStorage
    function saveReaction(memeId, emoji) {
        let reactions = JSON.parse(localStorage.getItem('memeReactions') || '{}');
        reactions[memeId] = emoji;
        localStorage.setItem('memeReactions', JSON.stringify(reactions));
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Сегодня';
        if (diffDays === 1) return 'Вчера';
        if (diffDays < 7) return `${diffDays} дня назад`;
        
        return date.toLocaleDateString('ru-RU');
    }
    
    // Загрузка сохраненных реакций
    function loadSavedReactions() {
        const savedReactions = JSON.parse(localStorage.getItem('memeReactions') || '{}');
        return savedReactions;
    }
    
    // Инициализация загруженных реакций
    const savedReactions = loadSavedReactions();
    console.log('Загруженные реакции:', savedReactions);
});