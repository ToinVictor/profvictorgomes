// Variáveis do jogador
let player = {
    name: "",
    hp: 20,
    maxHp: 20,
    damage: 2,
    defense: 0,
    coins: 0,
    level: 1,
    xp: 0,
    maxXp: 15,
    stamina: 6,
    maxStamina: 6,
    baseStats: {
        maxHp: 20,
        damage: 2,
        defense: 0
    },
    equipmentBonus: {
    damage: 0,
    defense: 0
    },
    lastStaminaUpdate: Date.now(),
    upgradeCosts: {
        damage: 10,
        maxHp: 20,
        defense: 50
    },
    activeQuests: [],
    completedQuests: [],
    questCompletionTimes: {}, // Novo objeto para armazenar tempos de conclusão
    questProgress: {},
    lastDailyReset: null
};

let currentMonster = null;
let gameStarted = false;
let currentEnvironment = null;
let isSelectingMonster = false;
let selectedAvatar = 'assets/avatars/default.png';
const MAX_ACTIVE_QUESTS = 2;

// Função de inicialização do jogo atualizada
function initGame() {
    if (typeof initAlchemySystem === 'function') {
        initAlchemySystem();
    }

    if (typeof initAchievementsSystem === 'function') {
    initAchievementsSystem();
    }

    // Esconde a tela de nome
    document.getElementById("name-screen").classList.add("d-none");
    
    // Mostra a tela de avatar
    document.getElementById("avatar-screen").classList.remove("d-none");
    
    // Atualiza o status inicial
    updateStatus();
    
    // Verifica se há um savegame
    const savedGame = localStorage.getItem("epicRPG_player");
    if (savedGame) {
        try {
            const savedData = JSON.parse(savedGame);
            
            // Atualiza os dados do jogador mantendo a estrutura atual
            player = {
                ...player,
                ...savedData,
                // Garante que os custos de upgrade existam
                upgradeCosts: {
                    ...player.upgradeCosts,
                    ...(savedData.upgradeCosts || {})
                }
            };
            
            // Limpa trabalho se for um novo jogo
            if (typeof resetWork === 'function') {
                resetWork();
            }
            
            // Mostra a tela principal se já tiver avatar
            if (savedData.avatar) {
                document.getElementById("avatar-screen").classList.add("d-none");
                document.getElementById("game-screen").classList.remove("d-none");
                gameStarted = true;
                updateStatus();
                updateQuestDisplay();
            }
            
        } catch (e) {
            console.error("Erro ao carregar jogo salvo:", e);
            alert("Erro ao carregar jogo salvo. Iniciando novo jogo.");
            if (typeof resetWork === 'function') resetWork();
        }
    } else {
        // Garante que o trabalho está resetado para novos jogos
        if (typeof resetWork === 'function') resetWork();
    }
}

//CARREGAMENTO
// script.js - Modifique o evento DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
    // Foca no input de nome
    document.getElementById("player-name-input").focus();
    
    // Tenta carregar o jogo salvo
    const savedGame = localStorage.getItem("epicRPG_player");
    
    if (savedGame) {
        try {
            const savedData = JSON.parse(savedGame);
            
            if (savedData.name && savedData.avatar) {
                if (confirm(`Continuar com ${savedData.name} (Nível ${savedData.level})?`)) {
                    // Carrega dados do jogador
                    player = {
                        ...player,
                        ...savedData,
                        upgradeCosts: {
                            ...player.upgradeCosts,
                            ...(savedData.upgradeCosts || {})
                        }
                    };
                    
                    // Atualiza interface
                    document.getElementById("name-screen").classList.add("d-none");
                    document.getElementById("avatar-screen").classList.add("d-none");
                    document.getElementById("game-screen").classList.remove("d-none");
                    
                    // Atualiza avatar
                    document.querySelectorAll('#player-avatar-img, #player-avatar-img-battle').forEach(img => {
                        img.src = player.avatar;
                    });
                    
                    // Inicializa sistemas
                    gameStarted = true;
                    updateStatus();
                    updateQuestDisplay();
                    
                    // SISTEMA CRÍTICO - Ordem de inicialização
                    restoreStaminaOverTime(); // 1º Restaura stamina
                    if (typeof initWorkSystem === 'function') { // 2º Inicializa trabalho
                        initWorkSystem(); 
                        loadWorkProgress(); // Força o carregamento do trabalho
                    }
                    
                    return;
                }
            }
        } catch (e) {
            console.error("Erro ao carregar:", e);
            alert("Erro ao carregar jogo. Iniciando novo jogo.");
        }
    }
    
    window.selectAvatar = selectAvatar;
    window.confirmAvatar = confirmAvatar;
    // Mostra tela de nome se não carregou jogo
    document.getElementById("name-screen").classList.remove("d-none");
});

function setPlayerName() {
    const nameInput = document.getElementById("player-name-input").value.trim();
    if (nameInput) {
        player.name = nameInput;
        document.getElementById("player-name").textContent = player.name;
        
        // Mostra a tela de avatar em vez de iniciar o jogo diretamente
        document.getElementById("name-screen").classList.add("d-none");
        document.getElementById("avatar-screen").classList.remove("d-none");
    } else {
        alert("Digite um nome válido!");
    }
}

//AVATAR

// Sistema de Avatar (atualizado para nova estrutura)
function selectAvatar(avatarPath) {
    selectedAvatar = avatarPath;
    
    // Remove seleção de todos os avatares
    document.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Adiciona seleção ao avatar clicado
    event.currentTarget.classList.add('selected');
    
    // Esconde preview de upload se estiver visível
    document.getElementById('avatar-preview').classList.add('d-none');
    
    // Determina a classe baseada no avatar selecionado
    const avatarName = event.currentTarget.querySelector('.avatar-name').textContent.toLowerCase();
    let className = '';
    
    switch(avatarName) {
        case 'guerreiro': className = 'warrior'; break;
        case 'ladino': className = 'rogue'; break;
        case 'mago': className = 'mage'; break;
        case 'arqueiro': className = 'archer'; break;
    }
    
    // Armazena a classe selecionada temporariamente
    window.selectedClass = className;
}

