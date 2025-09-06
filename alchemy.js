// alchemy.js - Sistema de Alquimia

// Receitas de poções
const potionRecipes = {
    // Poção de Cura
    health_potion: {
        id: 3001,
        name: "Poção de Cura",
        description: "Restaura 20 pontos de vida",
        icon: "🧪",
        ingredients: [
            { id: 5001, name: "Semente da Vida lv1", quantity: 1 }
        ],
        levelRequired: 1,
        craftTime: 5, // em segundos
        xpReward: 10
    },
    
    // Poção Média de Cura
    medium_health_potion: {
        id: 3002,
        name: "Poção Média de Cura",
        description: "Restaura 350 pontos de vida",
        icon: "🧪",
        ingredients: [
            { id: 5013, name: "Semente da Vida lv2", quantity: 1 },
            { id: 5004, name: "Garra de Urso", quantity: 1 }
        ],
        levelRequired: 5,
        craftTime: 15,
        xpReward: 25
    },
    
    // Tônico de Energia
    energy_tonic: {
        id: 3003,
        name: "Tônico de Energia",
        description: "Restaura 1 ponto de stamina",
        icon: "⚡",
        ingredients: [
            { id: 5004, name: "Garra de Urso", quantity: 1 },
            { id: 5006, name: "Pedra de Fogo", quantity: 5 }
        ],
        levelRequired: 5,
        craftTime: 360,
        xpReward: 250
    },
    
    // Poção da Riqueza
    wealth_potion: {
        id: 3006,
        name: "Poção da Riqueza",
        description: "Aumenta o ouro recebido em 50% por 3 horas",
        icon: "💰",
        ingredients: [
            { id: 5006, name: "Pedra de Fogo", quantity: 2 },
            { id: 5014, name: "Osso de Esqueleto", quantity: 10 }
        ],
        levelRequired: 10,
        craftTime: 360,
        xpReward: 500
    },
    
    // Essência da Experiência
    xp_essence: {
        id: 3007,
        name: "Essência da Experiência",
        description: "Aumenta a experiência recebida em 50% por 3 horas",
        icon: "📘",
        ingredients: [
            { id: 5016, name: "Coração de gelo", quantity: 10 },
            { id: 5014, name: "Osso de Esqueleto", quantity: 10 }
        ],
        levelRequired: 10,
        craftTime: 360,
        xpReward: 750
    }
};

// Variáveis de estado
let currentCrafting = null;
let craftingEndTime = 0;
let isCrafting = false;
let craftingInterval = null;

// Inicializa o sistema de alquimia
function initAlchemySystem() {
    // Desbloqueia o laboratório se o jogador tiver nível suficiente
    if (player.level >= 40) {
        cityLocations.alchemy.locked = false;
    }
    
    // Carrega qualquer crafting em progresso
    loadCraftingProgress();
    
    // Atualiza a tela da cidade para refletir o desbloqueio
    showCityScreen();
}

// Mostra a tela de alquimia
function showAlchemyScreen() {
    if (cityLocations.alchemy.locked) {
        alert("Você precisa ser nível 40 para desbloquear o Laboratório de Poções!");
        return;
    }

    const alchemyScreen = document.getElementById('alchemy-screen');
    if (!alchemyScreen) return;

    // Limpa a tela
    alchemyScreen.innerHTML = '';

    // Cria o conteúdo da tela de alquimia
    alchemyScreen.innerHTML = `
        <div class="screen-container">
            <h2 class="screen-title">🧪 LABORATÓRIO DE POÇÕES</h2>
            <p class="screen-description">Combine materiais para criar poções poderosas</p>
            
            <div class="alchemy-container">
                <div class="alchemy-recipes">
                    <h3>Receitas Disponíveis</h3>
                    <div id="recipes-list" class="recipes-list"></div>
                </div>
                
                <div class="alchemy-details">
                    <div id="recipe-details" class="recipe-details">
                        <p>Selecione uma receita para ver os detalhes</p>
                    </div>
                    <div id="crafting-controls" class="crafting-controls" style="display: none;">
                        <button id="craft-button" class="btn btn-craft">Criar Poção</button>
                        <div id="crafting-progress" class="crafting-progress" style="display: none;">
                            <div class="progress-bar">
                                <div id="crafting-progress-bar" class="progress-bar-fill" style="width: 0%"></div>
                            </div>
                            <span id="crafting-time">0s</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="alchemy-materials">
                <h3>Seus Materiais</h3>
                <div id="materials-list" class="materials-grid"></div>
            </div>
            
            <button onclick="showScreen('city')" class="btn btn-return">
                <span class="btn-icon">⬅️</span> VOLTAR À CIDADE
            </button>
        </div>
    `;

    // Carrega as receitas e materiais
    loadRecipes();
    loadPlayerMaterials();

    // Mostra a tela
    showScreen('alchemy');
    
    // Verifica se há crafting em progresso
    if (isCrafting) {
        startCraftingProgress();
    }
}

