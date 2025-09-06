// Adiciona inventário ao objeto player - Atualizado
// Adiciona inventário ao objeto player
function initPlayerInventory() {
    if (!player.inventory) {
        player.inventory = {
            weapons: [],
            armor: [],
            consumables: [],
            equipped: {
                weapon: null,
                armor: null
            },
            initialItemsGiven: false
        };
    }
}

//FUÇÃO QUE PERMITE O NOVO TEMPLO FUNCIONAR SEM BUG acho que não é mais necessária, porém não testei
function useHealthPotion() {
    healPlayerPercentage(30); // Cura 30% do HP
}

// Função para adicionar item ao inventário - Atualizada
function addItemToInventory(itemId) {
    initPlayerInventory(); // Garante estrutura de inventário

    const itemToAdd = getItemById(itemId);
    if (!itemToAdd) {
        console.error("Item não encontrado:", itemId);
        return false;
    }

    // Define categoria
    let category;
    switch (itemToAdd.type) {
        case 'weapon': category = 'weapons'; break;
        case 'armor': category = 'armor'; break;
        case 'consumable':
        case 'material':  // Materiais vão para a mesma categoria de consumíveis
            category = 'consumables'; break;
        default:
            console.error("Categoria desconhecida:", itemToAdd.type);
            return false;
    }

    // Para armas e armaduras, sempre adiciona como novo item
    if (category === 'weapons' || category === 'armor') {
        player.inventory[category].push({ ...itemToAdd, quantity: 1 });
        updateInventoryDisplay?.();
        return true;
    }

    // Para consumíveis e materiais, verifica se já existe
    const existingIndex = player.inventory[category].findIndex(i => i.id === itemToAdd.id);
    
    if (existingIndex !== -1) {
        // Se já existir, incrementa a quantidade
        player.inventory[category][existingIndex].quantity += 1;
    } else {
        // Adiciona nova entrada com quantidade 1
        player.inventory[category].push({ ...itemToAdd, quantity: 1 });
    }

    updateInventoryDisplay?.();
    return true;
}

// Função auxiliar para encontrar um item no inventário
function findItemInInventory(itemId) {
    for (const category in player.inventory) {
        if (category === 'equipped' || category === 'initialItemsGiven') continue;
        
        const index = player.inventory[category].findIndex(item => item.id === itemId);
        if (index !== -1) {
            return { found: true, category, index };
        }
    }
    return { found: false };
}

// Função para equipar item - Atualizada para somar atributos
function equipItem(itemId) {
    initPlayerInventory();
    
    // Encontra o item no inventário
    let itemToEquip = null;
    let category = null;
    
    // Procura em todas as categorias de itens
    for (const cat in player.inventory) {
        if (cat === 'equipped' || cat === 'initialItemsGiven') continue;
        
        const foundIndex = player.inventory[cat].findIndex(item => item.id === itemId);
        if (foundIndex !== -1) {
            itemToEquip = {...player.inventory[cat][foundIndex]};
            category = cat === 'weapons' ? 'weapon' : 
                      cat === 'armor' ? 'armor' : null;
            break;
        }
    }
    
    if (itemToEquip && category) {
        // Se já tinha algo equipado, remove os bônus primeiro
        if (player.inventory.equipped[category]) {
            const currentItem = player.inventory.equipped[category];
            if (category === 'weapon') {
                player.damage -= currentItem.damage;
            } else if (category === 'armor') {
                player.defense -= currentItem.defense;
            }
            
            // Devolve o item equipado para o inventário
            player.inventory[category === 'weapon' ? 'weapons' : 'armor'].push(currentItem);
        }
        
        // Remove o item do inventário
        player.inventory[category === 'weapon' ? 'weapons' : 'armor'] = 
            player.inventory[category === 'weapon' ? 'weapons' : 'armor'].filter(item => item.id !== itemId);
        
        // Equipa o novo item
        player.inventory.equipped[category] = itemToEquip;
        
        // Aplica os bônus
        // Ao equipar item
        if (category === 'weapon') {
            player.equipmentBonus.damage = itemToEquip.damage;
        } else if (category === 'armor') {
            player.equipmentBonus.defense = itemToEquip.defense;
        }
        // Depois:
        recalculateStats(player);

        checkAchievementProgress("equip_item", { itemType: itemToEquip.type });

        updateInventoryDisplay();
        updateStatus();
        return true;
    }
    return false;
}

