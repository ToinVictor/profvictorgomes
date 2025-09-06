// achievements.js - Sistema principal de conquistas
const achievements = {
    combat: [
        {
            id: 1001,
            title: "Primeiro Sangue",
            description: "Derrote seu primeiro monstro",
            condition: { type: "kill", amount: 1 },
            reward: { stats: { damage: 1 }, coins: 50 },
            hidden: false
        },
        {
            id: 1002,
            title: "Caçador Novato",
            description: "Derrote 50 monstros no total",
            condition: { type: "kill", amount: 50 },
            reward: { stats: { damage: 3 }, coins: 2000 },
            hidden: false
        },
        {
            id: 1003,
            title: "Mestre da Floresta",
            description: "Derrote todos os monstros da Floresta",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Rato Faminto", "Lobo Solitário", "Aranha Gigante", "Urso", "Espírito da Floresta"],
                environment: "floresta"
            },
            reward: { stats: { maxHp: 20 }, title: "Mestre da Floresta" },
            hidden: false
        },
        {
            id: 1004,
            title: "Desafiador do Vulcão",
            description: "Derrote todos os monstros do Vulcão",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Elemental do Fogo", "Salamandra Flamejante", "Demônio Menor", "Fênix Renascida", "Senhor da Lava"],
                environment: "vulcao"
            },
            reward: { stats: { defense: 5 }, title: "Desafiador do Vulcão" },
            hidden: false
        },
        {
            id: 1005,
            title: "Esqueleto Rei",
            description: "Derrote todos os monstros do Castelo",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Cavaleiro Fantasma", "Feiticeiro Sombrio", "Gárgula de Pedra", "Vampiro Nobre", "Lich Real"],
                environment: "vulcao"
            },
            reward: { stats: { defense: 5 , damage: 5}, title: "Desafiador do Castelo" },
            hidden: false
        },
        {
            id: 1006,
            title: "Matador de Dragão",
            description: "Derrote o Dragão da Geleira",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Dragão Glacial"],
                environment: "geleira"
            },
            reward: { stats: { damage: 25, defense: 10, maxHp: 250 }, coins: 500000 },
            hidden: false
        },
        {
            id: 1007,
            title: "Purificador do Abismo",
            description: "Derrote todos os monstros do Abismo",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Kraken das Profundezas", "Leviatã Ancestral", "Devorador de Almas"],
                environment: "abismo"
            },
            reward: { stats: { damage: 30, defense: 15, maxHp: 400 }, coins: 1000000 },
            hidden: false
        },
        {
            id: 1008,
            title: "Tormento Eterno",
            description: "Derrote o Senhor do Tormento 4 vezes",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Senhor do Tormento"],
                environment: "infernal",
                amount: 4
            },
            reward: { stats: { damage: 10, maxHp: 100 }, coins: 1000000 },
            hidden: false
        },
        {
            id: 1009,
            title: "Dia da Confissão",
            description: "Domine o Trono Celestial 6 vezes",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Trono Celestial"],
                environment: "celestial",
                amount: 6
            },
            reward: { stats: { damage: 200, defense: 50, maxHp: 2500 }, coins: 100000000 },
            hidden: false
        },
        {
            id: 1010,
            title: "Batalha Final",
            description: "Derrote a Entidade Cósmica 6 vezes",
            condition: { 
                type: "kill_all_monsters", 
                monsters: ["Entidade Cósmica"],
                environment: "cosmic",
                amount: 6
            },
            reward: { stats: { damage: 500, defense: 250, maxHp: 5000 }, coins: 1000000000 },
            hidden: false
        },
    ],

    progression: [
        {
            id: 2001,
            title: "Novato",
            description: "Alcance o nível 5",
            condition: { type: "reach_level", level: 5 },
            reward: { stats: { maxHp: 10 }, coins: 100 },
            hidden: false
        },
        {
            id: 2002,
            title: "Aventureiro",
            description: "Alcance o nível 15",
            condition: { type: "reach_level", level: 15 },
            reward: { stats: { damage: 5 }, coins: 500 },
            hidden: false
        },
        {
            id: 2003,
            title: "Veterano",
            description: "Alcance o nível 30",
            condition: { type: "reach_level", level: 30 },
            reward: { stats: { maxHp: 30, defense: 5 }, title: "Veterano" },
            hidden: false
        },
        {
            id: 2004,
            title: "Mestre",
            description: "Alcance o nível 50",
            condition: { type: "reach_level", level: 50 },
            reward: { stats: { damage: 10, maxHp: 50 }, title: "Mestre" },
            hidden: false
        },
        {
            id: 2005,
            title: "Mestre II",
            description: "Alcance o nível 60",
            condition: { type: "reach_level", level: 60 },
            reward: { stats: { damage: 25, maxHp: 250, defense: 10}, title: "Mestre II" },
            hidden: false
        },
        {
            id: 2006,
            title: "Desafiante",
            description: "Alcance o nível 70",
            condition: { type: "reach_level", level: 70 },
            reward: { stats: { damage: 50, maxHp: 500, defense: 25}, title: "Desafiante" },
            hidden: false
        },
        {
            id: 2007,
            title: "Desafiante II",
            description: "Alcance o nível 85",
            condition: { type: "reach_level", level: 85 },
            reward: { stats: { damage: 100, maxHp: 1000, defense: 50}, title: "Desafiante II" },
            hidden: false
        },
        {
            id: 2008,
            title: "Lenda Viva",
            description: "Alcance o nível 100",
            condition: { type: "reach_level", level: 100 },
            reward: { stats: { damage: 250, maxHp: 5000, defense: 100 }, title: "Lenda Viva" },
            hidden: true
        }
    ],

    economy: [
        {
            id: 3001,
            title: "Pequeno Empresário",
            description: "Acumule 1.000 moedas",
            condition: { type: "earn_coins", amount: 1000 },
            reward: { coins: 100 },
            hidden: false
        },
        {
            id: 3002,
            title: "Mercador",
            description: "Acumule 10.000 moedas",
            condition: { type: "earn_coins", amount: 10000 },
            reward: { coins: 1000 },
            hidden: false
        },
        {
            id: 3003,
            title: "Magnata",
            description: "Acumule 100.000 moedas",
            condition: { type: "earn_coins", amount: 100000 },
            reward: { stats: { maxHp: 10 }, coins: 5000, title: "Magnata" },
            hidden: false
        },
        {
            id: 3004,
            title: "Rei do Comércio",
            description: "Acumule 1.000.000 moedas",
            condition: { type: "earn_coins", amount: 1000000 },
            reward: { stats: { damage: 10, maxHp: 20 }, title: "Rei do Comércio" },
            hidden: false
        },
        {
            id: 3005,
            title: "Gerente de Banco",
            description: "Acumule 100.000.000 moedas",
            condition: { type: "earn_coins", amount: 100000000 },
            reward: { stats: { damage: 50, maxHp: 500, defense: 25 }, title: "Gerente de Banco" },
            hidden: false
        },
        {
            id: 3006,
            title: "Todo o Ouro do Mundo",
            description: "Acumule 1.000.000.000 moedas",
            condition: { type: "earn_coins", amount: 1000000000 },
            reward: { stats: { damage: 100, maxHp: 5000, defense: 50 }, title: "Todo o Ouro do Mundo" },
            hidden: false
        },
    ],

    equipment: [
        {
            id: 4001,
            title: "Equipado",
            description: "Equipe sua primeira arma",
            condition: { type: "equip_item", itemType: "weapon" },
            reward: { stats: { damage: 2 }, coins: 50 },
            hidden: false
        },
        {
            id: 4002,
            title: "Protegido",
            description: "Equipe sua primeira armadura",
            condition: { type: "equip_item", itemType: "armor" },
            reward: { stats: { defense: 2 }, coins: 50 },
            hidden: false
        },
        {
            id: 4003,
            title: "Arsenal Completo",
            description: "Equipe 5 armas diferentes",
            condition: { type: "equip_items", itemType: "weapon", amount: 5 },
            reward: { stats: { damage: 15 }, title: "Mestre de Armas" },
            hidden: false
        },
         {
            id: 4004,
            title: "Arsenal Completo II",
            description: "Equipe 5 armaduras diferentes",
            condition: { type: "equip_items", itemType: "armor", amount: 5 },
            reward: { stats: { defense: 10 }, title: "Mestre da Defesa" },
            hidden: false
        }
    ],

    exploration: [
        {
            id: 5001,
            title: "Explorador",
            description: "Visite todos os locais de batalha",
            condition: { type: "visit_all_locations" },
            reward: { stats: { maxHp: 5000 }, title: "Explorador" },
            hidden: false
        },
        {
            id: 5002,
            title: "Desbravador",
            description: "Derrote monstros em 5 ambientes diferentes",
            condition: { type: "kill_in_environments", amount: 5 },
            reward: { stats: { defense: 25 }, coins: 1000000 },
            hidden: false
        },
        {
            id: 5003,
            title: "Conquistador",
            description: "Complete todas as conquistas de combate",
            condition: { type: "complete_category", category: "combat" },
            reward: { stats: { damage: 250, maxHp: 5000, defense: 100 }, title: "Conquistador" },
            hidden: true
        },
        {
            id: 5004,
            title: "Completista",
            description: "Complete todas as conquistas do jogo",
            condition: { type: "complete_all" },
            reward: { stats: { damage: 1200, maxHp: 20000, defense: 500 }, title: "Completista" },
            hidden: true
        }
    ]
};