// Carrega a lista de receitas
function loadRecipes() {
    const recipesList = document.getElementById('recipes-list');
    if (!recipesList) return;

    recipesList.innerHTML = '';

    Object.entries(potionRecipes).forEach(([key, recipe]) => {
        // Verifica se o jogador tem nível suficiente
        if (player.level < recipe.levelRequired) {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'recipe-card locked';
            recipeElement.innerHTML = `
                <div class="recipe-icon">${recipe.icon}</div>
                <div class="recipe-name">${recipe.name}</div>
                <div class="recipe-level">Nv. ${recipe.levelRequired}</div>
            `;
            recipesList.appendChild(recipeElement);
            return;
        }

        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe-card';
        recipeElement.dataset.recipeId = key;
        recipeElement.innerHTML = `
            <div class="recipe-icon">${recipe.icon}</div>
            <div class="recipe-name">${recipe.name}</div>
            <div class="recipe-level">Nv. ${recipe.levelRequired}</div>
        `;

        recipeElement.addEventListener('click', () => showRecipeDetails(key));
        recipesList.appendChild(recipeElement);
    });

    if (recipesList.children.length === 0) {
        recipesList.innerHTML = '<p class="empty-state">Nenhuma receita disponível</p>';
    }
}

// Mostra os detalhes de uma receita
function showRecipeDetails(recipeId) {
    const recipe = potionRecipes[recipeId];
    if (!recipe) return;

    const recipeDetails = document.getElementById('recipe-details');
    const craftingControls = document.getElementById('crafting-controls');

    if (!recipeDetails || !craftingControls) return;

    // Verifica se o jogador tem os materiais necessários
    const canCraft = checkMaterials(recipe);

    // Monta a lista de ingredientes
    let ingredientsList = '';
    recipe.ingredients.forEach(ing => {
        const hasEnough = getMaterialQuantity(ing.id) >= ing.quantity;
        ingredientsList += `
            <div class="ingredient ${hasEnough ? '' : 'missing'}">
                <span class="ingredient-icon">${getMaterialIcon(ing.id)}</span>
                <span class="ingredient-name">${ing.name}</span>
                <span class="ingredient-quantity">${getMaterialQuantity(ing.id)}/${ing.quantity}</span>
            </div>
        `;
    });

    // Atualiza os detalhes da receita
    recipeDetails.innerHTML = `
        <div class="recipe-header">
            <div class="recipe-icon-large">${recipe.icon}</div>
            <div>
                <h4>${recipe.name}</h4>
                <p>${recipe.description}</p>
            </div>
        </div>
        
        <div class="recipe-info">
            <div class="info-item">
                <span class="info-label">Nível necessário:</span>
                <span class="info-value">${recipe.levelRequired}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Tempo de preparo:</span>
                <span class="info-value">${recipe.craftTime} segundos</span>
            </div>
            <div class="info-item">
                <span class="info-label">Experiência ganha:</span>
                <span class="info-value">${recipe.xpReward} XP</span>
            </div>
        </div>
        
        <div class="recipe-ingredients">
            <h5>Ingredientes necessários:</h5>
            <div class="ingredients-list">
                ${ingredientsList}
            </div>
        </div>
    `;

    // Atualiza os controles de criação
    const craftButton = document.getElementById('craft-button');
    if (craftButton) {
        craftButton.disabled = !canCraft || isCrafting;
        craftButton.onclick = () => startCrafting(recipeId);
    }

    craftingControls.style.display = 'block';
}