// Função para desequipar item - Nova função
function unequipItem(category) {
    if (player.inventory.equipped[category]) {
        const item = player.inventory.equipped[category];
        
        // Remove os bônus
        if (category === 'weapon') {
            player.equipmentBonus.damage = 0;
        } else if (category === 'armor') {
            player.equipmentBonus.defense = 0;
        }

        recalculateStats(player);
        
        // Adiciona de volta ao inventário
        player.inventory[category === 'weapon' ? 'weapons' : 'armor'].push(item);
        player.inventory.equipped[category] = null;
        
        updateInventoryDisplay();
        updateStatus();
        return true;
    }
    return false;
}

// Atualiza a função de usar consumível para incluir efeitos temporários
function useConsumable(itemId) {
    initPlayerInventory();

    const foundIndex = player.inventory.consumables.findIndex(item => item.id === itemId);
    if (foundIndex === -1) return false;

    const item = player.inventory.consumables[foundIndex];

    if (item.type === 'material') {
        console.log("Materiais não podem ser usados diretamente.");
        return false;
    }

    const effect = item.effect || {};
    if (!player.tempEffects) player.tempEffects = {};

    // Efeitos imediatos
    if (effect.hp) {
        player.hp = Math.min(player.hp + effect.hp, player.maxHp);
    }
    if (effect.stamina) {
        player.stamina = Math.min(player.stamina + effect.stamina, player.maxStamina);
    }
    if (effect.xp) {
        addXp(effect.xp);
    }

    // Efeitos temporários
    if (
        effect.goldMultiplier || effect.xpMultiplier ||
        effect.damagePercent || effect.defensePercent || effect.maxHpPercent
    ) {
        const id = item.id;
        const temp = {
            ...effect,
            appliedAt: Date.now()
        };

        // Aplica os bônus diretamente
        if (effect.damagePercent) {
            temp.bonusValue = Math.floor(player.damage * effect.damagePercent);
            player.damage += temp.bonusValue;
        }
        if (effect.defensePercent) {
            temp.bonusValue = Math.floor(player.defense * effect.defensePercent);
            player.defense += temp.bonusValue;
        }
        if (effect.maxHpPercent) {
            temp.bonusValue = Math.floor(player.maxHp * effect.maxHpPercent);
            player.maxHp += temp.bonusValue;
            player.hp += temp.bonusValue;
        }

        player.tempEffects[id] = temp;

        // Remove o efeito após o tempo
        setTimeout(() => {
            const current = player.tempEffects[id];
            if (!current) return;

            if (current.damagePercent) player.damage -= current.bonusValue;
            if (current.defensePercent) player.defense -= current.bonusValue;
            if (current.maxHpPercent) {
                player.maxHp -= current.bonusValue;
                player.hp = Math.min(player.hp, player.maxHp);
            }

            delete player.tempEffects[id];
            updateStatus();
            alert(`${item.name} expirou!`);
        }, effect.duration * 1000);
    }

    // Consome o item
    item.quantity--;
    if (item.quantity <= 0) {
        player.inventory.consumables.splice(foundIndex, 1);
    }

    updateInventoryDisplay();
    updateStatus();
    return true;
}