// Inicializa o sistema de conquistas no objeto player
function initAchievementsSystem() {
    if (!player.achievements) {
        player.achievements = {
            unlocked: [],
            progress: {},
            statsEarned: { damage: 0, maxHp: 0, defense: 0 }
        };
    }
}

// Verifica o progresso das conquistas
function checkAchievementProgress(type, data) {
    if (!player.achievements) initAchievementsSystem();

    // Verifica todas as categorias de conquistas
    for (const category in achievements) {
        achievements[category].forEach(achievement => {
            // Ignora conquistas já desbloqueadas
            if (player.achievements.unlocked.includes(achievement.id)) return;

            const condition = achievement.condition;
            let shouldUnlock = false;

            switch(condition.type) {
                case "kill":
                    if (type === "kill") {
                        incrementAchievementProgress(achievement.id, 1);
                        if (player.achievements.progress[achievement.id] >= condition.amount) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "kill_all_monsters":
                    if (type === "kill" && condition.monsters.includes(data.monsterName)) {
                        if (!player.achievements.progress[achievement.id]) {
                            // Se for uma conquista repetível (ex: matar 4x o mesmo monstro)
                            if (condition.amount) {
                                player.achievements.progress[achievement.id] = 0;
                            } else {
                                player.achievements.progress[achievement.id] = {};
                            }
                        }

                        if (condition.amount) {
                            // Conquista do tipo "matar X vezes um monstro específico"
                            incrementAchievementProgress(achievement.id, 1);
                            if (player.achievements.progress[achievement.id] >= condition.amount) {
                                shouldUnlock = true;
                            }
                        } else {
                            // Conquista padrão "matar todos os monstros da lista"
                            player.achievements.progress[achievement.id][data.monsterName] = true;
                            const allDefeated = condition.monsters.every(monster => 
                                player.achievements.progress[achievement.id][monster]
                            );
                            if (allDefeated) {
                                shouldUnlock = true;
                            }
                        }
                    }
                    break;
                    
                case "reach_level":
                    if (type === "level_up" && player.level >= condition.level) {
                        shouldUnlock = true;
                    }
                    break;
                    
                case "earn_coins":
                    if (type === "earn_coins") {
                        incrementAchievementProgress(achievement.id, data.amount);
                        if (player.achievements.progress[achievement.id] >= condition.amount) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "sell_items":
                    if (type === "sell_item") {
                        incrementAchievementProgress(achievement.id, data.amount);
                        if (player.achievements.progress[achievement.id] >= condition.amount) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "equip_item":
                    if (type === "equip_item" && data.itemType === condition.itemType) {
                        shouldUnlock = true;
                    }
                    break;
                    
                case "collect_items":
                    if (type === "obtain_item") {
                        incrementAchievementProgress(achievement.id, 1);
                        if (player.achievements.progress[achievement.id] >= condition.amount) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "obtain_item":
                    if (type === "obtain_item" && data.rarity === condition.rarity) {
                        shouldUnlock = true;
                    }
                    break;
                    
                case "equip_items":
                    if (type === "equip_item" && data.itemType === condition.itemType) {
                        incrementAchievementProgress(achievement.id, 1);
                        if (player.achievements.progress[achievement.id] >= condition.amount) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "visit_all_locations":
                    if (type === "visit_location") {
                        if (!player.achievements.progress[achievement.id]) {
                            player.achievements.progress[achievement.id] = [];
                        }
                        
                        if (!player.achievements.progress[achievement.id].includes(data.location)) {
                            player.achievements.progress[achievement.id].push(data.location);
                        }
                        
                        // Verifica se todas as localizações foram visitadas
                        const allLocations = Object.keys(battleLocations);
                        const allVisited = allLocations.every(location => 
                            player.achievements.progress[achievement.id].includes(location)
                        );
                        
                        if (allVisited) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "kill_in_environments":
                    if (type === "kill" && !condition.environments) {
                        // Se não especificar ambientes, conta qualquer ambiente
                        if (!player.achievements.progress[achievement.id]) {
                            player.achievements.progress[achievement.id] = [];
                        }
                        
                        if (!player.achievements.progress[achievement.id].includes(data.environment)) {
                            player.achievements.progress[achievement.id].push(data.environment);
                            
                            if (player.achievements.progress[achievement.id].length >= condition.amount) {
                                shouldUnlock = true;
                            }
                        }
                    }
                    break;
                    
                case "complete_category":
                    if (type === "unlock_achievement") {
                        const categoryAchievements = achievements[condition.category];
                        const allUnlocked = categoryAchievements.every(ach => 
                            player.achievements.unlocked.includes(ach.id)
                        );
                        
                        if (allUnlocked) {
                            shouldUnlock = true;
                        }
                    }
                    break;
                    
                case "complete_all":
                    if (type === "unlock_achievement") {
                        let allUnlocked = true;
                        for (const cat in achievements) {
                            for (const ach of achievements[cat]) {
                                if (!player.achievements.unlocked.includes(ach.id)) {
                                    allUnlocked = false;
                                    break;
                                }
                            }
                            if (!allUnlocked) break;
                        }
                        
                        if (allUnlocked) {
                            shouldUnlock = true;
                        }
                    }
                    break;
            }
            
            if (shouldUnlock) {
                unlockAchievement(achievement.id);
            }
        });
    }
}

// Incrementa o progresso de uma conquista
function incrementAchievementProgress(achievementId, amount = 1) {
    if (!player.achievements.progress[achievementId]) {
        player.achievements.progress[achievementId] = 0;
    }
    
    player.achievements.progress[achievementId] += amount;
    updateAchievementsDisplay();
}

// Desbloqueia uma conquista
function unlockAchievement(achievementId) {
    if (player.achievements.unlocked.includes(achievementId)) return;
    
    // Encontra a conquista em qualquer categoria
    let achievement;
    for (const category in achievements) {
        const found = achievements[category].find(a => a.id === achievementId);
        if (found) {
            achievement = found;
            break;
        }
    }
    
    if (!achievement) return;
    
    // Adiciona às conquistas desbloqueadas
    player.achievements.unlocked.push(achievementId);
    
    // Aplica as recompensas
    if (achievement.reward.stats) {
        for (const stat in achievement.reward.stats) {
            const value = achievement.reward.stats[stat];
            
            // Aplica o bônus de status
            if (stat === 'damage') {
                player.damage += value;
                player.baseStats.damage += value;
            } else if (stat === 'maxHp') {
                player.maxHp += value;
                player.baseStats.maxHp += value;
                player.hp += value;
            } else if (stat === 'defense') {
                player.defense += value;
                player.baseStats.defense += value;
            }
            
            // Registra os pontos ganhos
            player.achievements.statsEarned[stat] += value;
        }
    }
    
    if (achievement.reward.coins) {
        player.coins += achievement.reward.coins;
    }
    
    if (achievement.reward.title) {
        // Adiciona o título à lista de títulos do jogador
        if (!player.titles) player.titles = [];
        if (!player.titles.includes(achievement.reward.title)) {
            player.titles.push(achievement.reward.title);
        }
    }
    
    // Atualiza a UI
    updateStatus();
    updateAchievementsDisplay();
    
    // Mostra notificação
    showAchievementNotification(achievement);
    
    // Verifica se isso desbloqueou outras conquistas
    checkAchievementProgress("unlock_achievement", {});
}

// Mostra notificação de conquista desbloqueada
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
                <h4>CONQUISTA DESBLOQUEADA!</h4>
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// Atualiza a exibição das conquistas
function updateAchievementsDisplay() {
    if (!document.getElementById('achievements-screen')) return;
    
    // Atualiza abas
    const tabButtons = document.querySelectorAll('.achievements-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelectorAll('.achievements-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-achievements`).classList.add('active');
        });
    });
    
    // Atualiza cada categoria de conquistas
    for (const category in achievements) {
        const container = document.getElementById(`${category}-achievements`);
        if (!container) continue;
        
        container.innerHTML = '';
        
        achievements[category].forEach(achievement => {
            const isUnlocked = player.achievements.unlocked.includes(achievement.id);
            const progress = player.achievements.progress[achievement.id] || 0;
            
            const achievementCard = document.createElement('div');
            achievementCard.className = `achievement-card ${isUnlocked ? 'unlocked' : ''} ${achievement.hidden && !isUnlocked ? 'hidden' : ''}`;
            
            let progressText = '';
            if (!isUnlocked && achievement.condition.amount) {
                if (achievement.condition.type === "kill_all_monsters") {
                    const defeated = typeof progress === 'object' ? 
                        Object.keys(progress).length : 0;
                    progressText = `(${defeated}/${achievement.condition.monsters.length})`;
                } else if (achievement.condition.type === "visit_all_locations") {
                    const visited = Array.isArray(progress) ? progress.length : 0;
                    progressText = `(${visited}/${Object.keys(battleLocations).length})`;
                } else if (achievement.condition.type === "kill_in_environments") {
                    const environments = Array.isArray(progress) ? progress.length : 0;
                    progressText = `(${environments}/${achievement.condition.amount})`;
                } else {
                    progressText = `(${Math.min(progress, achievement.condition.amount)}/${achievement.condition.amount})`;
                }
            }
            
            achievementCard.innerHTML = `
                <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
                <div class="achievement-info">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    ${!isUnlocked && progressText ? `<div class="achievement-progress">${progressText}</div>` : ''}
                    ${isUnlocked ? `
                        <div class="achievement-reward">
                            ${achievement.reward.stats ? `
                                <span class="reward-stats">
                                    ${Object.entries(achievement.reward.stats).map(([stat, value]) => 
                                        `${stat === 'damage' ? '⚔️' : stat === 'maxHp' ? '❤️' : '🛡️'} +${value}`
                                    ).join(' ')}
                                </span>
                            ` : ''}
                            ${achievement.reward.coins ? `<span class="reward-coins">💰 +${achievement.reward.coins}</span>` : ''}
                            ${achievement.reward.title ? `<span class="reward-title">🎖️ ${achievement.reward.title}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
                ${isUnlocked ? '<div class="achievement-badge">DESBLOQUEADA</div>' : ''}
            `;
            
            container.appendChild(achievementCard);
        });
    }
}

// Mostra a tela de conquistas
function showAchievementsScreen() {
    const achievementsScreen = document.getElementById('achievements-screen');
    
    // Se a tela já está populada, apenas atualiza
    if (!achievementsScreen.querySelector('.screen-container')) {
        achievementsScreen.innerHTML = `
            <div class="screen-container">
                <h2 class="screen-title">CONQUISTAS</h2>
                <p class="screen-description">Desafios permanentes com recompensas exclusivas</p>
                
                <div class="achievements-summary">
                    <div class="summary-card">
                        <span class="summary-icon">🏆</span>
                        <span class="summary-value" id="total-achievements">0</span>
                        <span class="summary-label">Conquistas</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-icon">⚔️</span>
                        <span class="summary-value" id="damage-bonus">+0</span>
                        <span class="summary-label">Dano</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-icon">❤️</span>
                        <span class="summary-value" id="hp-bonus">+0</span>
                        <span class="summary-label">Vida</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-icon">🛡️</span>
                        <span class="summary-value" id="defense-bonus">+0</span>
                        <span class="summary-label">Defesa</span>
                    </div>
                </div>
                
                <div class="achievements-tabs">
                    <button class="tab-btn active" data-tab="combat">Combate ⚔️</button>
                    <button class="tab-btn" data-tab="progression">Progressão ⬆️</button>
                    <button class="tab-btn" data-tab="economy">Economia 💰</button>
                    <button class="tab-btn" data-tab="equipment">Equipamentos 🛡️</button>
                    <button class="tab-btn" data-tab="exploration">Exploração 🗺️</button>
                </div>
                
                <div class="achievements-content">
                    <div class="achievements-tab-content active" id="combat-achievements"></div>
                    <div class="achievements-tab-content" id="progression-achievements"></div>
                    <div class="achievements-tab-content" id="economy-achievements"></div>
                    <div class="achievements-tab-content" id="equipment-achievements"></div>
                    <div class="achievements-tab-content" id="exploration-achievements"></div>
                </div>
                
                <button onclick="showScreen('main')" class="btn btn-return">
                    <span class="btn-icon">⬅️</span> VOLTAR
                </button>
            </div>
        `;
    }
    
    // Atualiza os valores do resumo
    document.getElementById('total-achievements').textContent = player.achievements?.unlocked?.length || 0;
    document.getElementById('damage-bonus').textContent = `+${player.achievements?.statsEarned?.damage || 0}`;
    document.getElementById('hp-bonus').textContent = `+${player.achievements?.statsEarned?.maxHp || 0}`;
    document.getElementById('defense-bonus').textContent = `+${player.achievements?.statsEarned?.defense || 0}`;
    
    // Atualiza a exibição das conquistas
    updateAchievementsDisplay();
    
    // Configura os event listeners para as abas
    setupAchievementsTabs();
    
    // Mostra a tela
    achievementsScreen.classList.remove('d-none');
}

function setupAchievementsTabs() {
    const tabButtons = document.querySelectorAll('#achievements-screen .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe active ao botão clicado
            button.classList.add('active');
            
            // Oculta todos os conteúdos de abas
            document.querySelectorAll('#achievements-screen .achievements-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostra o conteúdo da aba selecionada
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-achievements`).classList.add('active');
        });
    });
}

// Adiciona ao carregar o jogo
document.addEventListener("DOMContentLoaded", () => {
    initAchievementsSystem();
    
    // Adiciona botão de conquistas ao menu principal
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu && !mainMenu.querySelector('.btn-achievements')) {
        const achievementsButton = document.createElement('button');
        achievementsButton.className = 'menu-item btn-achievements';
        achievementsButton.onclick = () => showScreen('achievements');
        achievementsButton.innerHTML = `
            <div class="menu-icon">🏆</div>
            <div class="menu-text">Conquistas</div>
        `;
        
        mainMenu.querySelector('.menu-grid').appendChild(achievementsButton);
    }
});

// Exporta funções para escopo global
window.initAchievementsSystem = initAchievementsSystem;
window.checkAchievementProgress = checkAchievementProgress;
window.showAchievementsScreen = showAchievementsScreen;