function confirmAvatar() {
    player.avatar = selectedAvatar;
    
    // Aplica os bônus da classe
     if (window.selectedClass && !player.class) { // Só aplica se não tiver classe definida
        applyClassBonuses(player, window.selectedClass);
        player.class = window.selectedClass; // Marca como classe definida
        showClassWelcomeMessage(window.selectedClass); // Nova mensagem aqui
    }
    
    document.getElementById("avatar-screen").classList.add("d-none");
    document.getElementById("game-screen").classList.remove("d-none");
    gameStarted = true;
    updateStatus();
}

// Configura o upload de imagem
document.getElementById('avatar-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        alert('Por favor, selecione uma imagem!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        selectedAvatar = event.target.result;
        const previewImg = document.getElementById('preview-img');
        previewImg.src = selectedAvatar;
        document.getElementById('avatar-preview').classList.remove('d-none');
        
        // Remove a seleção de avatares pré-definidos
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });
    };
    reader.readAsDataURL(file);
});

function updateStatus() {
    if (!gameStarted) return;

    // Garante que HP não ultrapasse o máximo
    player.hp = Math.min(player.hp, player.maxHp);
    
    // Atualiza avatar
    const avatarImgs = document.querySelectorAll('#player-avatar-img, #player-avatar-img-battle');
    avatarImgs.forEach(img => img.src = player.avatar || 'assets/avatars/default.png');

    // Atualiza todos os elementos de status
    const elements = {
        'player-name': player.name,
        'player-level': player.level,
        'player-hp': player.hp,
        'player-max-hp': player.maxHp,
        'player-damage': player.damage,
        'player-defense': player.defense,
        'player-coins': player.coins,
        'player-xp': player.xp,
        'player-max-xp': player.maxXp,
        'player-stamina': player.stamina,
        'player-max-stamina': player.maxStamina
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // Atualiza barra de XP
    const xpPercent = (player.xp / player.maxXp) * 100;
    const xpBar = document.getElementById('xp-progress');
    if (xpBar) xpBar.style.width = `${xpPercent}%`;

    // Atualiza custos de treino
    document.getElementById("damage-cost").textContent = player.upgradeCosts.damage;
    document.getElementById("hp-cost").textContent = player.upgradeCosts.maxHp;
    document.getElementById("defense-cost").textContent = player.upgradeCosts.defense;
    
    // Atualiza o indicador de missões ativas
    const questIndicator = document.getElementById('quest-indicator');
    if (questIndicator) {
        const statValue = questIndicator.querySelector('.stat-value');
        if (statValue) {
            statValue.textContent = `${player.activeQuests.length}/${MAX_ACTIVE_QUESTS}`;
        }
        questIndicator.classList.toggle('quest-limit-reached', player.activeQuests.length >= MAX_ACTIVE_QUESTS);
    }
}

function getLevelUpStats(level) {
    if (level <= 5) return { maxHp: 10, damage: 2, defense: 1 };    
    if (level <= 10) return { maxHp: 15, damage: 4, defense: 2 };   
    if (level <= 20) return { maxHp: 20, damage: 6, defense: 3 };   
    if (level <= 30) return { maxHp: 30, damage: 8, defense: 4 };   
    if (level <= 40) return { maxHp: 40, damage: 10, defense: 5 };  
    if (level <= 50) return { maxHp: 50, damage: 12, defense: 6 }; 
    if (level <= 60) return { maxHp: 70, damage: 15, defense: 8 };
    if (level <= 70) return { maxHp: 90, damage: 20, defense: 10 };
    if (level <= 80) return { maxHp: 120, damage: 25, defense: 12 };    
    return { maxHp: 150, damage: 35, defense: 15 };                  
}

function addXp(amount) {
    // Aplica bônus de XP do Mago (25% a mais)
    if (player.class === 'mage') {
        amount = Math.floor(amount * 1.25);
    }

    player.xp += amount;
    let leveledUp = false;
    checkQuestProgress("earn_xp", { amount: amount });

    while (player.xp >= player.maxXp && player.maxXp > 0) {
        // 1. Armazena valores ANTES do level up
        const oldLevel = player.level;
        const oldStats = { ...player.baseStats };

        // 2. Aumenta nível e calcula novos stats BASE
        player.level++;
        const gains = getLevelUpStats(player.level);
        
        player.baseStats.maxHp += gains.maxHp;
        player.baseStats.damage += gains.damage;
        player.baseStats.defense += gains.defense;
        
        // 3. Atualiza XP e stamina
        player.xp -= player.maxXp;
        player.maxXp = player.level * player.level * 5 + player.level * 10;
        
        // 4. Aplica bônus de classe aos novos valores
        recalculateStats(player);
        
        // 5. Cura completa e restaura stamina
        player.hp = player.maxHp;
        player.stamina = player.maxStamina;
        
        leveledUp = true;

        checkAchievementProgress("level_up");
        
        // 6. Mensagem detalhada
        let message = `LEVEL UP! Nível ${oldLevel} → ${player.level}\n` +
                     `HP: ${oldStats.maxHp} → ${player.baseStats.maxHp} (${gains.maxHp}+)\n` +
                     `Dano: ${oldStats.damage} → ${player.baseStats.damage} (${gains.damage}+)\n` +
                     `Defesa: ${oldStats.defense} → ${player.baseStats.defense} (${gains.defense}+)\n` +
                     `⚡ Energia restaurada!\n` +
                     `❤️ Vida curada totalmente`;
        
        // Adiciona bônus específicos de classe
        if (player.class === 'mage') {
            message += `\n✨ Bônus de Mago: +25% XP (Total: ${amount} XP)`;
        }
        
        alert(message);
    }

    updateStatus();
}

// Sistema de seleção de monstros (ajustado)
function showMonsterSelection(environment) {
    const environmentNames = {
        'floresta': 'FLORESTA',
        'vulcao': 'VULCÃO',
        'castelo': 'CASTELO',
        'geleira': 'GELEIRA'
    };
    
    document.getElementById('monster-select-title').textContent = `MONSTROS DA ${environmentNames[environment]}`;
    
    const grid = document.getElementById('monster-selection-grid');
    grid.innerHTML = '';
    
    monstersByEnvironment[environment].forEach((monster, index) => {
        const monsterCard = document.createElement('div');
        monsterCard.className = 'arena-card';
        monsterCard.innerHTML = `
            <div class="arena-icon">${monster.level} ⚔️</div>
            <div class="arena-name">${monster.name}</div>
            <div class="arena-desc">HP: ${monster.hp}</div>
        `;
        monsterCard.onclick = () => selectMonsterForBattle(environment, index);
        grid.appendChild(monsterCard);
    });
    
    updateStaminaDisplay();
    showScreen('monster-select');
}

function selectMonsterForBattle(environment, monsterIndex) {
    if (isSelectingMonster || player.stamina <= 0) return;
    isSelectingMonster = true;
    
    player.stamina--;
    updateStaminaDisplay();
    
    const monsterCards = document.querySelectorAll('.arena-card');
    const selectedCard = monsterCards[monsterIndex];
    selectedCard.classList.add('selected');
    
    setTimeout(() => {
        selectedCard.classList.remove('selected');
        currentEnvironment = environment;
        updateBattleBackground(environment);
        currentMonster = { ...monstersByEnvironment[environment][monsterIndex] };
        currentMonster.currentHp = currentMonster.hp;
        
        updateStatus();
        prepareBattleScreen();
        showScreen('battle');
        isSelectingMonster = false;
    }, 300);
}

function updateBattleBackground(environment) {
    const backgrounds = {
        'floresta': 'url("assets/battle-bgs/forest-battle.jpeg")',
        'vulcao': 'url("assets/battle-bgs/volcano-battle.jpeg")',
        'castelo': 'url("assets/battle-bgs/castle-battle.jpg")',
        'geleira': 'url("assets/battle-bgs/glacier-battle.jpeg")',
        'infernal': 'url("assets/battle-bgs/infernal-battle.jpeg")',        
        'abismo': 'url("assets/battle-bgs/abismo-battle.jpeg")',
        'celestial': 'url("assets/battle-bgs/celestial-battle.jpg")',
        'cosmic': 'url("assets/battle-bgs/cosmic-battle.jpg")'
    };

    const battleScreen = document.getElementById('battle-screen');
    battleScreen.style.setProperty('--battle-bg-url', backgrounds[environment] || backgrounds['floresta']);
}

// Sistema de batalha (ajustado para nova estrutura)
function prepareBattleScreen() {
    if (!currentMonster) return;

    updateBattleBackground(currentEnvironment);

    // Atualiza informações do jogador
    document.getElementById("player-name-battle").textContent = player.name;
    document.getElementById("player-level-battle").textContent = player.level;
    document.getElementById("player-current-hp").textContent = player.hp;
    document.getElementById("player-total-hp").textContent = player.maxHp;
    document.getElementById("player-atk-battle").textContent = player.damage; // ATK
    document.getElementById("player-def-battle").textContent = player.defense; // DEF

    // Atualiza informações do monstro
    document.getElementById("monster-img").src = currentMonster.img;
    document.getElementById("monster-name").textContent = currentMonster.name;
    document.getElementById("monster-level").textContent = currentMonster.level;
    document.getElementById("monster-current-hp").textContent = currentMonster.currentHp;
    document.getElementById("monster-total-hp").textContent = currentMonster.hp;
    document.getElementById("monster-atk-battle").textContent = currentMonster.damage; // ATK do monstro
    document.getElementById("monster-def-battle").textContent = currentMonster.defense || 0; // DEF do monstro (padrão 0)

    updateHealthBars();
}

function updateStaminaDisplay() {
    const staminaDisplay = document.getElementById('current-stamina-display');
    if (staminaDisplay) {
        staminaDisplay.textContent = `${player.stamina}/${player.maxStamina}`;
        staminaDisplay.classList.toggle('stamina-low', player.stamina <= 5);
    }
}

// Sistema de telas (atualizado para nova estrutura)
function showScreen(screenId) {
    if (!gameStarted) return;

    // Esconde todas as telas de jogo
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.add('d-none');
    });
    
    // Esconde o menu principal
    document.getElementById('main-menu').classList.add('d-none');
    
    if (screenId === 'main') {
        // Mostra apenas o menu principal
        document.getElementById('main-menu').classList.remove('d-none');
    } else {
        // Mostra a tela específica solicitada
        const screen = document.getElementById(`${screenId}-screen`);
        if (screen) {
            screen.classList.remove('d-none');
        } else {
            console.error(`Tela não encontrada: ${screenId}-screen`);
        }
    }
    
    // Atualizações específicas de cada tela
    switch(screenId) {
        case 'train':
            updateTrainingButtons();
            break;
        case 'quests':
            updateQuestDisplay();
            break;
        case 'battle':
            prepareBattleScreen();
            break;
        case 'inventory':
            showInventoryScreen();
            break;
        case 'arena-select':
            showAvailableLocations();
            break;
        case 'city':
            showCityScreen();
            break;
        case 'temple':
            updateHealPrices();
            break;
        case 'achievements':
                showAchievementsScreen();
            break;
    }
}

