const gameItems = {
    weapons: window.weapons || [],
    armor: window.armor || [],
    consumables: window.consumables || []
};

const specialItems = {
    questRewards: window.questRewards || {},
    monsterDrops: window.monsterDrops || {}
};

// Funções comuns
function getItemById(itemId) {
    // Verifica primeiro nos itens normais
    for (const category in gameItems) {
        const foundItem = gameItems[category].find(item => item.id === itemId);
        if (foundItem) return foundItem;
    }
    
    // Verifica itens especiais de recompensa
    for (const questId in specialItems.questRewards) {
        if (specialItems.questRewards[questId].id === itemId) {
            return specialItems.questRewards[questId];
        }
    }
    
    // Verifica drops de monstros
    for (const monsterName in specialItems.monsterDrops) {
        const foundItem = specialItems.monsterDrops[monsterName].find(item => item.id === itemId);
        if (foundItem) return foundItem;
    }
    
    return null;
}

function getMonsterDrops(monsterName) {
    return specialItems.monsterDrops[monsterName] || [];
}

// Adiciona ao escopo global
window.gameItems = gameItems;
window.specialItems = specialItems;
window.getItemById = getItemById;
window.getMonsterDrops = getMonsterDrops;