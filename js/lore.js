document.addEventListener('DOMContentLoaded', function() {
    console.log('Лор Minecraft загружен!');
    
    // Анимация временной шкалы
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Интерактивные элементы
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            const characterName = this.querySelector('.character-name').textContent;
            const characterDesc = this.querySelector('.character-description').textContent;
            
            // Создаем модальное окно с деталями
            showCharacterDetails(characterName, characterDesc);
        });
    });
    
    // Загрузка дополнительного лора (можно расширить)
    fetchLoreData();
});

// Функция показа деталей персонажа
function showCharacterDetails(name, description) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            border: 3px solid var(--mc-green);
            color: var(--mc-white);
        ">
            <h2 style="color: var(--mc-green); margin-bottom: 1rem;">${name}</h2>
            <p style="color: var(--mc-light-gray); line-height: 1.6; margin-bottom: 1.5rem;">
                ${description}
            </p>
            <p style="color: var(--mc-gray); font-size: 0.9rem; margin-bottom: 1.5rem;">
                ⚡ Интересный факт: Эта информация основана на фанатских теориях и наблюдениях игроков.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                style="
                    background: var(--mc-green);
                    color: var(--mc-black);
                    border: none;
                    padding: 0.5rem;
                    cursor: pointer;
                    font-weight: bold;
                ">
                Закрыть
            </button>
        </div>`;
    
    document.body.appendChild(modal);
}