// Verifica se o jogador tem os materiais necessários
function checkMaterials(recipe) {
    return recipe.ingredients.every(ing => {
        return getMaterialQuantity(ing.id) >= ing.quantity;
    });
}

// Inicia o processo de criação
function startCrafting(recipeId) {
    const recipe = potionRecipes[recipeId];
    if (!recipe || !checkMaterials(recipe) || isCrafting) return;

    // Remove os materiais do inventário
    recipe.ingredients.forEach(ing => {
        removeMaterialFromInventory(ing.id, ing.quantity);
    });

    // Atualiza a lista de materiais
    loadPlayerMaterials();

    // Configura o estado de crafting
    currentCrafting = recipe;
    isCrafting = true;
    craftingEndTime = Date.now() + (recipe.craftTime * 1000);
    
    // Salva o progresso
    saveCraftingProgress();
    
    // Inicia o progresso visual
    startCraftingProgress();
}

// Inicia/atualiza a exibição do progresso de crafting
function startCraftingProgress() {
    if (!currentCrafting || !isCrafting) return;
    
    // Limpa qualquer intervalo existente
    if (craftingInterval) {
        clearInterval(craftingInterval);
    }
    
    // Mostra a barra de progresso
    const craftingProgress = document.getElementById('crafting-progress');
    const progressBar = document.getElementById('crafting-progress-bar');
    const timeDisplay = document.getElementById('crafting-time');
    const craftButton = document.getElementById('craft-button');

    if (craftingProgress && progressBar && timeDisplay && craftButton) {
        craftButton.disabled = true;
        craftingProgress.style.display = 'block';
        
        // Atualiza imediatamente
        updateCraftingProgress();
        
        // Configura o intervalo de atualização
        craftingInterval = setInterval(updateCraftingProgress, 1000);
    }
}

// Atualiza a exibição do progresso
function updateCraftingProgress() {
    if (!currentCrafting || !isCrafting) return;
    
    const now = Date.now();
    const remainingTime = Math.max(0, craftingEndTime - now);
    const progressPercent = 100 - ((remainingTime / (currentCrafting.craftTime * 1000)) * 100);
    
    const progressBar = document.getElementById('crafting-progress-bar');
    const timeDisplay = document.getElementById('crafting-time');
    const craftButton = document.getElementById('craft-button');
    
    if (progressBar && timeDisplay) {
        progressBar.style.width = `${progressPercent}%`;
        timeDisplay.textContent = `${Math.ceil(remainingTime / 1000)}s`;
    }
    
    // Verifica se terminou
    if (remainingTime <= 0) {
        finishCrafting();
    }
}

// Finaliza a criação da poção
function finishCrafting() {
    if (!currentCrafting) return;
    
    // Limpa o intervalo
    if (craftingInterval) {
        clearInterval(craftingInterval);
        craftingInterval = null;
    }
    
    // Adiciona a poção ao inventário
    addItemToInventory(currentCrafting.id);
    
    // Adiciona experiência
    addXp(currentCrafting.xpReward);
    
    // Atualiza a UI
    const craftingProgress = document.getElementById('crafting-progress');
    const craftButton = document.getElementById('craft-button');
    
    if (craftingProgress && craftButton) {
        craftingProgress.style.display = 'none';
        craftButton.disabled = false;
    }
    
    // Mostra mensagem de sucesso
    alert(`Você criou com sucesso: ${currentCrafting.name}! +${currentCrafting.xpReward} XP`);
    
    // Reseta o estado
    resetCrafting();
    
    // Atualiza os materiais e receitas
    loadPlayerMaterials();
    loadRecipes();
}

// Reseta o estado de crafting
function resetCrafting() {
    currentCrafting = null;
    isCrafting = false;
    craftingEndTime = 0;
    
    // Limpa dados do jogador
    if (player.alchemyData) {
        delete player.alchemyData;
    }
}