function updateHealthBars() {
    // Atualiza barra do jogador
    const playerHpPercent = (player.hp / player.maxHp) * 100;
    const playerHealthBar = document.getElementById("player-health-bar");
    playerHealthBar.style.width = `${playerHpPercent}%`;
    
    // Atualiza barra do monstro
    const monsterHpPercent = (currentMonster.currentHp / currentMonster.hp) * 100;
    const monsterHealthBar = document.getElementById("monster-health-bar");
    monsterHealthBar.style.width = `${monsterHpPercent}%`;
    
    // Efeitos visuais quando a vida está baixa
    if (playerHpPercent < 30) {
        playerHealthBar.style.background = "linear-gradient(90deg, #FF9800, #F57C00)";
    } else {
        playerHealthBar.style.background = "linear-gradient(90deg, #4CAF50, #8BC34A)";
    }
    
    if (monsterHpPercent < 30) {
        monsterHealthBar.style.background = "linear-gradient(90deg, #D32F2F, #B71C1C)";
    } else {
        monsterHealthBar.style.background = "linear-gradient(90deg, #f44336, #e53935)";
    }
}

function attackMonster() {
    if (!currentMonster || !gameStarted || currentMonster.currentHp <= 0) return;

    // Ataque do jogador
    const damageDealt = Math.max(1, player.damage - (currentMonster.defense || 0));
    currentMonster.currentHp -= damageDealt;

    // Atualiza a interface imediatamente
    document.getElementById("monster-current-hp").textContent = Math.max(0, currentMonster.currentHp);
    updateHealthBars();

    if (currentMonster.currentHp <= 0) {
        currentMonster.currentHp = 0;
        updateHealthBars();

        let coinsEarned = currentMonster.coins;
        let xpEarned = currentMonster.xp || 20;

        // Aplica multiplicadores temporários se existirem
        if (player.tempEffects) {
            for (const eff of Object.values(player.tempEffects)) {
                if (eff.goldMultiplier) {
                    coinsEarned = Math.floor(coinsEarned * (1 + eff.goldMultiplier));
                }
                if (eff.xpMultiplier) {
                    xpEarned = Math.floor(xpEarned * (1 + eff.xpMultiplier));
                }
            }
        }

        player.coins += coinsEarned;
        addXp(xpEarned);

        // Verifica progresso da missão
        checkQuestProgress("kill", { 
            monsterName: currentMonster.name,
            environment: currentEnvironment
        });
        checkQuestProgress("earn_coins", { amount: coinsEarned });

        //CONQUISTAS
        checkAchievementProgress("kill", { 
        monsterName: currentMonster.name,
        environment: currentEnvironment
        });

        checkAchievementProgress("earn_coins", { amount: coinsEarned });

        // Verifica drops
        const drops = checkMonsterDrops(currentMonster.name);

        // Desabilita o botão de ataque
        const attackButton = document.querySelector('#battle-screen .btn-attack');
        if (attackButton) attackButton.disabled = true;

        // Mostra alerta de vitória
        setTimeout(() => {
            let message = `Você derrotou ${currentMonster.name}!\nGanhou: ${coinsEarned} moedas e ${xpEarned} XP`;

            if (drops.length > 0) {
                message += "\n\nVocê obteve os seguintes itens:\n";
                drops.forEach(item => {
                    message += `- ${item.name}\n`;
                });
            }

            alert(message);
            showScreen("main");
            if (attackButton) attackButton.disabled = false;
            currentMonster = null;
        }, 300);
        return;
    }

    // Ataque do monstro (só ocorre se o jogador não tiver derrotado o monstro)
    setTimeout(() => {
        const damageTaken = Math.max(1, (currentMonster.damage || 5) - player.defense);
        player.hp -= damageTaken;

        document.getElementById("player-current-hp").textContent = Math.max(0, player.hp);
        updateHealthBars();
        updateStatus();

        if (player.hp <= 0) {
            player.hp = 0;
            updateHealthBars();
            setTimeout(() => {
                alert("Você foi derrotado! Vá ao templo ou reinicie o jogo.");
                showScreen("main");
            }, 300);
        }
    }, 300);
}

