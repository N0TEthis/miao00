// Анимация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Minecraft Meme Universe загружен!');
    
    // Анимация для карточек
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Случайный мем дня
    const memeImages = [
        'images/memes/meme1.jpg',
        'images/memes/meme2.jpg',
        'images/memes/meme3.jpg'
    ];
    
    const memeCaptions = [
        '"Когда говоришь другу "не трогай свинью", а он делает зелье скорости"',
        '"Ты после того, как потратил 2 часа на постройку дома, а крипер всё равно взорвал его"',
        '"Мой инвентарь: 64 булыжника, 3 гнилые плоти и чувство разочарования"'
    ];
    
    // Обновляем мем дня каждый день
    const today = new Date().getDate();
    const memeIndex = today % memeImages.length;
    
    const memeImg = document.querySelector('.meme-img');
    const memeCaption = document.querySelector('.meme-caption p');
    
    if (memeImg && memeCaption) {
        memeImg.src = memeImages[memeIndex];
        memeCaption.textContent = memeCaptions[memeIndex];
    }
    
    // Интерактивные элементы
    const blocks = document.querySelectorAll('.minecraft-block');
    blocks.forEach(block => {
        block.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
            this.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
            
            // Звуковой эффект (закомментировано, можно добавить звук)
            // const audio = new Audio('sounds/mine.mp3');
            // audio.play();
        });
    });
    
    // Темная/светлая тема (опционально)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.position = 'fixed';
    themeToggle.style.bottom = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.padding = '10px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.backgroundColor = 'var(--mc-green)';
    themeToggle.style.color = 'var(--mc-black)';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        this.innerHTML = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    });
});