// Carrega os materiais do jogador
function loadPlayerMaterials() {
    const materialsList = document.getElementById('materials-list');
    if (!materialsList) return;

    materialsList.innerHTML = '';

    // Agrupa materiais por tipo
    const materials = {};
    if (player.inventory?.consumables) {
        player.inventory.consumables.forEach(item => {
            if (item.type === 'material') {
                if (!materials[item.id]) {
                    materials[item.id] = {
                        ...item,
                        totalQuantity: 0
                    };
                }
                materials[item.id].totalQuantity += item.quantity || 1;
            }
        });
    }

    // Mostra os materiais
    Object.values(materials).forEach(material => {
        const materialElement = document.createElement('div');
        materialElement.className = 'material-card';
        materialElement.innerHTML = `
            <div class="material-icon">${material.icon}</div>
            <div class="material-name">${material.name}</div>
            <div class="material-quantity">x${material.totalQuantity}</div>
        `;
        materialsList.appendChild(materialElement);
    });

    if (materialsList.children.length === 0) {
        materialsList.innerHTML = '<p class="empty-state">Você não possui materiais</p>';
    }
}

// Remove materiais do inventário
function removeMaterialFromInventory(materialId, quantity) {
    if (!player.inventory?.consumables) return false;

    let remaining = quantity;
    
    for (let i = 0; i < player.inventory.consumables.length; i++) {
        const item = player.inventory.consumables[i];
        if (item.id === materialId && item.type === 'material') {
            const itemQty = item.quantity || 1;
            
            if (itemQty > remaining) {
                item.quantity -= remaining;
                remaining = 0;
                break;
            } else {
                remaining -= itemQty;
                player.inventory.consumables.splice(i, 1);
                i--; // Ajusta o índice após remoção
                
                if (remaining <= 0) break;
            }
        }
    }
    
    return remaining === 0;
}

// Obtém o ícone de um material
function getMaterialIcon(materialId) {
    // Verifica nos drops de monstros primeiro
    for (const monster in monsterDrops) {
        const drop = monsterDrops[monster].find(d => d.id === materialId);
        if (drop) return drop.icon;
    }
    
    // Verifica nos consumíveis
    const consumable = consumables.find(c => c.id === materialId);
    if (consumable) return consumable.icon;
    
    return '❓'; // Ícone padrão se não encontrado
}

// Obtém a quantidade de um material no inventário
function getMaterialQuantity(materialId) {
    if (!player.inventory?.consumables) return 0;
    
    return player.inventory.consumables
        .filter(item => item.id === materialId && item.type === 'material')
        .reduce((total, item) => total + (item.quantity || 1), 0);
}

// Salva o progresso do crafting
function saveCraftingProgress() {
    if (!player || !currentCrafting) return;
    
    player.alchemyData = {
        recipeId: Object.keys(potionRecipes).find(key => potionRecipes[key].id === currentCrafting.id),
        startTime: Date.now(),
        endTime: craftingEndTime
    };
}

// Carrega o progresso do crafting
function loadCraftingProgress() {
    if (!player?.alchemyData) return;
    
    const recipeKey = player.alchemyData.recipeId;
    if (!recipeKey || !potionRecipes[recipeKey]) {
        resetCrafting();
        return;
    }
    
    currentCrafting = potionRecipes[recipeKey];
    craftingEndTime = player.alchemyData.endTime;
    
    // Verifica se já terminou
    if (Date.now() >= craftingEndTime) {
        finishCrafting();
    } else {
        isCrafting = true;
        startCraftingProgress();
    }
}

// Adiciona ao carregamento do jogo
document.addEventListener("DOMContentLoaded", () => {
    // Desbloqueia o laboratório se o jogador tiver nível suficiente
    if (player.level >= 40) {
        cityLocations.alchemy.locked = false;
    }
    
    // Atualiza a função onSelect do laboratório
    cityLocations.alchemy.onSelect = function() {
        if (this.locked) {
            alert("Você precisa ser nível 40 para desbloquear o Laboratório de Poções!");
            return;
        }
        showAlchemyScreen();
    };
});

// Adiciona ao escopo global
window.initAlchemySystem = initAlchemySystem;
window.showAlchemyScreen = showAlchemyScreen;