function showDropNotification(items) {
    if (items.length === 0) return;
    
    let message = "Você obteve os seguintes itens:\n";
    items.forEach(item => {
        message += `- ${item.name} (${item.description})\n`;
    });
    
    alert(message);
}

//NOVO TEMPLO
function updateHealPrices() {
    const calculateCost = (percent) => {
        const healAmount = player.maxHp * (percent / 100);
        const levelFactor = 1 + (player.level / 50);

        // Desconto progressivo verdadeiro (até 25%)
        const discountFactor = 1 - (percent / 100) * 0.25;

        const baseCostPerHp = 1.0; // custo base por ponto de vida
        const rawCost = healAmount * baseCostPerHp * levelFactor;

        return Math.floor(rawCost * discountFactor);
    };

    document.getElementById("heal-cost-10").textContent = `${calculateCost(10)} Moedas`;
    document.getElementById("heal-cost-25").textContent = `${calculateCost(25)} Moedas`;
    document.getElementById("heal-cost-50").textContent = `${calculateCost(50)} Moedas`;
    document.getElementById("heal-cost-100").textContent = `${calculateCost(100)} Moedas`;
}

function healPlayerPercentage(percent) {
    const healAmount = Math.floor(player.maxHp * (percent / 100));
    const levelFactor = 1 + (player.level / 50);
    const discountFactor = 1 - (percent / 100) * 0.25;

    const baseCostPerHp = 1.0;
    const cost = Math.floor(healAmount * baseCostPerHp * levelFactor * discountFactor);

    if (player.coins >= cost) {
        const missingHp = player.maxHp - player.hp;
        if (missingHp <= 0) {
            alert("Sua vida já está cheia!");
            return;
        }

        const actualHeal = Math.min(healAmount, missingHp);
        player.hp += actualHeal;
        player.coins -= cost;
                
        checkQuestProgress("heal", { amount: actualHeal });
        updateStatus();

        alert(`Você recuperou ${actualHeal} HP (${Math.floor((actualHeal / player.maxHp) * 100)}%) por ${cost} moedas!`);
    } else {
        alert(`Moedas insuficientes! Custo: ${cost} moedas.`);
    }
}

// Calcula o custo da cura com base no valor de cura
function calculateHealCost(healAmount) {
  // Custo aumenta progressivamente com o nível do jogador
  const levelFactor = 1 + (player.level / 50);
  return Math.floor(healAmount * levelFactor);
}

//TREINO

function getTrainingStats(level) {
    if (level <= 5) return { damage: 2, hp: 10, defense: 1 };    
    if (level <= 10) return { damage: 4, hp: 20, defense: 2 };  
    if (level <= 20) return { damage: 6, hp: 30, defense: 3 };  
    if (level <= 30) return { damage: 8, hp: 50, defense: 4 };  
    if (level <= 40) return { damage: 10, hp: 70, defense: 5 }; 
    if (level <= 50) return { damage: 12, hp: 100, defense: 6 };
    if (level <= 60) return { damage: 15, hp: 120, defense: 8 };
    if (level <= 70) return { damage: 20, hp: 150, defense: 10 };
    if (level <= 80) return { damage: 25, hp: 200, defense: 12 };
    return { damage: 35, hp: 250, defense: 15 };                 
}