function updateActiveEffects() {
    const container = document.getElementById('active-effects');
    if (!container) return;

    if (!player.tempEffects || Object.keys(player.tempEffects).length === 0) {
        container.innerHTML = `<em>Nenhum efeito ativo</em>`;
        return;
    }

    let html = "<strong>Efeitos Ativos:</strong><ul>";
    for (const effect of Object.values(player.tempEffects)) {
        const remaining = Math.max(0, Math.ceil((effect.appliedAt + effect.duration * 1000 - Date.now()) / 1000));
        let desc = [];

        if (effect.damagePercent) desc.push(`+${Math.floor(effect.damagePercent * 100)}% Dano`);
        if (effect.defensePercent) desc.push(`+${Math.floor(effect.defensePercent * 100)}% Defesa`);
        if (effect.maxHpPercent) desc.push(`+${Math.floor(effect.maxHpPercent * 100)}% HP Máx`);
        if (effect.goldMultiplier) desc.push(`+${Math.floor(effect.goldMultiplier * 100)}% Ouro`);
        if (effect.xpMultiplier) desc.push(`+${Math.floor(effect.xpMultiplier * 100)}% XP`);

        html += `<li class="effect">${desc.join(', ')} (${remaining}s)</li>`;
    }
    html += "</ul>";
    container.innerHTML = html;
}

