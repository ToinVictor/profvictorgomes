// Inicializa a loja
function initShop() {
    if (!player.shop) {
        player.shop = {
            lastRefresh: Date.now(),
            availableItems: []
        };
    }
    refreshShop();
    updateShopDisplay();
}

// Atualiza os itens disponíveis na loja com base no nível do jogador
function refreshShop() {
    player.shop.availableItems = [];
    
    // Adiciona itens de cada categoria que o jogador pode comprar
    for (const category in gameItems) {
        gameItems[category].forEach(item => {
            if (item.requiredLevel <= player.level) {
                player.shop.availableItems.push({
                    ...item,
                    stock: category === 'consumables' ? 5 : 1 // Consumíveis têm mais estoque
                });
            }
        });
    }
    
    player.shop.lastRefresh = Date.now();
}

// Função para comprar um item da loja
function buyItem(itemId) {
    const shopItem = player.shop.availableItems.find(item => item.id === itemId);
    if (!shopItem) {
        alert("Item não encontrado na loja!");
        return false;
    }
    
    if (player.coins < shopItem.shopPrice) {
        alert(`Moedas insuficientes! Você precisa de ${shopItem.shopPrice} moedas.`);
        return false;
    }
    
    if (shopItem.stock <= 0) {
        alert("Este item está esgotado!");
        return false;
    }
    
    // Deduz o preço e adiciona ao inventário
    player.coins -= shopItem.shopPrice;
    addItemToInventory(itemId);
    
    // Atualiza o estoque
    shopItem.stock--;
    
    // Atualiza a UI
    updateStatus();
    updateShopDisplay();
    
    alert(`Você comprou ${shopItem.name} por ${shopItem.shopPrice} moedas!`);
    return true;
}

// Mostra a tela da loja
function showShopScreen() {
    // Inicializa a loja se não existir
    if (!player.shop) {
        player.shop = {
            lastRefresh: Date.now(),
            availableItems: []
        };
        refreshShop();
    }
    
    // Atualiza a exibição
    updateShopDisplay();
    
    // Mostra a tela da loja
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.add('d-none');
    });
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('shop-screen').classList.remove('d-none');
}

// Atualiza a exibição da loja
function updateShopDisplay() {
    document.getElementById('shop-coins-display').textContent = player.coins.toLocaleString();
    const shopContainer = document.getElementById('shop-items-container');
    if (!shopContainer) return;
    
    shopContainer.innerHTML = '';
    
    if (player.shop.availableItems.length === 0) {
        shopContainer.innerHTML = '<p class="empty-shop">Nenhum item disponível na loja no momento</p>';
        return;
    }
    
    // Agrupa itens por categoria
    const categorizedItems = {
        weapons: [],
        armor: [],
        consumables: []
    };
    
    player.shop.availableItems.forEach(item => {
        if (item.type === 'weapon') categorizedItems.weapons.push(item);
        else if (item.type === 'armor') categorizedItems.armor.push(item);
        else if (item.type === 'consumable') categorizedItems.consumables.push(item);
    });
    
    // Cria seções para cada categoria
    for (const category in categorizedItems) {
        if (categorizedItems[category].length > 0) {
            const categorySection = document.createElement('div');
            categorySection.className = 'shop-category';
            
            let categoryName = '';
            let categoryIcon = '';
            
            switch(category) {
                case 'weapons':
                    categoryName = 'Armas';
                    categoryIcon = '⚔️';
                    break;
                case 'armor':
                    categoryName = 'Armaduras';
                    categoryIcon = '🛡️';
                    break;
                case 'consumables':
                    categoryName = 'Consumíveis';
                    categoryIcon = '🧪';
                    break;
            }
            
            categorySection.innerHTML = `
                <h4 class="shop-category-title">${categoryIcon} ${categoryName}</h4>
                <div class="shop-items-grid" id="shop-${category}-items"></div>
            `;
            
            shopContainer.appendChild(categorySection);
            
            const itemsGrid = document.getElementById(`shop-${category}-items`);
            
            categorizedItems[category].forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'shop-item-card';
                itemCard.innerHTML = `
                    <div class="shop-item-header">
                        <div class="shop-item-icon">${item.icon}</div>
                        <h5 class="shop-item-name">${item.name}</h5>
                    </div>
                    <div class="shop-item-info">
                        <p class="shop-item-desc">${item.description}</p>
                        ${item.type === 'weapon' ? `<p>Dano: +${item.damage}</p>` : ''}
                        ${item.type === 'armor' ? `<p>Defesa: +${item.defense}</p>` : ''}
                        ${item.type === 'consumable' ? 
                            `<p>Efeito: ${item.effect.hp ? `+${item.effect.hp} HP` : ''} 
                            ${item.effect.stamina ? `+${item.effect.stamina} Energia` : ''}
                            ${item.effect.damage ? `+${item.effect.damage} Dano (1 batalha)` : ''}</p>` : ''}
                        <p class="shop-item-level">Nível requerido: ${item.requiredLevel}</p>
                        <p class="shop-item-stock">Disponível: ${item.stock}</p>
                    </div>
                    <div class="shop-item-footer">
                        <span class="shop-item-price">💰 ${item.shopPrice}</span>
                        <button onclick="buyItem(${item.id})" class="btn btn-buy" 
                            ${player.coins < item.shopPrice || item.stock <= 0 ? 'disabled' : ''}>
                            Comprar
                        </button>
                    </div>
                `;
                
                itemsGrid.appendChild(itemCard);
            });
        }
    }
}

// No final do arquivo, em vez de export, adicione ao escopo global:
window.initShop = initShop;
window.refreshShop = refreshShop;
window.buyItem = buyItem;
window.showShopScreen = showShopScreen;
window.updateShopDisplay = updateShopDisplay;