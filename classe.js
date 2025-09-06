window.classBonuses = {
    warrior: {
        name: "Guerreiro",
        description: "Tanque resistente com alta sobrevivência",
        bonuses: {
            hpMultiplier: 0.20,
            damageMultiplier: 0.10,
            defenseMultiplier: 0.05
        }
    },
    rogue: {
        name: "Ladino",
        description: "Especialista em saqueamento e agilidade",
        bonuses: {
            dropChance: 0.10,
            hpMultiplier: 0.10,
            defenseMultiplier: 0.10
        }
    },
    mage: {
        name: "Mago",
        description: "Aprendiz rápido com energia arcana",
        bonuses: {
            staminaBonus: 2,
            xpMultiplier: 0.25,
            damageMultiplier: 0.15
        }
    },
    archer: {
        name: "Arqueiro",
        description: "Atirador preciso com treino eficiente",
        bonuses: {
            damageMultiplier: 0.15,
            trainingCostReduction: 0.15,
            defenseMultiplier: 0.10
        }
    }
};

// Função para aplicar bônus persistentemente
function applyClassBonuses(player, className) {
    if (!player.baseStats) {
        player.baseStats = {
            maxHp: player.maxHp,
            damage: player.damage,
            defense: player.defense
        };
    }
    
    player.class = className;
    recalculateStats(player);
}

// Recalcula todos os atributos com bônus
function recalculateStats(player) {
    if (!player.class || !player.baseStats) return;

    const bonuses = classBonuses[player.class].bonuses || {};

    player.maxHp = Math.floor(player.baseStats.maxHp * (1 + (bonuses.hpMultiplier || 0)));
    player.hp = Math.min(player.hp, player.maxHp);

    player.damage = Math.floor(player.baseStats.damage * (1 + (bonuses.damageMultiplier || 0))) +
                    (player.equipmentBonus?.damage || 0);

    player.defense = Math.floor(player.baseStats.defense * (1 + (bonuses.defenseMultiplier || 0))) +
                     (player.equipmentBonus?.defense || 0);

    if (bonuses.staminaBonus) {
        player.maxStamina = 6 + bonuses.staminaBonus;
        player.stamina = Math.min(player.stamina, player.maxStamina);
    }
}

function showClassWelcomeMessage(className) {
    const classInfo = classBonuses[className];
    let message = `🏆 Você escolheu a classe ${classInfo.name}!\n\n` +
                 `📜 ${classInfo.description}\n\n` +
                 `✨ Bônus Exclusivos:\n`;
    
    // Lista todos os bônus
    if (classInfo.bonuses.hpMultiplier) {
        message += `- +${classInfo.bonuses.hpMultiplier * 100}% HP máximo\n`;
    }
    if (classInfo.bonuses.damageMultiplier) {
        message += `- +${classInfo.bonuses.damageMultiplier * 100}% Dano\n`;
    }
    if (classInfo.bonuses.defenseMultiplier) {
        message += `- +${classInfo.bonuses.defenseMultiplier * 100}% Defesa\n`;
    }
    if (classInfo.bonuses.staminaBonus) {
        message += `- +${classInfo.bonuses.staminaBonus} ⚡ Stamina máxima\n`;
    }
    if (classInfo.bonuses.xpMultiplier) {
        message += `- +${classInfo.bonuses.xpMultiplier * 100}% XP ganho\n`;
    }
    if (classInfo.bonuses.dropChance) {
        message += `- +${classInfo.bonuses.dropChance * 100}% chance de drops\n`;
    }
    if (classInfo.bonuses.trainingCostReduction) {
        message += `- ${classInfo.bonuses.trainingCostReduction * 100}% de desconto no treino\n`;
    }
    
    // Exemplo prático
    message += `\n💡 Exemplo: Seu HP inicial será de ${Math.floor(20 * (1 + (classInfo.bonuses.hpMultiplier || 0)))} ` +
              `em vez de 20 (bônus aplicado)`;

    alert(message);
}

// Função para consultar benefícios a qualquer momento
function showClassBenefits() {
    if (!player.class) {
        alert("Você ainda não escolheu uma classe!");
        return;
    }
    
    const className = player.class;
    const classInfo = classBonuses[className];
    
    let message = `🏅 Classe Atual: ${classInfo.name}\n\n` +
                 `🔍 Seus Benefícios:\n`;
    
    if (className === 'warrior') {
        message += `- Sua vida máxima é 20% maior\n` +
                   `- Seu dano é 10% maior\n` +
                   `- Sua defesa é 5% maior`;
    }
    else if (className === 'rogue') {
        message += `- 10% mais chance de encontrar itens\n` +
                   `- 10% mais vida máxima\n` +
                   `- 10% mais defesa`;
    }
    else if (className === 'mage') {
        message += `- +2 pontos de stamina máxima\n` +
                   `- Ganha 25% mais XP\n` +
                   `- 15% mais dano em ataques`;
    }
    else if (className === 'archer') {
        message += `- 15% mais dano\n` +
                   `- 15% de desconto no treino\n` +
                   `- 10% mais defesa`;
    }
    
    message += `\n\n📊 Seus Atributos Atuais:\n` +
               `❤️ HP: ${player.maxHp} (Base: ${player.baseStats.maxHp})\n` +
               `⚔️ Dano: ${player.damage} (Base: ${player.baseStats.damage})\n` +
               `🛡️ Defesa: ${player.defense} (Base: ${player.baseStats.defense})`;
    
    alert(message);
}