// Função para mostrar a tela de inventário - Atualizada
function showInventoryScreen() {
    initPlayerInventory();
    
    // Ativa a primeira aba
    document.querySelector('.inventory-tab').classList.add('active');
    document.getElementById('weapons-list').style.display = 'block';
    document.getElementById('armor-list').style.display = 'none';
    document.getElementById('consumables-list').style.display = 'none';
    
    updateInventoryDisplay();
    document.getElementById('inventory-screen').classList.remove('d-none');
    
    // Adiciona event listeners para as abas
    document.querySelectorAll('.inventory-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove classe active de todas as abas
            document.querySelectorAll('.inventory-tab').forEach(t => t.classList.remove('active'));
            
            // Adiciona classe active apenas à aba clicada
            this.classList.add('active');
            
            // Esconde todos os conteúdos
            document.getElementById('weapons-list').style.display = 'none';
            document.getElementById('armor-list').style.display = 'none';
            document.getElementById('consumables-list').style.display = 'none';
            
            // Mostra o conteúdo correspondente
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-list`).style.display = 'block';
        });
    });
}

// Função para atualizar a exibição do inventário - Atualizada
function updateInventoryDisplay() {
    initPlayerInventory();
    
    const equippedContainer = document.getElementById('equipped-items');
    const weaponsContainer = document.getElementById('weapons-list');
    const armorContainer = document.getElementById('armor-list');
    const consumablesContainer = document.getElementById('consumables-list');
    
    // Limpa os containers
    equippedContainer.innerHTML = '';
    weaponsContainer.innerHTML = '';
    armorContainer.innerHTML = '';
    consumablesContainer.innerHTML = '';
    
    // Mostra itens equipados
    if (player.inventory.equipped.weapon) {
        const weapon = player.inventory.equipped.weapon;
        equippedContainer.innerHTML += `
            <div class="inventory-item equipped">
                <div class="item-icon">${weapon.icon}</div>
                <div class="item-info">
                    <h5>${weapon.name}</h5>
                    <p>Dano: +${weapon.damage}</p>
                    <button onclick="unequipItem('weapon')" class="btn btn-unequip">Desequipar</button>
                </div>
            </div>
        `;
    }
    
    if (player.inventory.equipped.armor) {
        const armor = player.inventory.equipped.armor;
        equippedContainer.innerHTML += `
            <div class="inventory-item equipped">
                <div class="item-icon">${armor.icon}</div>
                <div class="item-info">
                    <h5>${armor.name}</h5>
                    <p>Defesa: +${armor.defense}</p>
                    <button onclick="unequipItem('armor')" class="btn btn-unequip">Desequipar</button>
                </div>
            </div>
        `;
    }
    
    // Mostra armas no inventário
    player.inventory.weapons.forEach(weapon => {
        weaponsContainer.innerHTML += `
            <div class="inventory-item">
                <div class="item-icon">${weapon.icon}</div>
                <div class="item-info">
                    <h5>${weapon.name}</h5>
                    <p>Dano: +${weapon.damage}</p>
                    <button onclick="equipItem(${weapon.id})" class="btn btn-equip">Equipar</button>
                </div>
            </div>
        `;
    });
    
    // Mostra armaduras no inventário
    player.inventory.armor.forEach(armor => {
        armorContainer.innerHTML += `
            <div class="inventory-item">
                <div class="item-icon">${armor.icon}</div>
                <div class="item-info">
                    <h5>${armor.name}</h5>
                    <p>Defesa: +${armor.defense}</p>
                    <button onclick="equipItem(${armor.id})" class="btn btn-equip">Equipar</button>
                </div>
            </div>
        `;
    });
    
    // Mostra consumíveis no inventário (com quantidade)
    player.inventory.consumables.forEach(consumable => {
    const isMaterial = consumable.type === 'material';
    
    consumablesContainer.innerHTML += `
        <div class="inventory-item ${isMaterial ? 'material-item' : ''}">
            <div class="item-icon">${consumable.icon}</div>
            <div class="item-info">
                <h5>${consumable.name} <span class="item-quantity">x${consumable.quantity}</span></h5>
                <p>${consumable.description}</p>
                ${isMaterial ? 
                    `<div class="item-value">Valor: ${consumable.value} moedas</div>` : 
                    `<button onclick="useConsumable(${consumable.id})" class="btn btn-use">Usar</button>`
                }
            </div>
        </div>
    `;
});
    
    // Mostra mensagem se estiver vazio
    if (player.inventory.weapons.length === 0 && !player.inventory.equipped.weapon) {
        weaponsContainer.innerHTML = '<p class="empty-inventory">Nenhuma arma no inventário</p>';
    }
    
    if (player.inventory.armor.length === 0 && !player.inventory.equipped.armor) {
        armorContainer.innerHTML = '<p class="empty-inventory">Nenhuma armadura no inventário</p>';
    }
    
    if (player.inventory.consumables.length === 0) {
        consumablesContainer.innerHTML = '<p class="empty-inventory">Nenhum consumível no inventário</p>';
    }
}

// Adiciona itens iniciais quando o jogador atinge nível 10 - Atualizado
function checkForInitialItems() {
    if (player.level >= 10 && !player.inventory?.initialItemsGiven) {
        addItemToInventory(1); // Espada de Ferro
        addItemToInventory(2001); // Armadura de Couro
        addItemToInventory(3001); // Poção de Cura

        player.inventory.initialItemsGiven = true;
        
        alert("Você alcançou o nível 10 e recebeu itens iniciais no seu inventário!");
    }
}

function getMaterialQuantity(materialId) {
    if (!player.inventory?.consumables) return 0;
    
    const material = player.inventory.consumables.find(item => 
        item.id === materialId && item.type === 'material');
    
    return material ? material.quantity : 0;
}

// Função para verificar drops após derrotar um monstro
// Em classe.js, modifique checkMonsterDrops:
function checkMonsterDrops(monsterName) {
    const drops = getMonsterDrops(monsterName);
    const obtainedItems = [];
    let dropMessage = "";
    
    if (player.class === 'rogue') {
        dropMessage = "\n(Bônus de Ladino: +10% chance de drops)";
    }

    drops.forEach(drop => {
        const effectiveChance = player.class === 'rogue' ? 
            drop.dropChance * 1.1 : 
            drop.dropChance;
            
        if (Math.random() <= effectiveChance) {
            if (addItemToInventory(drop.id)) {
                obtainedItems.push(drop);
            }
        }
    });

    if (obtainedItems.length > 0 && player.class === 'rogue') {
        showDropNotification(obtainedItems, dropMessage);
    }
    
    return obtainedItems;
}

function showDropNotification(items, bonusMessage = "") {
    let message = "Você obteve:\n";
    items.forEach(item => {
        message += `- ${item.name}\n`;
    });
    message += bonusMessage;
    
    // Você pode usar alert ou criar um sistema de notificação mais bonito
    console.log(message); // Para teste
    alert(message);
}

// Adiciona ao carregar o jogo - Atualizado
document.addEventListener("DOMContentLoaded", () => {
    // Habilita o botão de inventário
    const inventoryBtn = document.querySelector('.btn-inventory');
    if (inventoryBtn) {
        inventoryBtn.addEventListener('click', showInventoryScreen);
        inventoryBtn.disabled = false;
    }
    
    // Verifica itens iniciais periodicamente
    setInterval(checkForInitialItems, 10000);
});

//VENDAS
// Adicione estas funções ao inventory.js

// Variável para armazenar itens selecionados para venda
let itemsToSell = [];

// Mostra a tela de venda
function showSellScreen() {
    initPlayerInventory();
    itemsToSell = [];
    
    // Salva o HTML original do inventário para restaurar depois
    const inventoryScreen = document.getElementById('inventory-screen');
    inventoryScreen.dataset.originalContent = inventoryScreen.innerHTML;
    
    // Atualiza o container de venda
    inventoryScreen.innerHTML = `
        <div class="screen-container sell-screen">
            <h2 class="screen-title">VENDER ITENS</h2>
            <p class="screen-description">Selecione os itens que deseja vender</p>
            
            <div class="inventory-tabs">
                <button class="inventory-tab active" data-category="weapons">Armas ⚔️</button>
                <button class="inventory-tab" data-category="armor">Armaduras 🛡️</button>
                <button class="inventory-tab" data-category="consumables">Consumíveis 🧪</button>
            </div>
            
            <div class="inventory-content">
                <div class="inventory-category" id="weapons-list">
                    ${renderSellableItems('weapons')}
                </div>
                
                <div class="inventory-category" id="armor-list">
                    ${renderSellableItems('armor')}
                </div>
                
                <div class="inventory-category" id="consumables-list">
                    ${renderSellableItems('consumables')}
                </div>
            </div>
            
            <div class="sell-total">
                Total: <span id="sell-total-value">0</span> moedas
            </div>
            
            <div class="sell-actions">
                <button onclick="confirmSell()" class="btn btn-sell" disabled id="confirm-sell-btn">
                    <span class="btn-icon">💰</span> VENDER ITENS SELECIONADOS
                </button>
                <button onclick="exitSellScreen()" class="btn btn-return">
                    <span class="btn-icon">⬅️</span> VOLTAR
                </button>
            </div>
        </div>
    `;
    
    // Configura as abas
    document.querySelectorAll('.inventory-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.inventory-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.getElementById('weapons-list').style.display = 'none';
            document.getElementById('armor-list').style.display = 'none';
            document.getElementById('consumables-list').style.display = 'none';
            
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-list`).style.display = 'block';
        });
    });
    
    // Mostra a primeira aba por padrão
    document.getElementById('weapons-list').style.display = 'block';
    document.getElementById('armor-list').style.display = 'none';
    document.getElementById('consumables-list').style.display = 'none';
}

