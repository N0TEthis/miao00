// Интерактивные гайды для Minecraft

class InteractiveGuides {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.inventory = {};
        this.xp = 0;
        this.level = 1;
        this.achievements = new Set();
        this.settings = {
            sound: true,
            animations: true,
            hints: true
        };
        this.gameState = {
            resources: {},
            building: [],
            farm: {},
            quizAnswers: {}
        };
    }

    init() {
        console.log('🎮 Интерактивные гайды инициализированы!');
        
        this.initFloatingMenu();
        this.initInventory();
        this.initBuildingSimulator();
        this.initFarmingSimulator();
        this.initQuiz();
        this.initAchievements();
        this.loadProgress();
        this.updateUI();
        
        // Показываем приветственное сообщение
        setTimeout(() => this.showNotification('🎮 Добро пожаловать в интерактивные гайды!', 'info'), 1000);
    }

    // ===== ПЛАВАЮЩЕЕ МЕНЮ =====
    initFloatingMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuContent = document.getElementById('menuContent');
        const menuClose = document.getElementById('menuClose');
        
        if (menuToggle && menuContent) {
            menuToggle.addEventListener('click', () => {
                menuContent.classList.toggle('open');
                menuToggle.classList.toggle('active');
            });
            
            if (menuClose) {
                menuClose.addEventListener('click', () => {
                    menuContent.classList.remove('open');
                    menuToggle.classList.remove('active');
                });
            }
            
            // Закрытие при клике вне меню
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !menuContent.contains(e.target)) {
                    menuContent.classList.remove('open');
                    menuToggle.classList.remove('active');
                }
            });
        }
        
        // Переключение темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Переключение звука
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound());
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('mcTheme', isDark ? 'dark' : 'light');
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = isDark ? '☀️' : '🌙';
        }
        
        this.showNotification(`Тема изменена: ${isDark ? 'Темная' : 'Светлая'}`, 'success');
    }

    toggleSound() {
        this.settings.sound = !this.settings.sound;
        const soundIcon = document.querySelector('.sound-icon');
        if (soundIcon) {
            soundIcon.textContent = this.settings.sound ? '🔊' : '🔇';
        }
        
        this.showNotification(`Звук ${this.settings.sound ? 'включен' : 'выключен'}`, 'info');
        this.saveSettings();
    }

    // ===== ИНВЕНТАРЬ И РЕСУРСЫ =====
    initInventory() {
        // Инициализация базовых ресурсов
        this.gameState.resources = {
            wood: 0,
            stone: 0,
            food: 0,
            water: 0
        };
        
        this.updateInventoryDisplay();
        
        // Обработчики для сбора ресурсов
        document.querySelectorAll('.world-element.interactive').forEach(element => {
            element.addEventListener('click', (e) => {
                const resource = e.currentTarget.classList[1]; // tree, stone, etc
                this.collectResource(resource);
            });
        });
    }

    collectResource(resource) {
        const resourceMap = {
            'tree': 'wood',
            'stone': 'stone',
            'animal': 'food',
            'water': 'water'
        };
        
        const resourceType = resourceMap[resource];
        if (resourceType) {
            this.gameState.resources[resourceType]++;
            this.addXP(5);
            
            // Обновляем отображение
            this.updateResourceCount(resourceType);
            this.updateInventoryDisplay();
            
            // Проверяем выполнение требований
            this.checkStepRequirements();
            
            // Воспроизводим звук
            this.playSound('collect');
            
            // Анимация
            const element = document.querySelector(`.world-element.${resource}`);
            if (element) {
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 500);
            }
            
            this.showNotification(`Собрано: ${this.getResourceName(resourceType)}`, 'success');
        }
    }

    updateResourceCount(resourceType) {
        const requirements = document.querySelectorAll('.requirement-item');
        requirements.forEach(req => {
            const item = req.dataset.item;
            if (item === resourceType) {
                const required = parseInt(req.dataset.required);
                const current = this.gameState.resources[resourceType];
                const countSpan = req.querySelector('.req-count');
                
                if (countSpan) {
                    countSpan.textContent = `${current}/${required}`;
                    
                    if (current >= required) {
                        req.classList.add('completed');
                    }
                }
            }
        });
    }

    checkStepRequirements() {
        const requirements = document.querySelectorAll('.requirement-item');
        let allCompleted = true;
        
        requirements.forEach(req => {
            const item = req.dataset.item;
            const required = parseInt(req.dataset.required);
            const current = this.gameState.resources[item] || 0;
            
            if (current < required) {
                allCompleted = false;
            }
        });
        
        const completeBtn = document.querySelector('.step-btn');
        if (completeBtn) {
            completeBtn.disabled = !allCompleted;
        }
    }

    // ===== СИМУЛЯТОР СТРОИТЕЛЬСТВА =====
    initBuildingSimulator() {
        this.initBlockPalette();
        this.initBuildingGrid();
        this.startBuildingTimer();
    }

    initBlockPalette() {
        const palette = document.getElementById('blockPalette');
        if (!palette) return;
        
        const blocks = [
            { id: 'grass', icon: '🟩', name: 'Трава' },
            { id: 'dirt', icon: '🟫', name: 'Земля' },
            { id: 'stone', icon: '🪨', name: 'Камень' },
            { id: 'wood', icon: '🪵', name: 'Дерево' },
            { id: 'brick', icon: '🧱', name: 'Кирпич' },
            { id: 'glass', icon: '🔲', name: 'Стекло' }
        ];
        
        palette.innerHTML = blocks.map(block => `
            <div class="block-option" data-block="${block.id}" onclick="guides.selectBlock('${block.id}')">
                <span class="block-icon">${block.icon}</span>
                <span class="block-name">${block.name}</span>
            </div>
        `).join('');
        
        // Выбираем первый блок по умолчанию
        this.selectedBlock = 'grass';
        document.querySelector(`[data-block="${this.selectedBlock}"]`).classList.add('selected');
    }

    initBuildingGrid() {
        const grid = document.getElementById('buildingGrid');
        if (!grid) return;
        
        // Создаем сетку 10x10
        grid.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.placeBlock(i));
            grid.appendChild(cell);
        }
    }

    selectBlock(blockId) {
        this.selectedBlock = blockId;
        
        // Убираем выделение со всех блоков
        document.querySelectorAll('.block-option').forEach(block => {
            block.classList.remove('selected');
        });
        
        // Выделяем выбранный блок
        const selectedBlock = document.querySelector(`[data-block="${blockId}"]`);
        if (selectedBlock) {
            selectedBlock.classList.add('selected');
        }
        
        this.showNotification(`Выбран блок: ${this.getBlockName(blockId)}`, 'info');
    }

    selectTool(tool) {
        // Убираем активный класс со всех инструментов
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс выбранному инструменту
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }
        
        this.currentTool = tool;
        this.showNotification(`Инструмент: ${this.getToolName(tool)}`, 'info');
    }

    placeBlock(index) {
        if (!this.selectedBlock) return;
        
        const cell = document.querySelector(`.grid-cell[data-index="${index}"]`);
        if (!cell) return;
        
        if (this.currentTool === 'break') {
            // Ломаем блок
            cell.classList.remove('placed');
            cell.style.background = '';
            cell.textContent = '';
            this.gameState.building[index] = null;
        } else if (this.currentTool === 'place') {
            // Ставим блок
            const block = this.selectedBlock;
            cell.classList.add('placed');
            cell.style.background = this.getBlockColor(block);
            cell.textContent = this.getBlockIcon(block);
            this.gameState.building[index] = block;
            
            // Обновляем статистику
            this.updateBuildingStats();
            this.addXP(2);
        }
        
        this.updateBuildingPreview();
    }

    updateBuildingStats() {
        const blocksUsed = this.gameState.building.filter(Boolean).length;
        document.getElementById('blocksUsed').textContent = blocksUsed;
        
        if (blocksUsed >= 20) {
            this.unlockAchievement('builder');
        }
    }

    startBuildingTimer() {
        let seconds = 0;
        this.buildingTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('buildingTime').textContent = 
                `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    clearBuilding() {
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('placed');
            cell.style.background = '';
            cell.textContent = '';
        });
        
        this.gameState.building = [];
        this.updateBuildingStats();
        this.updateBuildingPreview();
        this.showNotification('Постройка очищена!', 'warning');
    }

    updateBuildingPreview() {
        const preview = document.getElementById('previewArea');
        if (!preview) return;
        
        const building = this.gameState.building;
        let previewHTML = '';
        
        // Создаем упрощенное превью
        for (let i = 0; i < 100; i += 10) {
            const row = building.slice(i, i + 10);
            const rowHTML = row.map(block => 
                block ? this.getBlockIcon(block) : '⬜'
            ).join('');
            previewHTML += `<div>${rowHTML}</div>`;
        }
        
        preview.innerHTML = previewHTML;
    }

    // ===== СИМУЛЯТОР ФЕРМЕРСТВА =====
    initFarmingSimulator() {
        this.initFarmLand();
        this.initFarmInventory();
        this.startFarmTimer();
    }

    initFarmLand() {
        const land = document.getElementById('farmLand');
        if (!land) return;
        
        land.innerHTML = '';
        for (let i = 0; i < 36; i++) {
            const plot = document.createElement('div');
            plot.className = 'farm-plot';
            plot.dataset.index = i;
            plot.addEventListener('click', () => this.useFarmPlot(i));
            land.appendChild(plot);
        }
    }

    initFarmInventory() {
        this.gameState.farm = {
            seeds: 10,
            water: 5,
            crops: 0,
            money: 100,
            day: 1
        };
        
        this.updateFarmInventory();
    }

    selectFarmTool(tool) {
        this.farmTool = tool;
        
        // Убираем активный класс со всех инструментов
        document.querySelectorAll('.farm-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс выбранному инструменту
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }
        
        this.showNotification(`Инструмент фермера: ${this.getFarmToolName(tool)}`, 'info');
    }

    useFarmPlot(index) {
        const plot = document.querySelector(`.farm-plot[data-index="${index}"]`);
        if (!plot || !this.farmTool) return;
        
        switch (this.farmTool) {
            case 'hoe':
                if (!plot.classList.contains('plowed')) {
                    plot.classList.add('plowed');
                    plot.textContent = '🪓';
                    this.addXP(3);
                    this.showNotification('Земля вспахана!', 'success');
                }
                break;
                
            case 'seed':
                if (plot.classList.contains('plowed') && !plot.classList.contains('planted')) {
                    if (this.gameState.farm.seeds > 0) {
                        plot.classList.remove('plowed');
                        plot.classList.add('planted');
                        plot.textContent = '🌱';
                        this.gameState.farm.seeds--;
                        this.addXP(5);
                        this.showNotification('Семена посажены!', 'success');
                        this.updateFarmInventory();
                    } else {
                        this.showNotification('Недостаточно семян!', 'error');
                    }
                }
                break;
                
            case 'water':
                if (plot.classList.contains('planted')) {
                    plot.textContent = '💧';
                    this.gameState.farm.water--;
                    this.addXP(2);
                    this.showNotification('Растение полито!', 'success');
                    this.updateFarmInventory();
                    
                    // Через 2 секунды превращаем в созревшее растение
                    setTimeout(() => {
                        if (plot.classList.contains('planted')) {
                            plot.textContent = '🌽';
                            plot.classList.add('ready');
                        }
                    }, 2000);
                }
                break;
                
            case 'harvest':
                if (plot.classList.contains('ready')) {
                    plot.classList.remove('planted', 'ready');
                    plot.textContent = '';
                    this.gameState.farm.crops++;
                    this.gameState.farm.money += 10;
                    this.addXP(10);
                    this.showNotification('Урожай собран! +10💰', 'success');
                    this.updateFarmInventory();
                    
                    if (this.gameState.farm.crops >= 5) {
                        this.unlockAchievement('farmer');
                    }
                }
                break;
        }
    }

    updateFarmInventory() {
        document.getElementById('harvestCount').textContent = this.gameState.farm.crops;
        document.getElementById('moneyCount').textContent = `${this.gameState.farm.money} 💰`;
        document.getElementById('dayCount').textContent = this.gameState.farm.day;
        
        // Обновляем список предметов
        const farmItems = document.getElementById('farmItems');
        if (farmItems) {
            farmItems.innerHTML = `
                <div class="farm-item">
                    <span class="item-icon">🌱</span>
                    <span class="item-count">${this.gameState.farm.seeds}</span>
                </div>
                <div class="farm-item">
                    <span class="item-icon">💧</span>
                    <span class="item-count">${this.gameState.farm.water}</span>
                </div>
                <div class="farm-item">
                    <span class="item-icon">🌽</span>
                    <span class="item-count">${this.gameState.farm.crops}</span>
                </div>
            `;
        }
    }

    startFarmTimer() {
        this.farmTimer = setInterval(() => {
            this.gameState.farm.day++;
            this.updateFarmInventory();
            
            // Каждый 5-й день добавляем семена
            if (this.gameState.farm.day % 5 === 0) {
                this.gameState.farm.seeds += 5;
                this.showNotification('Получены новые семена!', 'info');
                this.updateFarmInventory();
            }
        }, 60000); // 1 минута = 1 день
    }

    // ===== ИНТЕРАКТИВНЫЙ КВИЗ =====
    initQuiz() {
        this.quizQuestions = [
            {
                question: "Что нужно сделать в первую ночь в Minecraft?",
                options: [
                    "Построить стеклянный дом",
                    "Найти укрытие и сделать факелы",
                    "Отправиться исследовать пещеры"
                ],
                correct: 1
            },
            {
                question: "Какой инструмент лучше всего подходит для добычи алмазов?",
                options: [
                    "Деревянная кирка",
                    "Железная кирка",
                    "Каменная кирка"
                ],
                correct: 1
            },
            {
                question: "Где лучше всего искать алмазы?",
                options: [
                    "На поверхности",
                    "На уровне моря",
                    "На глубине Y=12"
                ],
                correct: 2
            }
        ];
        
        this.currentQuizQuestion = 0;
        this.quizScore = 0;
        
        this.initQuizUI();
    }

    initQuizUI() {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer) return;
        
        // Обновляем общее количество вопросов
        document.getElementById('totalQuestions').textContent = this.quizQuestions.length;
        
        // Показываем первый вопрос
        this.showQuizQuestion(0);
    }

    showQuizQuestion(index) {
        if (index >= this.quizQuestions.length) {
            this.showQuizResults();
            return;
        }
        
        // Скрываем все вопросы
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // Показываем текущий вопрос
        const questionId = `quizQuestion${index + 1}`;
        const questionElement = document.getElementById(questionId);
        if (questionElement) {
            questionElement.classList.add('active');
        }
        
        // Обновляем прогресс
        document.getElementById('currentQuestion').textContent = index + 1;
        const progress = ((index) / this.quizQuestions.length) * 100;
        document.getElementById('quizProgress').style.width = `${progress}%`;
        
        this.currentQuizQuestion = index;
    }

    selectAnswer(element, answer) {
        // Убираем выделение со всех вариантов
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Выделяем выбранный вариант
        element.classList.add('selected');
        
        // Проверяем ответ
        const question = this.quizQuestions[this.currentQuizQuestion];
        const isCorrect = answer === String.fromCharCode(97 + question.correct); // 'a', 'b', 'c'
        
        if (isCorrect) {
            this.quizScore++;
            this.addXP(20);
            this.showNotification('✅ Правильно! +20 XP', 'success');
        } else {
            this.showNotification('❌ Неправильно!', 'error');
        }
        
        // Автоматически переходим к следующему вопросу через 1.5 секунды
        setTimeout(() => {
            this.showQuizQuestion(this.currentQuizQuestion + 1);
        }, 1500);
    }

    showQuizResults() {
        // Скрываем вопросы
        document.querySelectorAll('.quiz-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // Показываем результаты
        const results = document.getElementById('quizResults');
        if (results) {
            results.style.display = 'block';
            
            document.getElementById('correctAnswers').textContent = 
                `${this.quizScore}/${this.quizQuestions.length}`;
            
            const earnedXP = this.quizScore * 20;
            document.getElementById('earnedXP').textContent = `${earnedXP} XP`;
            
            const percentage = (this.quizScore / this.quizQuestions.length) * 100;
            let level = 'Новичок';
            if (percentage >= 80) level = 'Эксперт';
            else if (percentage >= 60) level = 'Опытный';
            else if (percentage >= 40) level = 'Любитель';
            
            document.getElementById('knowledgeLevel').textContent = level;
            
            if (percentage >= 80) {
                this.unlockAchievement('quiz_master');
            }
        }
    }

    retryQuiz() {
        this.quizScore = 0;
        this.currentQuizQuestion = 0;
        
        // Скрываем результаты
        const results = document.getElementById('quizResults');
        if (results) {
            results.style.display = 'none';
        }
        
        // Сбрасываем выбор
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Показываем первый вопрос
        this.showQuizQuestion(0);
        
        this.showNotification('🔄 Квиз начат заново!', 'info');
    }

    // ===== ДОСТИЖЕНИЯ И ПРОГРЕСС =====
    initAchievements() {
        this.achievementsList = [
            { id: 'first_steps', name: 'Первые шаги', description: 'Завершить первый шаг', icon: '👣' },
            { id: 'collector', name: 'Коллекционер', description: 'Собрать все ресурсы', icon: '🎒' },
            { id: 'builder', name: 'Строитель', description: 'Использовать 20 блоков', icon: '🏗️' },
            { id: 'farmer', name: 'Фермер', description: 'Собрать 5 урожаев', icon: '🌾' },
            { id: 'quiz_master', name: 'Мастер квиза', description: 'Набрать 80% в квизе', icon: '🧠' },
            { id: 'level_5', name: 'Опытный игрок', description: 'Достичь 5 уровня', icon: '⭐' }
        ];
        
        this.updateAchievementsDisplay();
    }

    unlockAchievement(achievementId) {
        if (!this.achievements.has(achievementId)) {
            this.achievements.add(achievementId);
            this.addXP(50);
            this.updateAchievementsDisplay();
            
            const achievement = this.achievementsList.find(a => a.id === achievementId);
            if (achievement) {
                this.showNotification(`🏆 Открыто достижение: ${achievement.name}! +50 XP`, 'success');
                
                // Анимация
                const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
                if (achievementElement) {
                    achievementElement.classList.add('pulse');
                    setTimeout(() => achievementElement.classList.remove('pulse'), 2000);
                }
            }
            
            this.saveProgress();
        }
    }

    updateAchievementsDisplay() {
        const list = document.getElementById('achievementsList');
        if (!list) return;
        
        list.innerHTML = this.achievementsList.map(achievement => {
            const unlocked = this.achievements.has(achievement.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : 'locked'}" 
                     data-achievement="${achievement.id}">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    addXP(amount) {
        this.xp += amount;
        
        // Проверяем повышение уровня
        const xpForNextLevel = this.level * 100;
        if (this.xp >= xpForNextLevel) {
            this.xp -= xpForNextLevel;
            this.level++;
            this.showNotification(`🎉 Уровень повышен! Текущий уровень: ${this.level}`, 'success');
            
            if (this.level >= 5) {
                this.unlockAchievement('level_5');
            }
        }
        
        this.updateXPBar();
        this.saveProgress();
    }

    updateXPBar() {
        const xpForNextLevel = this.level * 100;
        const xpPercent = (this.xp / xpForNextLevel) * 100;
        
        document.getElementById('xpFill').style.width = `${xpPercent}%`;
        document.getElementById('xpText').textContent = `Уровень ${this.level}`;
        document.getElementById('xpCount').textContent = `${this.xp} XP`;
        
        // Обновляем процент выполнения
        const totalSteps = this.totalSteps;
        const completedSteps = Math.min(this.currentStep - 1, totalSteps);
        const completionRate = Math.round((completedSteps / totalSteps) * 100);
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
    updateUI() {
        this.updateXPBar();
        this.updateTimeSpent();
    }

    updateTimeSpent() {
        // Простое отслеживание времени
        let minutes = 0;
        setInterval(() => {
            minutes++;
            document.getElementById('timeSpent').textContent = `${minutes}м`;
        }, 60000); // Обновляем каждую минуту
    }

    updateInventoryDisplay() {
        const grid = document.getElementById('inventoryGrid');
        if (!grid) return;
        
        const resources = this.gameState.resources;
        grid.innerHTML = '';
        
        Object.entries(resources).forEach(([resource, count]) => {
            if (count > 0) {
                const slot = document.createElement('div');
                slot.className = 'inventory-slot';
                slot.innerHTML = `
                    <span class="slot-icon">${this.getResourceIcon(resource)}</span>
                    <span class="slot-count">${count}</span>
                `;
                grid.appendChild(slot);
            }
        });
    }

    playSound(sound) {
        if (!this.settings.sound) return;
        
        // Простая имитация звуков через Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Разные звуки для разных действий
            switch(sound) {
                case 'collect':
                    oscillator.frequency.value = 800;
                    break;
                case 'craft':
                    oscillator.frequency.value = 1200;
                    break;
                case 'achievement':
                    oscillator.frequency.value = 1500;
                    break;
                default:
                    oscillator.frequency.value = 1000;
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Звук не поддерживается:', e);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    getResourceName(resource) {
        const names = {
            'wood': 'Дерево',
            'stone': 'Камень',
            'food': 'Еда',
            'water': 'Вода'
        };
        return names[resource] || resource;
    }

    getResourceIcon(resource) {
        const icons = {
            'wood': '🌳',
            'stone': '🪨',
            'food': '🍖',
            'water': '💧'
        };
        return icons[resource] || '❓';
    }

    getBlockName(block) {
        const names = {
            'grass': 'Трава',
            'dirt': 'Земля',
            'stone': 'Камень',
            'wood': 'Дерево',
            'brick': 'Кирпич',
            'glass': 'Стекло'
        };
        return names[block] || block;
    }

    getBlockIcon(block) {
        const icons = {
            'grass': '🟩',
            'dirt': '🟫',
            'stone': '🪨',
            'wood': '🪵',
            'brick': '🧱',
            'glass': '🔲'
        };
        return icons[block] || '⬜';
    }

    getBlockColor(block) {
        const colors = {
            'grass': '#7CFC00',
            'dirt': '#8B4513',
            'stone': '#808080',
            'wood': '#8B4513',
            'brick': '#B22222',
            'glass': '#87CEEB'
        };
        return colors[block] || '#FFFFFF';
    }

    getToolName(tool) {
        const names = {
            'place': 'Размещение',
            'break': 'Разрушение',
            'paint': 'Покраска',
            'clear': 'Очистка'
        };
        return names[tool] || tool;
    }

    getFarmToolName(tool) {
        const names = {
            'hoe': 'Мотыга',
            'seed': 'Семена',
            'water': 'Лейка',
            'harvest': 'Сбор урожая'
        };
        return names[tool] || tool;
    }

    // ===== СОХРАНЕНИЕ И ЗАГРУЗКА =====
    saveProgress() {
        const progress = {
            xp: this.xp,
            level: this.level,
            achievements: Array.from(this.achievements),
            settings: this.settings,
            gameState: this.gameState,
            timestamp: Date.now()
        };
        
        localStorage.setItem('mcGuidesProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('mcGuidesProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.xp = progress.xp || 0;
                this.level = progress.level || 1;
                this.achievements = new Set(progress.achievements || []);
                this.settings = progress.settings || this.settings;
                this.gameState = progress.gameState || this.gameState;
                
                console.log('Прогресс загружен:', progress);
                this.showNotification('Прогресс загружен!', 'success');
            } catch (e) {
                console.error('Ошибка загрузки прогресса:', e);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('mcGuidesSettings', JSON.stringify(this.settings));
    }

    // ===== ПУБЛИЧНЫЕ МЕТОДЫ ДЛЯ HTML =====
    completeStep(step) {
        if (step === 1) {
            this.unlockAchievement('first_steps');
            this.addXP(30);
            this.showNotification('🎉 Первый шаг завершен! +30 XP', 'success');
            
            // Переходим к следующему шагу
            setTimeout(() => {
                document.getElementById('step1').classList.remove('active');
                document.getElementById('step2').classList.add('active');
                this.currentStep = 2;
                
                // Обновляем прогресс трекер
                document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
                    if (index < this.currentStep) {
                        stepEl.classList.add('active');
                    } else {
                        stepEl.classList.remove('active');
                    }
                });
                
                this.updateUI();
            }, 1000);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showNotification(`Шаг ${this.currentStep}`, 'info');
            this.updateUI();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showNotification(`Шаг ${this.currentStep}`, 'info');
            this.updateUI();
        }
    }

    saveBuilding() {
        const buildingData = {
            blocks: this.gameState.building,
            timestamp: Date.now(),
            blocksUsed: this.gameState.building.filter(Boolean).length
        };
        
        localStorage.setItem('mcBuilding', JSON.stringify(buildingData));
        this.showNotification('🏠 Постройка сохранена!', 'success');
    }

    shareBuilding() {
        if (navigator.share) {
            navigator.share({
                title: 'Моя Minecraft постройка',
                text: 'Посмотрите что я построил в Minecraft гайдах!',
                url: window.location.href
            });
        } else {
            this.showNotification('📋 Ссылка скопирована в буфер обмена!', 'info');
            navigator.clipboard.writeText(window.location.href);
        }
    }

    startChallenge(challenge) {
        this.showNotification(`🏆 Начато задание: ${challenge}`, 'info');
        
        switch(challenge) {
            case 'house':
                // Сброс и подготовка к строительству дома
                this.clearBuilding();
                setTimeout(() => {
                    this.showNotification('Задание: Постройте дом с 4 стенами и крышей!', 'info');
                }, 1000);
                break;
                
            case 'tower':
                this.clearBuilding();
                setTimeout(() => {
                    this.showNotification('Задание: Постройте башню высотой минимум 5 блоков!', 'info');
                }, 1000);
                break;
        }
    }

    startFarmingTutorial() {
        this.showNotification('🌾 Начато обучение фермерству!', 'info');
        
        // Пошаговое обучение
        const steps = [
            'Шаг 1: Взрыхлите землю мотыгой',
            'Шаг 2: Посадите семена',
            'Шаг 3: Полейте растения',
            'Шаг 4: Соберите урожай'
        ];
        
        let currentStep = 0;
        const tutorialInterval = setInterval(() => {
            if (currentStep < steps.length) {
                this.showNotification(steps[currentStep], 'info');
                currentStep++;
            } else {
                clearInterval(tutorialInterval);
                this.showNotification('🎓 Обучение завершено!', 'success');
            }
        }, 3000);
    }

    showRandomTip() {
        const tips = [
            '💡 Совет: Алмазы ищут на уровне Y=12!',
            '🎮 Совет: Не стройте дом из стекла - скелеты!',
            '🏠 Совет: Всегда ставьте дверь в дом!',
            '⛏️ Совет: Используйте правильные кирки для руд!',
            '💎 Совет: Алмазная кирка самая прочная!',
            '🌙 Совет: Первая ночь самая опасная!',
            '🎯 Совет: Факелы отпугивают мобов!'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        this.showNotification(randomTip, 'info');
    }

    startInteractiveTutorial() {
        this.showNotification('🎮 Запущен интерактивный туториал!', 'info');
        
        // Простой туториал по кликам
        const elements = document.querySelectorAll('.interactive');
        if (elements.length > 0) {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            randomElement.classList.add('bounce');
            
            this.showNotification('Попробуйте кликнуть на подсвеченный элемент!', 'info');
            
            setTimeout(() => {
                randomElement.classList.remove('bounce');
            }, 3000);
        }
    }

    openMemeGenerator() {
        this.showNotification('😂 Генератор мемов скоро будет доступен!', 'info');
    }

    openInventorySimulator() {
        document.getElementById('inventoryModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
    }

    openRecipeBook() {
        this.showNotification('📖 Книга рецептов скоро будет доступна!', 'info');
    }

    openProgressTracker() {
        const completionRate = Math.round((this.currentStep - 1) / this.totalSteps * 100);
        const message = `
            📊 Ваш прогресс:
            Уровень: ${this.level}
            XP: ${this.xp}
            Достижений: ${this.achievements.size}/${this.achievementsList.length}
            Выполнено: ${completionRate}%
        `;
        
        this.showNotification(message, 'info');
    }

    showHelp() {
        document.getElementById('helpModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.getElementById('modalOverlay').classList.remove('active');
    }

    startQuickGuide() {
        this.showNotification('⚡ Быстрый старт начат!', 'info');
        
        // Автоматическое прохождение первых шагов
        const quickSteps = [
            'Собираем дерево...',
            'Собираем камень...',
            'Создаем инструменты...',
            'Строим убежище...'
        ];
        
        let step = 0;
        const quickInterval = setInterval(() => {
            if (step < quickSteps.length) {
                this.showNotification(quickSteps[step], 'info');
                step++;
                
                if (step === 2) {
                    this.gameState.resources.wood = 5;
                    this.gameState.resources.stone = 3;
                    this.updateInventoryDisplay();
                    this.checkStepRequirements();
                }
            } else {
                clearInterval(quickInterval);
                this.showNotification('🎉 Быстрый старт завершен!', 'success');
                this.addXP(50);
            }
        }, 2000);
    }

    openChecklist() {
        const checklist = `
            ✅ Чек-лист для новичка:
            
            1. Собрать дерево (5 шт)
            2. Собрать камень (3 шт)
            3. Создать верстак
            4. Сделать кирку
            5. Построить убежище
            6. Сделать факелы
            7. Пережить первую ночь!
            
            Ваш прогресс: ${this.currentStep-1}/${this.totalSteps} шагов
        `;
        
        this.showNotification(checklist, 'info');
    }

    shareGuide() {
        if (navigator.share) {
            navigator.share({
                title: 'Интерактивные Minecraft Гайды',
                text: 'Попробуй эти крутые интерактивные гайды по Minecraft!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('📋 Ссылка скопирована! Поделись с друзьями!', 'success');
        }
    }

    startVoiceGuide() {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = 'Добро пожаловать в интерактивные Minecraft гайды! Нажимайте на элементы, чтобы учиться весело!';
            speech.lang = 'ru-RU';
            speech.rate = 1;
            
            window.speechSynthesis.speak(speech);
            this.showNotification('🔊 Озвучка запущена!', 'info');
        } else {
            this.showNotification('❌ Озвучка не поддерживается вашим браузером', 'error');
        }
    }

    showCompletionStats() {
        const stats = `
            📈 Статистика выполнения:
            
            Шагов выполнено: ${this.currentStep-1}/${this.totalSteps}
            XP заработано: ${this.xp}
            Достижений: ${this.achievements.size}
            Уровень: ${this.level}
        `;
        
        this.showNotification(stats, 'info');
    }

    showXpStats() {
        const xpForNextLevel = this.level * 100;
        const stats = `
            ⭐ Статистика опыта:
            
            Текущий XP: ${this.xp}
            До следующего уровня: ${xpForNextLevel - this.xp}
            Общий прогресс: ${Math.round((this.xp / (xpForNextLevel + this.level * 100)) * 100)}%
        `;
        
        this.showNotification(stats, 'info');
    }

    showTimeStats() {
        const timeSpent = document.getElementById('timeSpent').textContent;
        this.showNotification(`⏱️ Вы провели на сайте: ${timeSpent}`, 'info');
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            
            // Закрываем меню на мобильных
            if (window.innerWidth < 768) {
                document.getElementById('menuContent').classList.remove('open');
                document.getElementById('menuToggle').classList.remove('active');
            }
        }
    }
}

// Инициализация гайдов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.guides = new InteractiveGuides();
    guides.init();
    
    // Глобальные функции для вызова из HTML
    window.scrollToSection = (sectionId) => guides.scrollToSection(sectionId);
    window.showRandomTip = () => guides.showRandomTip();
    window.startInteractiveTutorial = () => guides.startInteractiveTutorial();
    window.openMemeGenerator = () => guides.openMemeGenerator();
    window.openInventorySimulator = () => guides.openInventorySimulator();
    window.openRecipeBook = () => guides.openRecipeBook();
    window.openProgressTracker = () => guides.openProgressTracker();
    window.showHelp = () => guides.showHelp();
    window.closeModal = (modalId) => guides.closeModal(modalId);
    window.startQuickGuide = () => guides.startQuickGuide();
    window.openChecklist = () => guides.openChecklist();
    window.shareGuide = () => guides.shareGuide();
    window.startVoiceGuide = () => guides.startVoiceGuide();
    window.showCompletionStats = () => guides.showCompletionStats();
    window.showXpStats = () => guides.showXpStats();
    window.showTimeStats = () => guides.showTimeStats();
    window.completeStep = (step) => guides.completeStep(step);
    window.prevStep = () => guides.prevStep();
    window.nextStep = () => guides.nextStep();
    window.selectBlock = (blockId) => guides.selectBlock(blockId);
    window.selectTool = (tool) => guides.selectTool(tool);
    window.placeBlock = (index) => guides.placeBlock(index);
    window.clearBuilding = () => guides.clearBuilding();
    window.saveBuilding = () => guides.saveBuilding();
    window.shareBuilding = () => guides.shareBuilding();
    window.startChallenge = (challenge) => guides.startChallenge(challenge);
    window.selectFarmTool = (tool) => guides.selectFarmTool(tool);
    window.useFarmPlot = (index) => guides.useFarmPlot(index);
    window.startFarmingTutorial = () => guides.startFarmingTutorial();
    window.selectAnswer = (element, answer) => guides.selectAnswer(element, answer);
    window.retryQuiz = () => guides.retryQuiz();
    
    // Сохраняем прогресс при закрытии страницы
    window.addEventListener('beforeunload', () => {
        guides.saveProgress();
    });
});