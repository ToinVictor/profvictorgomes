const quests = {
    lv1: [
        {
        id: 1,
        title: "Primeiros Passos",
        description: "Derrote 3 Ratos Famintos na Floresta",
        objective: { type: "kill", target: "Rato Faminto", amount: 3, environment: "floresta" },
        reward: { coins: 20, xp: 10 },
        requiredLevel: 1
        },
        {
        id: 2,
        title: "Primeira Cura",
        description: "Recupere um total de 150 pontos de vida no Templo",
        objective: { type: "heal", amount: 150 },
        reward: { coins: 80, xp: 15 },
        requiredLevel: 1
        },
        {
        id: 3,
        title: "Esgrima Básica I",
        description: "Melhore seu DANO 2 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "damage", amount: 2 },
        reward: { coins: 50, xp: 5 },
        requiredLevel: 1
        },
        {
        id: 4,
        title: "Resistência Básica I",
        description: "Melhore sua DEFESA 2 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "defense", amount: 2 },
        reward: { coins: 100, xp: 5 },
        requiredLevel: 1
        },
        {
        id: 5,
        title: "FÉ Básica I",
        description: "Melhore seu HP 2 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "maxHp", amount: 2 },
        reward: { coins: 30, xp: 5 },
        requiredLevel: 1
        }
    ],

    lv5: [
        {
        id: 6,
        title: "Coletor de Mel",
        description: "Derrote 5 Ursos",
        objective: { type: "kill", target: "Urso", amount: 5, environment: "floresta" },
        reward: { coins: 500, xp: 50 },
        requiredLevel: 5
        },
        {
        id: 7,
        title: "Guerreiro Aprimorado",
        description: "Melhore cada atributo pelo menos 3 vezes",
        objective: { 
        type: "upgrade_all_stats", 
        stats: ["damage", "maxHp", "defense"],
                amount: 3 
                        },
        reward: { coins: 1000, xp: 40 },
        requiredLevel: 5
        },
        {
        id: 8,
        title: "Purificador da Floresta",
        description: "Derrote 6 Espírito da Floresta",
        objective: { type: "kill", target: "Espírito da Floresta", amount: 6, environment: "floresta" },
        reward: { coins: 750, xp: 300 },
        requiredLevel: 5
        },
        {
        id: 9,
        title: "Mestre da Floresta",
        description: "Derrote 1 de cada monstro da Floresta",
        objective: { 
        type: "kill_all_monsters", 
                monsters: ["Rato Faminto", "Lobo Solitário", "Aranha Gigante", "Urso", "Espírito da Floresta"],
                environment: "floresta"
            },
        reward: { coins: 1200, xp: 150 },
        requiredLevel: 5
        },
    ],

    lv10: [
        {
        id: 10,
        title: "Desafio do Vulcão",
        description: "Derrote 15 monstros diferentes no Vulcão",
        objective: { 
            type: "kill_all_monsters", 
                monsters: ["Elemental do Fogo", "Salamandra Flamejante", "Demônio Menor", "Fênix Renascida", "Senhor da Lava"],
                environment: "vulcao"
            },
        reward: { coins: 4500, xp: 500 },
        requiredLevel: 10
        },
        {
        id: 11,
        title: "Tesouro do Aventureiro I",
        description: "Acumule 15,000 moedas",
        objective: { type: "earn_coins", amount: 15000 },
        reward: { coins: 5000, xp: 200 },
        requiredLevel: 10
        },
    ],

    lv20: [
        {
        id: 12,
        title: "Esgrima Básica II",
        description: "Melhore seu DANO 10 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "damage", amount: 10 },
        reward: { coins: 7500, xp: 500 },
        requiredLevel: 20
        },
        {
        id: 13,
        title: "Resistência Básica II",
        description: "Melhore sua DEFESA 10 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "defense", amount: 10 },
        reward: { coins: 15000, xp: 500 },
        requiredLevel: 20
        },
        {
        id: 14,
        title: "FÉ Básica II",
        description: "Melhore seu HP 10 vezes no centro de treinamento",
        objective: { type: "upgrade", stat: "maxHp", amount: 10 },
        reward: { coins: 7500, xp: 500 },
        requiredLevel: 20
        },
        {
        id: 15,
        title: "Medo de Fantasma",
        description: "Derrote 4 Cavaleiros Fantasmas",
        objective: { type: "kill", target: "Cavaleiro Fantasma", amount: 4, environment: "castelo" },
        reward: { coins: 5000, xp: 500 },
        requiredLevel: 20
        },
        {
        id: 16,
        title: "Leve alho",
        description: "Derrote 4 Vampiro Nobre",
        objective: { type: "kill", target: "Vampiro Nobre", amount: 4, environment: "castelo" },
        reward: { coins: 10000, xp: 1000 },
        requiredLevel: 20
        },
        {
        id: 17,
        title: "Esqueleto e magia?",
        description: "Derrote o Lich Real",
        objective: { type: "kill", target: "Lich Real", amount: 1, environment: "castelo" },
        reward: { coins: 8000, xp: 500 },
        requiredLevel: 20
        },
    ],

    lv25: [
        {
        id: 18,
        title: "Primeiro trabalho",
        description: "Complete qualquer trabalho",
        objective: { type: "complete_job", amount: 1 },
        reward: { coins: 10000, xp: 350 },
        //isDaily: true,
        //resetTime: "00:00",
        requiredLevel: 25
        },
        {
        id: 19,
        title: "Tesouro do Aventureiro II",
        description: "Acumule 50,000 moedas",
        objective: { type: "earn_coins", amount: 50000 },
        reward: { coins: 25000, xp: 500 },
        requiredLevel: 25
        },
    ],

    lv30: [
    {
        id: 20,
        title: "Dominador do Vulcão",
        description: "Derrote 1 de cada monstro do Vulcão",
        objective: { 
            type: "kill_all_monsters", 
            monsters: ["Elemental do Fogo", "Salamandra Flamejante", "Demônio Menor", "Fênix Renascida", "Senhor da Lava"],
            environment: "vulcao"
        },
        reward: { coins: 20000, xp: 1000 },
        requiredLevel: 30
    },
    {
        id: 21,
        title: "Caçador de Dragões",
        description: "Derrote 3 Dragões Glaciais",
        objective: { type: "kill", target: "Dragão Glacial", amount: 3, environment: "geleira" },
        reward: { coins: 30000, xp: 1500 },
        requiredLevel: 35
    },
    {
        id: 22,
        title: "Mestre das Armas",
        description: "Equipe 5 armas diferentes",
        objective: { type: "equip_items", itemType: "weapon", amount: 5 },
        reward: { coins: 25000, xp: 800 },
        requiredLevel: 30
    }
    ],

    lv40: [
    {
        id: 23,
        title: "Desafiador do Abismo",
        description: "Derrote 1 de cada monstro do Abismo",
        objective: { 
            type: "kill_all_monsters", 
            monsters: ["Kraken das Profundezas", "Leviatã Ancestral", "Devorador de Almas"],
            environment: "abismo"
        },
        reward: { coins: 50000, xp: 2000 },
        requiredLevel: 40
    },
    {
        id: 24,
        title: "Colecionador Épico",
        description: "Colete 10 materiais raros",
        objective: { type: "collect_materials", amount: 10, rarity: "rare" },
        reward: { coins: 40000, xp: 1500, item: "Espada Épica" },
        requiredLevel: 45
    },
    {
        id: 25,
        title: "Vendedor Profissional",
        description: "Venda itens no valor total de 500.000 moedas",
        objective: { type: "sell_items", amount: 500000 },
        reward: { coins: 100000, xp: 2500 },
        requiredLevel: 40
    }
    ],

    lv50: [
    {
        id: 26,
        title: "Aniquilador Infernal",
        description: "Derrote 1 de cada monstro do Reino Infernal",
        objective: { 
            type: "kill_all_monsters", 
            monsters: ["Senhor do Tormento", "Balrog Implacável", "Archdemônio"],
            environment: "infernal"
        },
        reward: { coins: 75000, xp: 3000 },
        requiredLevel: 50
    },
    {
        id: 27,
        title: "Ascensão Celestial",
        description: "Derrote 1 de cada monstro do Reino Celestial",
        objective: { 
            type: "kill_all_monsters", 
            monsters: ["Anjo Caído", "Serafim da Justiça", "Trono Celestial"],
            environment: "celestial"
        },
        reward: { coins: 100000, xp: 4000 },
        requiredLevel: 55
    },
    {
        id: 28,
        title: "Desafiador Cósmico",
        description: "Derrote a Entidade Cósmica",
        objective: { type: "kill", target: "Entidade Cósmica", amount: 1, environment: "cosmic" },
        reward: { coins: 150000, xp: 5000, item: "Armadura Cósmica" },
        requiredLevel: 60
    }
    ],

    daily: [
        {
        id: 10001,
        title: "Caçador do Dia I",
        description: "Derrote 15 monstros de qualquer tipo",
        objective: { type: "kill_any", amount: 15 },
        reward: { coins: 1000, xp: 150},
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 10
        },
        {
        id: 10002,
        title: "Treino Diário I",
        description: "Melhore qualquer atributo 1 vezes",
        objective: { type: "upgrade_any", amount: 1 },
        reward: { coins: 2500, xp: 150 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 15
        },
        {
        id: 10003,
        title: "Explorador Diário I",
        description: "Derrote monstros em 3 ambientes diferentes",
        objective: { 
        type: "kill_multiple_environments", 
                environments: ["floresta", "vulcao", "castelo", "geleira", "infernal", "abismo", "celestial", "cosmic"],
                amount: 3 
            },
        reward: { coins: 7500, xp: 250 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 20
        },
        {
        id: 10004,
        title: "Tesouro Diário I",
        description: "Ganhe 30,000 moedas",
        objective: { type: "earn_coins", amount: 30000 },
        reward: { coins: 5000, xp: 100 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 20
        },
        {
        id: 10005,
        title: "Caçador do Dia II",
        description: "Derrote 15 monstros de qualquer tipo",
        objective: { type: "kill_any", amount: 15 },
        reward: { coins: 25000, xp: 500},
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 30
        },
        {
        id: 10006,
        title: "Treino Diário II",
        description: "Melhore qualquer atributo 4 vezes",
        objective: { type: "upgrade_any", amount: 4 },
        reward: { coins: 25000, xp: 500 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 30
        },
        {
        id: 10007,
        title: "Explorador Diário II",
        description: "Derrote monstros em 2 ambientes diferentes lv20+",
        objective: { 
        type: "kill_multiple_environments", 
                environments: ["castelo", "geleira", "infernal", "abismo", "celestial", "cosmic"],
                amount: 2 
            },
        reward: { coins: 25000, xp: 500 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 30
        },
        {
        id: 10008,
        title: "Tesouro Diário II",
        description: "Ganhe 100,000 moedas",
        objective: { type: "earn_coins", amount: 100000 },
        reward: { coins: 75000, xp: 1250 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 40
        },
        {
        id: 10009,
        title: "Caçador do Dia III",
        description: "Derrote 15 monstros de qualquer tipo",
        objective: { type: "kill_any", amount: 15 },
        reward: { coins: 150000, xp: 1250},
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 40
        },
        {
        id: 10010,
        title: "Treino Diário III",
        description: "Melhore qualquer atributo 5 vezes",
        objective: { type: "upgrade_any", amount: 5 },
        reward: { coins: 1500000, xp: 1500 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 40
        },
        {
        id: 10011,
        title: "Explorador Diário III",
        description: "Derrote monstros em 2 ambientes diferentes lv30+",
        objective: { 
        type: "kill_multiple_environments", 
                environments: ["geleira", "infernal", "abismo", "celestial", "cosmic"],
                amount: 2 
            },
        reward: { coins: 500000, xp: 1500 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 40
        },
        {
        id: 10012,
        title: "Caçador de Elite Diário",
        description: "Derrote 5 monstros de nível 30+",
        objective: { type: "kill_high_level", amount: 5, minLevel: 30 },
        reward: { coins: 50000, xp: 1000 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 30
    },
    {
        id: 10013,
        title: "Mercador Diário",
        description: "Venda itens no valor total de 100.000 moedas",
        objective: { type: "sell_items", amount: 100000 },
        reward: { coins: 25000, xp: 500 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 25
    },
    {
        id: 10014,
        title: "Ferreiro Diário",
        description: "Melhore cada atributo pelo menos 1 vez",
        objective: { 
            type: "upgrade_all_stats", 
            stats: ["damage", "maxHp", "defense"],
            amount: 1 
        },
        reward: { coins: 30000, xp: 750 },
        isDaily: true,
        resetTime: "00:00",
        requiredLevel: 20
    }
    ]
};