// Adicione esta nova função para sair da tela de vendas
function exitSellScreen() {
    const inventoryScreen = document.getElementById('inventory-screen');
    // Restaura o conteúdo original do inventário
    inventoryScreen.innerHTML = inventoryScreen.dataset.originalContent;
    // Mostra o inventário novamente
    showInventoryScreen();
}

// Renderiza os itens que podem ser vendidos
function renderSellableItems(category) {
    const itemMap = {};

    // Agrupa itens por ID, somando quantidades
    player.inventory[category].forEach(item => {
        const key = item.id;
        if (!itemMap[key]) {
            itemMap[key] = { ...item, totalQuantity: 0 };
        }
        itemMap[key].totalQuantity += item.quantity || 1;
    });

    const availableItems = Object.values(itemMap).filter(item => {
        const isEquipped = (category === 'weapons' && player.inventory.equipped.weapon?.id === item.id) ||
                           (category === 'armor' && player.inventory.equipped.armor?.id === item.id);
        return !isEquipped || item.totalQuantity > 1;
    });

    if (availableItems.length === 0) {
        return '<p class="empty-inventory">Nenhum item para vender</p>';
    }

    let html = '';
    availableItems.forEach(item => {
        const isSelected = itemsToSell.some(i => i.id === item.id && i.originalCategory === category);
        const quantityDisplay = item.totalQuantity > 1 ? `(x${item.totalQuantity})` : '';

        html += `
        <div class="sell-item ${isSelected ? 'selected' : ''} ${item.type === 'material' ? 'material-item' : ''}">
            <div class="item-icon">${item.icon}</div>
            <div class="sell-item-info">
                <h5>${item.name} ${quantityDisplay}</h5>
                <p>${item.description || ''}</p>
                <div class="sell-item-value">Valor: ${Math.floor(item.value * 0.7)} moedas cada</div>
                ${item.type === 'material' ? '<div class="material-tag">Material</div>' : ''}
            </div>
            <div class="sell-item-controls">
                ${item.totalQuantity > 1 ? `
                <div class="quantity-selector">
                    <button onclick="event.stopPropagation(); adjustSellQuantity(${item.id}, -1)" class="btn btn-quantity">-</button>
                    <input type="number" id="quantity-${item.id}" min="1" max="${item.totalQuantity}" value="1" onchange="updateSellQuantity(${item.id})">
                    <button onclick="event.stopPropagation(); adjustSellQuantity(${item.id}, 1)" class="btn btn-quantity">+</button>
                </div>
                ` : ''}
                <button onclick="event.stopPropagation(); toggleSellItem(${item.id}, '${category}')" class="btn btn-sell-item">
                    ${isSelected ? '❌' : '💰'}
                </button>
            </div>
        </div>
        `;
    });

    return html;
}