function trainStat(stat) {
    if (!gameStarted || !player.baseStats) return;

    const trainingStats = getTrainingStats(player.level);
    
    // 1. Calcula o custo BASE sem descontos
    let baseCost = player.upgradeCosts[stat];
    
    // 2. Aplica desconto apenas no custo exibido/calculado (mantém o custo base para progressão)
    let discountedCost = player.class === 'archer' 
        ? Math.max(1, Math.floor(baseCost * (1 - classBonuses.archer.bonuses.trainingCostReduction)))
        : baseCost;

    if (player.coins >= discountedCost) {
        // 3. Atualiza estatística BASE
        const statKey = stat === 'maxHp' ? 'maxHp' : stat;
        const prevValue = player.baseStats[statKey];
        
        player.baseStats[statKey] += trainingStats[stat === 'maxHp' ? 'hp' : stat];
        
        // 4. Atualiza o custo BASE (sem desconto) para progressão normal
        player.upgradeCosts[stat] = Math.floor(baseCost * 1.2); // Aumenta 20% sobre o valor BASE
        
        // 5. Recalcula atributos finais
        recalculateStats(player);
        
        // 6. Debita o valor COM desconto
        player.coins -= discountedCost;
        
        checkQuestProgress("upgrade", { stat: stat });

        // 7. Feedback visual
        updateStatus();
        
        // 8. Mensagem detalhada
        let nextBaseCost = player.upgradeCosts[stat];
        let nextDiscountedCost = player.class === 'archer' 
            ? Math.max(1, Math.floor(nextBaseCost * (1 - classBonuses.archer.bonuses.trainingCostReduction)))
            : nextBaseCost;
        
        alert(`Treino concluído!\n` +
              `${stat.toUpperCase()}: ${prevValue} → ${player.baseStats[statKey]}\n` +
              `Custo: ${discountedCost} moedas (${player.class === 'archer' ? 'com 15% de desconto' : 'preço normal'})\n` +
              `Próximo custo: ${nextDiscountedCost} moedas`);
    } else {
        alert(`Moedas insuficientes! Você precisa de ${discountedCost} moedas.`);
    }
}

function getTrainingResultMessage(stat, trainingStats) {
    const statNames = {
        damage: "Dano",
        maxHp: "Vida Máxima",
        defense: "Defesa"
    };
    
    return `${statNames[stat]} aumentou em ${trainingStats[stat === 'maxHp' ? 'hp' : stat]}.`;
}

function updateTrainingButtons() {
    const trainingStats = getTrainingStats(player.level);
    
    document.querySelectorAll('#train-screen .train-stat').forEach(statElement => {
        if (statElement.textContent.includes('Dano')) {
            statElement.textContent = `Dano +${trainingStats.damage}`;
        } else if (statElement.textContent.includes('Vida')) {
            statElement.textContent = `Vida +${trainingStats.hp}`;
        } else if (statElement.textContent.includes('Defesa')) {
            statElement.textContent = `Defesa +${trainingStats.defense}`;
        }
    });
}

//SAVE E LOAD

function saveGame() {
    localStorage.setItem("epicRPG_player", JSON.stringify(player));
    alert("Progresso salvo com sucesso!");
}

function loadGame() {
    const saved = localStorage.getItem("epicRPG_player");
    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            
            player = {
                ...player,
                ...savedData,
                upgradeCosts: {
                    ...player.upgradeCosts,
                    ...(savedData.upgradeCosts || {})
                },
                lastStaminaUpdate: savedData.lastStaminaUpdate || Date.now(),
                lastDailyReset: savedData.lastDailyReset || new Date() // Garante que existe

            };

            // Verifica reset diário imediatamente ao carregar
            checkDailyReset();
            setInterval(checkDailyReset, 60000); // Verifica a cada minuto

            // Inicializa sistemas
            if (typeof initWorkSystem === 'function') initWorkSystem();
            restoreStaminaOverTime();

            // Mostra o jogo
            document.getElementById("name-screen").classList.add("d-none");
            document.getElementById("avatar-screen").classList.add("d-none");
            document.getElementById("game-screen").classList.remove("d-none");
            
            gameStarted = true;
            updateStatus();
            updateQuestDisplay();

        } catch (e) {
            console.error("Erro ao carregar jogo:", e);
            alert("Erro ao carregar jogo salvo. Iniciando novo jogo.");
            if (typeof resetWork === 'function') resetWork();
        }
    } else {
        alert("Nenhum progresso salvo encontrado.");
    }
}

function resetGame() {
    if (confirm("Tem certeza que deseja apagar todo o progresso?")) {
        // Limpa o trabalho ativo antes de resetar
        if (typeof resetWork === 'function') {
            resetWork();
        }
        localStorage.removeItem("epicRPG_player");
        location.reload();
    }
}

function restoreStaminaOverTime() {
    const now = Date.now();
    const MAX_OFFLINE_HOURS = 24;

    if (player.lastStaminaUpdate) {
        let timePassed = now - player.lastStaminaUpdate;
        timePassed = Math.min(timePassed, MAX_OFFLINE_HOURS * 3600000);

        // Cálculo da stamina a ser restaurada
        const staminaToRestore = Math.min(
            player.maxStamina - player.stamina,
            Math.floor(timePassed / (3 * 60000)) // 1 stamina a cada 3 minutos
        );

        if (staminaToRestore > 0) {
            player.stamina = Math.min(player.maxStamina, player.stamina + staminaToRestore);
            player.lastStaminaUpdate = now - (timePassed % (3 * 60000));

            // Mostra alerta apenas se restaurou quantidade significativa
            if (staminaToRestore >= 1) {
                const hoursOffline = Math.floor(timePassed / 3600000);
                const minutesOffline = Math.floor((timePassed % 3600000) / 60000);
                
                let timeMessage = '';
                if (hoursOffline > 0) {
                    timeMessage += `${hoursOffline} hora${hoursOffline > 1 ? 's' : ''}`;
                }
                if (minutesOffline > 0) {
                    if (timeMessage) timeMessage += ' e ';
                    timeMessage += `${minutesOffline} minuto${minutesOffline > 1 ? 's' : ''}`;
                }
                
                alert(`⚡ Energia restaurada! Você recuperou ${staminaToRestore} pontos de stamina (${timeMessage} offline)`);
            }

            updateStatus();
        }
    } else {
        player.lastStaminaUpdate = now;
    }
}

// Chame isso periodicamente para checar
setInterval(restoreStaminaOverTime, 180000); // checa a cada 60 segundos


