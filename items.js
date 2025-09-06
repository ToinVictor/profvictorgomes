// items.js - Sistema de itens do jogo

const gameItems = {
    weapons: [
        {
            id: 1001,
            name: "Espada de Ferro",
            type: "weapon",
            damage: 5,
            value: 100,
            icon: "⚔️",
            description: "Uma espada básica de ferro",
            requiredLevel: 1,
            shopPrice: 150
        },
        {
            id: 1002,
            name: "Machado de Batalha",
            type: "weapon",
            damage: 8,
            value: 200,
            icon: "🪓",
            description: "Machado pesado para golpes poderosos",
            requiredLevel: 3,
            shopPrice: 250
        },
        {
            id: 1003,
            name: "Espada Longa de Aço",
            type: "weapon",
            damage: 12,
            value: 400,
            icon: "⚔️",
            description: "Espada afiada de aço temperado",
            requiredLevel: 5,
            shopPrice: 600
        },
        {
            id: 1004,
            name: "Lâmina do Dragão",
            type: "weapon",
            damage: 25,
            value: 1500,
            icon: "🗡️",
            description: "Lâmina forjada com escamas de dragão",
            requiredLevel: 15,
            shopPrice: 2000
        }
    ],
    armor: [
        {
            id: 2001,
            name: "Armadura de Couro",
            type: "armor",
            defense: 3,
            value: 150,
            icon: "🛡️",
            description: "Armadura leve feita de couro resistente",
            requiredLevel: 1,
            shopPrice: 200
        },
        {
            id: 2002,
            name: "Elmo de Aço",
            type: "armor",
            defense: 5,
            value: 250,
            icon: "⛑️",
            description: "Elmo resistente que protege a cabeça",
            requiredLevel: 3,
            shopPrice: 350
        },
        {
            id: 2003,
            name: "Armadura de Placas",
            type: "armor",
            defense: 10,
            value: 600,
            icon: "🛡️",
            description: "Armadura pesada de placas de metal",
            requiredLevel: 8,
            shopPrice: 800
        },
        {
            id: 2004,
            name: "Manto Élfico",
            type: "armor",
            defense: 8,
            value: 800,
            icon: "🧥",
            description: "Manto encantado pelos elfos da floresta",
            requiredLevel: 12,
            shopPrice: 1200
        }
    ],
    consumables: [
        {
            id: 3001,
            name: "Poção de Cura",
            type: "consumable",
            effect: { hp: 20 },
            value: 50,
            icon: "🧪",
            description: "Restaura 20 pontos de vida",
            requiredLevel: 1,
            shopPrice: 75
        },
        {
            id: 3002,
            name: "Poção de Energia",
            type: "consumable",
            effect: { stamina: 5 },
            value: 75,
            icon: "⚗️",
            description: "Restaura 5 pontos de energia",
            requiredLevel: 2,
            shopPrice: 100
        },
        {
            id: 3003,
            name: "Poção de Cura Maior",
            type: "consumable",
            effect: { hp: 50 },
            value: 150,
            icon: "🧪",
            description: "Restaura 50 pontos de vida",
            requiredLevel: 5,
            shopPrice: 200
        },
        {
            id: 3004,
            name: "Elixir de Força",
            type: "consumable",
            effect: { damage: 5 }, // Efeito temporário (por batalha)
            value: 300,
            icon: "🍶",
            description: "Aumenta o dano em 5 pontos por 1 batalha",
            requiredLevel: 7,
            shopPrice: 400
        }
    ]
};

// Itens especiais que podem ser obtidos como recompensa de missões ou drops
const specialItems = {
    questRewards: {
        100000013: { // Recompensa da missão "Lenda do Vulcão"
            id: 4001,
            name: "Capa Flamejante",
            type: "armor",
            defense: 12,
            value: 1200,
            icon: "🧣",
            description: "Capa resistente ao fogo, recompensa por derrotar o Senhor da Lava",
            requiredLevel: 10
        },
        100000014: { // Recompensa da missão "Destruidor de Castelos"
            id: 4002,
            name: "Cetro Arcano",
            type: "weapon",
            damage: 20,
            value: 1500,
            icon: "🔮",
            description: "Cetro carregado com poder arcano",
            requiredLevel: 15
        }
    },
    monsterDrops: {
        "Espírito da Floresta": [
            {
                id: 5001,
                name: "Semente da Vida",
                type: "consumable",
                effect: { hp: 30 },
                value: 100,
                icon: "🌱",
                description: "Semente mágica que restaura vida quando consumida",
                dropChance: 0.3 // 30% de chance de drop
            }
        ],
        "Dragão Glacial": [
            {
                id: 5002,
                name: "Escama de Dragão",
                type: "material",
                value: 50000,
                icon: "❄️",
                description: "Escama rara de um dragão glacial",
                dropChance: 0.1 // 10% de chance de drop
            }
        ],
    }
};

// Função para obter um item por ID
function getItemById(itemId) {
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

// Função para verificar se um monstro tem drops
function getMonsterDrops(monsterName) {
    return specialItems.monsterDrops[monsterName] || [];
}