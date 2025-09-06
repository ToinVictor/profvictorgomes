window.consumables = [
    {
        id: 3001,
        name: "Poção de Cura",
        type: "consumable",
        effect: { hp: 20 },
        value: 8,
        icon: "🧪",
        description: "Restaura 20 pontos de vida",
        requiredLevel: 1,
        shopPrice: 75
    },
    {
        id: 3002,
        name: "Poção Média de Cura",
        type: "consumable",
        effect: { hp: 350 },
        value: 70,
        icon: "🧪",
        description: "Restaura 350 pontos de vida",
        requiredLevel: 5,
        shopPrice: 700
    },
    {
        id: 3003,
        name: "Tônico de Energia",
        type: "consumable",
        effect: { stamina: 1 },
        value: 50,
        icon: "⚡",
        description: "Restaura 1 ponto de stamina",
        requiredLevel: 5,
        shopPrice: 500
    },
    {
        id: 3004,
        name: "Grande Tônico de Energia",
        type: "consumable",
        effect: { stamina: 2 },
        value: 300,
        icon: "⚡",
        description: "Restaura 2 pontos de stamina",
        requiredLevel: 10,
        shopPrice: 950
    },
    {
        id: 3005,
        name: "Essência do Conhecimento",
        type: "consumable",
        effect: { xp: 350 },
        value: 60,
        icon: "📘",
        description: "Ganha 350 pontos de experiência",
        requiredLevel: 8,
        shopPrice: 6000
    },

    //NOVOS ITENS
    {
        id: 3006,
        name: "Poção da Riqueza",
        type: "consumable",
        effect: { goldMultiplier: 0.5, duration: 10800 }, // 50% mais ouro
        value: 2500,
        icon: "💰",
        description: "Aumenta o ouro recebido em 50% por 3 horas.",
        requiredLevel: 10,
        shopPrice: 25000
    },
    {
        id: 3007,
        name: "Essência da Experiência",
        type: "consumable",
        effect: { xpMultiplier: 0.5, duration: 10800 }, // 50% mais XP
        value: 2500,
        icon: "📘",
        description: "Aumenta a experiência recebida em 50% por 3 horas.",
        requiredLevel: 10,
        shopPrice: 25000
    },
    {
        id: 3008,
        name: "Poção de Força",
        type: "consumable",
        effect: { damagePercent: 0.25, duration: 10800 },
        value: 2500,
        icon: "💪",
        description: "Aumenta o dano em 25% por 3 horas.",
        requiredLevel: 10,
        shopPrice: 25000
    },
    {
        id: 3009,
        name: "Poção de Pele de Pedra",
        type: "consumable",
        effect: { defensePercent: 0.25, duration: 10800 },
        value: 2500,
        icon: "🛡️",
        description: "Aumenta a defesa em 25% por 3 horas.",
        requiredLevel: 10,
        shopPrice: 25000
    },
    {
        id: 3010,
        name: "Poção Vital",
        type: "consumable",
        effect: { maxHpPercent: 0.25, duration: 10800 },
        value: 2500,
        icon: "❤️",
        description: "Aumenta a vida máxima em 25% por 3 horas.",
        requiredLevel: 10,
        shopPrice: 25000
    }
];