// Funções para gerenciar missões
function checkQuestProgress(type, data) {
    player.activeQuests.forEach(quest => {
        const objective = quest.objective;
        
        switch(objective.type) {
            case "kill":
                if (type === "kill" && data.monsterName === objective.target && 
                    (!objective.environment || data.environment === objective.environment)) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "kill_environment":
                if (type === "kill" && data.environment === objective.environment) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "kill_any":
                if (type === "kill") {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "kill_all_environments":
                if (type === "kill" && objective.environments.includes(data.environment)) {
                    if (!player.questProgress[quest.id]) {
                        player.questProgress[quest.id] = {};
                    }
                    player.questProgress[quest.id][data.environment] = true;
                    
                    const allCompleted = objective.environments.every(env => 
                        player.questProgress[quest.id][env]
                    );
                    
                    if (allCompleted) {
                        completeQuest(quest.id);
                    }
                }
                break;
                
            case "kill_all_monsters":
                if (type === "kill" && objective.monsters.includes(data.monsterName)) {
                    if (!player.questProgress[quest.id]) {
                        player.questProgress[quest.id] = {};
                    }
                    
                    player.questProgress[quest.id][data.monsterName] = true;
                    
                    // Verifica se todos os monstros foram derrotados
                    const allMonstersDefeated = objective.monsters.every(monster => 
                        player.questProgress[quest.id][monster]
                    );
                    
                    if (allMonstersDefeated) {
                        completeQuest(quest.id);
                    }
                }
                break;
                
                case "kill_multiple_environments":
                    if (type === "kill" && objective.environments.includes(data.environment)) {
                        if (!player.questProgress[quest.id]) {
                            player.questProgress[quest.id] = {};
                        }
                        
                        if (!player.questProgress[quest.id][data.environment]) {
                            player.questProgress[quest.id][data.environment] = true;
                            
                            const completedCount = Object.keys(player.questProgress[quest.id]).length;
                            if (completedCount >= objective.amount) {
                                completeQuest(quest.id);
                            } else {
                                updateQuestDisplay();
                            }
                        }
                    }
                    break;
                
            case "upgrade":
                if (type === "upgrade" && data.stat === objective.stat) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "upgrade_any":
                if (type === "upgrade") {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "upgrade_all_stats":
                if (type === "upgrade" && objective.stats.includes(data.stat)) {
                    if (!player.questProgress[quest.id]) {
                        player.questProgress[quest.id] = {};
                    }
                    
                    // Incrementa o progresso para o stat específico
                    if (!player.questProgress[quest.id][data.stat]) {
                        player.questProgress[quest.id][data.stat] = 0;
                    }
                    
                    player.questProgress[quest.id][data.stat]++;
                    
                    // Verifica se todos os stats atingiram a quantidade necessária
                    const allStatsUpgraded = objective.stats.every(stat => 
                        player.questProgress[quest.id][stat] >= objective.amount
                    );
                    
                    if (allStatsUpgraded) {
                        completeQuest(quest.id);
                    }
                }
                break;
                
            case "heal":
                if (type === "heal") {
                    incrementQuestProgress(quest.id, data.amount);
                }
                break;
                
            case "earn_coins":
                if (type === "earn_coins") {
                    incrementQuestProgress(quest.id, data.amount);
                }
                break;
                            case "complete_job":
                if (type === "complete_job") {
                    incrementQuestProgress(quest.id, data.amount || 1);
                }
                break;
                
            case "complete_all_jobs":
                if (type === "complete_all_jobs") {
                    if (!player.questProgress[quest.id]) {
                        player.questProgress[quest.id] = {};
                    }
                    
                    // Marca este trabalho como completado
                    player.questProgress[quest.id][data.jobName] = true;
                    
                    // Verifica se todos os trabalhos foram completados
                    const allJobsCompleted = objective.jobs.every(job => 
                        player.questProgress[quest.id][job]
                    );
                    
                    if (allJobsCompleted) {
                        completeQuest(quest.id);
                    }
                }
                break;

            case "equip_items":
                if (type === "equip_item" && data.itemType === objective.itemType) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "collect_materials":
                if (type === "collect_material" && 
                    (!objective.rarity || data.rarity === objective.rarity)) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
                
            case "sell_items":
                if (type === "sell_item") {
                    incrementQuestProgress(quest.id, data.amount);
                }
                break;
                
            case "kill_high_level":
                if (type === "kill" && data.monsterLevel >= objective.minLevel) {
                    incrementQuestProgress(quest.id, 1);
                }
                break;
        }
    });
}

//NOVA FUNÇÃO DE MISSÃO
function checkCollectionQuests() {
    // Verifica missões de coleção quando o jogador entra em uma área
    player.activeQuests.forEach(quest => {
        if (quest.objective.type === "kill_all_monsters" || 
            quest.objective.type === "kill_all_environments") {
            updateQuestDisplay();
        }
    });
}

function incrementQuestProgress(questId, amount = 1) {
    if (!player.questProgress[questId]) {
        player.questProgress[questId] = 0;
    }
    
    player.questProgress[questId] += amount;
    
    const quest = player.activeQuests.find(q => q.id === questId);
    if (quest && player.questProgress[questId] >= quest.objective.amount) {
        completeQuest(questId);
    }
    
    updateQuestDisplay();
}

function completeQuest(questId) {
    const questIndex = player.activeQuests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = player.activeQuests[questIndex];
    
    // Dar recompensa
    player.coins += quest.reward.coins || 0;
    addXp(quest.reward.xp || 0);
    
    // Dar item de recompensa se existir
    if (quest.reward.item) {
        addItemToInventory(quest.reward.item.id || quest.reward.item);
    }
    
    // Mover para completadas e registrar tempo
    player.activeQuests.splice(questIndex, 1);
    player.completedQuests.push(quest);
    player.questCompletionTimes[questId] = Date.now(); // Registrar momento da conclusão
    
    // Atualizar UI
    updateStatus();
    updateQuestDisplay();
    
    // Mostrar mensagem de recompensa
    let rewardMessage = `Missão completada: ${quest.title}\nRecompensa: ${quest.reward.coins} moedas e ${quest.reward.xp} XP`;
    if (quest.reward.item) {
        rewardMessage += `\nItem obtido: ${typeof quest.reward.item === 'object' ? quest.reward.item.name : quest.reward.item}`;
    }
    
    alert(rewardMessage);
}

function acceptQuest(questId, category) {
    // Verificar se já atingiu o limite de missões ativas
    if (player.activeQuests.length >= MAX_ACTIVE_QUESTS) {
        alert(`Você já tem ${MAX_ACTIVE_QUESTS} missões ativas! Complete ou cancele uma antes de aceitar novas.`);
        return;
    }

    // Encontrar a quest em qualquer categoria
    let quest;
    for (const cat in quests) {
        const found = quests[cat].find(q => q.id === questId);
        if (found) {
            quest = found;
            break;
        }
    }
    
    if (!quest) return;
    
    if (player.level < quest.requiredLevel) {
        alert(`Nível insuficiente! Você precisa ser nível ${quest.requiredLevel} para esta missão.`);
        return;
    }
    
    // Verificar se já está ativa
    if (player.activeQuests.some(q => q.id === questId)) {
        return;
    }
    
    // Para quests diárias: verificar se já foi completada hoje
    if (quest.isDaily) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const wasCompletedToday = player.completedQuests.some(q => 
            q.id === questId && 
            player.questCompletionTimes[questId] >= today.getTime()
        );
        
        if (wasCompletedToday) {
            alert("Você já completou esta missão diária hoje. Espere até o próximo reset!");
            return;
        }
    }
    
    // Adicionar à lista de ativas
    player.activeQuests.push({...quest});
    
    // Inicializar progresso
    if (quest.objective.type === "kill_all_environments" || 
        quest.objective.type === "kill_multiple_environments" ||
        quest.objective.type === "kill_all_monsters" ||
        quest.objective.type === "upgrade_all_stats" ||
        quest.objective.type === "complete_all_jobs") {
        player.questProgress[quest.id] = {};
    } else {
        player.questProgress[quest.id] = 0;
    }
    
    updateStatus();
    updateQuestDisplay();
}

function updateQuestDisplay() {
    // Atualiza abas primeiro
    const tabButtons = document.querySelectorAll('.quest-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove classe active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe active apenas ao botão clicado
            button.classList.add('active');
            
            // Esconde todo o conteúdo das abas
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostra o conteúdo da aba correspondente
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Atualiza missões ativas
    const activeList = document.getElementById('active-quests-list');
    activeList.innerHTML = '';
    
    if (player.activeQuests.length === 0) {
        activeList.innerHTML = `
            <div class="empty-state">
                <p>Nenhuma missão ativa no momento</p>
                <button class="btn btn-available-tab" onclick="document.querySelector('[data-tab=\"available\"]').click()">
                    Ver missões disponíveis
                </button>
            </div>
        `;
    } else {
        player.activeQuests.forEach(quest => {
                    let progressText = '';
                    let progressPercent = 0;
                    
                    if (quest.objective.type === "kill_all_environments" || 
                        quest.objective.type === "kill_multiple_environments") {
                        const completedEnvs = player.questProgress[quest.id] ? 
                            Object.keys(player.questProgress[quest.id]).length : 0;
                        progressText = `Ambientes: ${completedEnvs}/${quest.objective.amount}`;
                        progressPercent = (completedEnvs / quest.objective.amount) * 100;
                    } 
                    else if (quest.objective.type === "kill_all_monsters") {
                        const completedMonsters = player.questProgress[quest.id] ? 
                            Object.keys(player.questProgress[quest.id]).length : 0;
                        progressText = `Monstros: ${completedMonsters}/${quest.objective.monsters.length}`;
                        progressPercent = (completedMonsters / quest.objective.monsters.length) * 100;
                    } 
                    else if (quest.objective.type === "upgrade_all_stats") {
                        const statsCompleted = player.questProgress[quest.id] ?
                            Object.values(player.questProgress[quest.id]).filter(val => val >= quest.objective.amount).length : 0;
                        progressText = `Atributos: ${statsCompleted}/${quest.objective.stats.length}`;
                        progressPercent = (statsCompleted / quest.objective.stats.length) * 100;
                    } 
                    else if (quest.objective.type === "complete_job") {
                        const progress = player.questProgress[quest.id] || 0;
                        const requiredAmount = quest.objective.amount || 1;
                        progressText = `Trabalhos: ${progress}/${requiredAmount}`;
                        progressPercent = (progress / requiredAmount) * 100;
                    }
                    else if (quest.objective.type === "complete_all_jobs") {
                    const jobsCompleted = player.questProgress[quest.id] ? 
                        Object.keys(player.questProgress[quest.id]).length : 0;
                    const totalJobs = quest.objective.jobs.length;
                    progressText = `Trabalhos diferentes: ${jobsCompleted}/${totalJobs}`;
                    progressPercent = (jobsCompleted / totalJobs) * 100;
                }
            
            const questCard = document.createElement('div');
            questCard.className = 'quest-card';
            questCard.innerHTML = `
                <div class="quest-header">
                    <h5>${quest.title}</h5>
                    <button onclick="cancelQuest(${quest.id})" class="btn btn-cancel-quest">
                        <span class="btn-icon">❌</span>
                    </button>
                </div>
                <p>${quest.description}</p>
                <p class="quest-progress-text">${progressText}</p>
                <div class="quest-progress">
                    <div class="quest-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                <div class="quest-reward">
                    <span class="reward-coins">💰 ${quest.reward.coins} moedas</span>
                    <span class="reward-xp">⭐ ${quest.reward.xp} XP</span>
                    ${quest.reward.item ? `<span class="reward-item">🎁 ${typeof quest.reward.item === 'object' ? quest.reward.item.name : quest.reward.item}</span>` : ''}
                </div>
            `;
            activeList.appendChild(questCard);
        });
    }
    
    // Atualiza missões disponíveis
    const availableList = document.getElementById('available-quests-list');
    availableList.innerHTML = '';
    
    let hasAvailableQuests = false;
    const now = new Date();
    const lastReset = player.lastDailyReset ? new Date(player.lastDailyReset) : new Date();
    const todayReset = new Date(
        lastReset.getFullYear(),
        lastReset.getMonth(),
        lastReset.getDate()
    );
    
    for (const category in quests) {
    // Ignorar se não for um array (por segurança)
    if (!Array.isArray(quests[category])) continue;
    
    quests[category].forEach(quest => {
        const isActive = player.activeQuests.some(q => q.id === quest.id);
        const isCompleted = player.completedQuests.some(q => q.id === quest.id);
        
        // Para quests diárias, verifica se foi completada hoje
        let isDailyCompletedToday = false;
        if (quest.isDaily && isCompleted) {
            const completionTime = player.questCompletionTimes[quest.id];
            if (completionTime) {
                const completionDate = new Date(completionTime);
                const today = new Date();
                isDailyCompletedToday = completionDate.getDate() === today.getDate() && 
                                      completionDate.getMonth() === today.getMonth() && 
                                      completionDate.getFullYear() === today.getFullYear();
            }
        }
        
        // Mostrar como disponível se:
        // 1. Não está ativa
        // 2. Não está completada (ou é diária que não foi completada hoje)
        // 3. O jogador tem nível suficiente
        if (!isActive && 
        (!isCompleted || (quest.isDaily && !isDailyCompletedToday)) && 
        player.level >= quest.requiredLevel) {
        
        hasAvailableQuests = true;
        
        const isDisabled = player.activeQuests.length >= MAX_ACTIVE_QUESTS;
        
        const questCard = document.createElement('div');
        questCard.className = 'quest-card available';
        questCard.innerHTML = `
            <div class="quest-content">
                <h5>${quest.title}</h5>
                <p>${quest.description}</p>
                <div class="quest-requirements">
                    <span class="required-level">Nível ${quest.requiredLevel}+</span>
                    ${quest.isDaily ? '<span class="daily-badge">🔁 DIÁRIA</span>' : ''}
                </div>
                <div class="quest-reward">
                    <span class="reward-coins">💰 ${quest.reward.coins} moedas</span>
                    <span class="reward-xp">⭐ ${quest.reward.xp} XP</span>
                </div>
            </div>
            <button onclick="${isDisabled ? '' : `acceptQuest(${quest.id}, '${category}')`}" 
                    class="btn btn-accept-quest ${isDisabled ? 'disabled' : ''}">
                ${isDisabled ? 'Limite atingido' : 'Aceitar Missão'}
            </button>
        `;
        availableList.appendChild(questCard);
}
    });
}
    
    if (!hasAvailableQuests) {
        availableList.innerHTML = `
            <div class="empty-state">
                <p>Nenhuma missão disponível no momento</p>
                <p class="small">Avanse de nível para desbloquear novas missões!</p>
            </div>
        `;
    }
    
    // Atualiza missões completadas
    const completedList = document.getElementById('completed-quests-list');
    completedList.innerHTML = '';
    
    if (player.completedQuests.length === 0) {
        completedList.innerHTML = `
            <div class="empty-state">
                <p>Nenhuma missão completada ainda</p>
            </div>
        `;
    } else {
        player.completedQuests.forEach(quest => {
            const questCard = document.createElement('div');
            questCard.className = 'quest-card completed';
            questCard.innerHTML = `
                <h5>${quest.title}</h5>
                <p>${quest.description}</p>
                <div class="quest-status">
                    <span class="completed-badge">✅ COMPLETADA</span>
                    ${quest.isDaily ? '<span class="daily-badge">🔁 DIÁRIA</span>' : ''}
                </div>
                <div class="quest-reward">
                    <span>Recompensa obtida: ${quest.reward.coins} moedas e ${quest.reward.xp} XP</span>
                </div>
            `;
            completedList.appendChild(questCard);
        });
    }
}

function cancelQuest(questId) {
    if (confirm("Tem certeza que deseja cancelar esta missão? Você perderá todo o progresso.")) {
        const questIndex = player.activeQuests.findIndex(q => q.id === questId);
        if (questIndex !== -1) {
            // Remove da lista de ativas
            player.activeQuests.splice(questIndex, 1);
            
            // Remove o progresso
            delete player.questProgress[questId];
            updateStatus();
            updateQuestDisplay();
        }
    }
}

function checkDailyReset() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Se não houver último reset definido ou se já passou um dia
    if (!player.lastDailyReset || new Date(player.lastDailyReset) < today) {
        // Remove todas as quests diárias completadas
        player.completedQuests = player.completedQuests.filter(q => !q.isDaily);
        
        // Remove registros de conclusão de quests diárias
        for (const questId in player.questCompletionTimes) {
            const quest = quests.daily.find(q => q.id == questId);
            if (quest) {
                delete player.questCompletionTimes[questId];
            }
        }
        
        // Remove as quests diárias ativas
        player.activeQuests = player.activeQuests.filter(q => !q.isDaily);
        
        // Atualiza o último reset para agora
        player.lastDailyReset = now;
        
        // Salva o jogo
        saveGame();
        
        // Atualiza a UI
        updateQuestDisplay();
    }
}

// Chamar periodicamente para verificar reset diário
setInterval(checkDailyReset, 3600000); // Checa a cada hora

function showMonsterSelection(environment) {
    // Verifica se o local está desbloqueado
    if (!isLocationUnlocked(environment)) {
        const location = battleLocations[environment];
        alert(`Você precisa ser nível ${location.minLevel} para acessar ${location.name}!`);
        return;
    }

    if (isWorking) {
        alert("Você não pode batalhar enquanto está trabalhando!");
        return;
    }

    checkAchievementProgress("visit_location", { location: environment });

    // Atualiza o título da tela de seleção de monstros
    const locationName = battleLocations[environment].name.toUpperCase();
    document.getElementById('monster-select-title').textContent = `MONSTROS DE ${locationName}`;
    
    const grid = document.getElementById('monster-selection-grid');
    grid.innerHTML = '';
    
    // Verifica se existem monstros para este ambiente
    if (!monstersByEnvironment[environment] || monstersByEnvironment[environment].length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum monstro disponível neste local</p>
                <p class="small">Monstros serão adicionados em atualizações futuras!</p>
            </div>
        `;
        return;
    }
    
    monstersByEnvironment[environment].forEach((monster, index) => {
        const monsterCard = document.createElement('div');
        monsterCard.className = 'arena-card';
        monsterCard.innerHTML = `
            <div class="arena-icon">${monster.level} ⚔️</div>
            <div class="arena-name">${monster.name}</div>
            <div class="arena-desc">HP: ${monster.hp}</div>
        `;
        monsterCard.onclick = () => selectMonsterForBattle(environment, index);
        grid.appendChild(monsterCard);
    });
    
    updateStaminaDisplay();
    showScreen('monster-select');
}

//GARANTIR QUE O TRABALHO SEJA SALVO AO SAIR

window.addEventListener('beforeunload', () => {
    if (typeof saveWorkProgress === 'function') {
        saveWorkProgress();
    }
    //if (typeof saveGame === 'function') {
      //  saveGame();
    //} COMENTADO PARA NÃO SALVAR QUANDO SAIR DO JOGO
});