// Adiciona novas funções para controle de quantidade
function adjustSellQuantity(itemId, change) {
    const input = document.getElementById(`quantity-${itemId}`);
    if (!input) return;
    
    let newValue = parseInt(input.value) + change;
    const max = parseInt(input.max);
    
    if (newValue < 1) newValue = 1;
    if (newValue > max) newValue = max;
    
    input.value = newValue;
    updateSellQuantity(itemId);
}

function updateSellQuantity(itemId) {
    const input = document.getElementById(`quantity-${itemId}`);
    if (!input) return;
    
    const quantity = parseInt(input.value);
    const max = parseInt(input.max);
    
    if (isNaN(quantity)) {
        input.value = 1;
        return;
    }
    
    if (quantity < 1) input.value = 1;
    if (quantity > max) input.value = max;
    
    // Atualiza a quantidade no itemsToSell
    const itemIndex = itemsToSell.findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        itemsToSell[itemIndex].sellQuantity = parseInt(input.value);
        updateSellDisplay();
    }
}

// Alterna um item para a lista de venda
function toggleSellItem(itemId, category) {
    const item = player.inventory[category].find(i => i.id === itemId);
    if (!item) return;

    const quantityInput = document.getElementById(`quantity-${itemId}`);
    const sellQuantity = quantityInput ? parseInt(quantityInput.value) : 1;

    const existingIndex = itemsToSell.findIndex(i => i.id === itemId && i.originalCategory === category);

    if (existingIndex === -1) {
        // Calcula total disponível
        const totalQuantity = player.inventory[category]
            .filter(i => i.id === itemId)
            .reduce((sum, i) => sum + (i.quantity || 1), 0);

        itemsToSell.push({
            ...item,
            originalCategory: category,
            sellQuantity: sellQuantity,
            totalQuantity: totalQuantity
        });
    } else {
        itemsToSell.splice(existingIndex, 1);
    }

    updateSellDisplay();
}

// Atualiza a exibição da tela de venda
function updateSellDisplay() {
    // Atualiza o total
    const totalValue = itemsToSell.reduce((sum, item) => {
        return sum + Math.floor(item.value * 0.7) * item.sellQuantity;
    }, 0);
    document.getElementById('sell-total-value').textContent = totalValue;
    
    // Ativa/desativa o botão de confirmação
    document.getElementById('confirm-sell-btn').disabled = itemsToSell.length === 0;
    
    // Atualiza os itens para mostrar os selecionados
    document.querySelectorAll('.sell-item').forEach(itemElement => {
        // Encontra o ID do item de forma mais robusta
        const onclickAttr = itemElement.getAttribute('onclick');
        if (!onclickAttr) return;
        
        const match = onclickAttr.match(/toggleSellItem\((\d+)/);
        if (!match) return;
        
        const itemId = parseInt(match[1]);
        const isSelected = itemsToSell.some(i => i.id === itemId);
        
        itemElement.classList.toggle('selected', isSelected);
        const button = itemElement.querySelector('.btn-sell-item');
        if (button) {
            button.innerHTML = isSelected ? '❌' : '💰';
        }
    });
}

// Confirma a venda dos itens selecionados
function confirmSell() {
    if (itemsToSell.length === 0) return;

    const totalValue = itemsToSell.reduce((sum, item) => {
        return sum + (Math.floor(item.value * 0.7) * item.sellQuantity);
    }, 0);

    if (confirm(`Tem certeza que deseja vender ${itemsToSell.reduce((sum, item) => sum + item.sellQuantity, 0)} itens por ${totalValue} moedas?`)) {
        itemsToSell.forEach(item => {
            const category = item.originalCategory;

            if (category === 'weapons' || category === 'armor') {
                let toRemove = item.sellQuantity;
                player.inventory[category] = player.inventory[category].filter(i => {
                    if (i.id === item.id && toRemove > 0) {
                        toRemove--;
                        return false;
                    }
                    return true;
                });
            } else {
                let toRemove = item.sellQuantity;

                for (let i = 0; i < player.inventory[category].length; i++) {
                    const invItem = player.inventory[category][i];
                    if (invItem.id === item.id) {
                        const itemQty = invItem.quantity || 1;

                        if (itemQty > toRemove) {
                            invItem.quantity -= toRemove;
                            toRemove = 0;
                            break;
                        } else {
                            toRemove -= itemQty;
                            player.inventory[category].splice(i, 1);
                            i--; // Corrige o índice após remoção
                            if (toRemove <= 0) break;
                        }
                    }
                }
            }
        });

        player.coins += totalValue;

        checkAchievementProgress("earn_coins", { amount: totalValue });
        checkQuestProgress("earn_coins", { amount: totalValue });

        updateStatus();
        alert(`Você vendeu os itens por ${totalValue} moedas!`);
        itemsToSell = [];

        // Atualiza a tela
        document.getElementById('weapons-list').innerHTML = renderSellableItems('weapons');
        document.getElementById('armor-list').innerHTML = renderSellableItems('armor');
        document.getElementById('consumables-list').innerHTML = renderSellableItems('consumables');
        document.getElementById('sell-total-value').textContent = '0';
        document.getElementById('confirm-sell-btn').disabled = true;
    }
}

// Configura as abas do inventário
function setupInventoryTabs() {
    document.querySelectorAll('.inventory-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove classe active de todas as abas
            document.querySelectorAll('.inventory-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Adiciona classe active à aba clicada
            this.classList.add('active');
            
            // Esconde todos os conteúdos
            document.getElementById('weapons-list').style.display = 'none';
            document.getElementById('armor-list').style.display = 'none';
            document.getElementById('consumables-list').style.display = 'none';
            
            // Mostra o conteúdo correspondente
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-list`).style.display = 'block';
        });
    });
}

// Modifique o event listener DOMContentLoaded para:
document.addEventListener("DOMContentLoaded", () => {
    // Habilita o botão de inventário
    const inventoryBtn = document.querySelector('.btn-inventory');
    if (inventoryBtn) {
        inventoryBtn.addEventListener('click', () => {
            showInventoryScreen();
            setupInventoryTabs(); // Configura as abas ao abrir o inventário
        });
        inventoryBtn.disabled = false;
    }
    
    // Verifica itens iniciais periodicamente
    setInterval(checkForInitialItems, 10000);
});

// No final do arquivo, em vez de export, adicione ao escopo global:
window.initPlayerInventory = initPlayerInventory;
window.addItemToInventory = addItemToInventory;
window.findItemInInventory = findItemInInventory;
window.equipItem = equipItem;
window.unequipItem = unequipItem;
window.useConsumable = useConsumable;
window.showInventoryScreen = showInventoryScreen;
window.updateInventoryDisplay = updateInventoryDisplay;
window.checkForInitialItems = checkForInitialItems;
window.checkMonsterDrops = checkMonsterDrops;
window.showSellScreen = showSellScreen;
window.exitSellScreen = exitSellScreen;
window.confirmSell = confirmSell;
window.toggleSellItem = toggleSellItem;