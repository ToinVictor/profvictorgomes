// locations.js - Sistema de locais de batalha

const battleLocations = {
    floresta: {
        name: "Floresta Sombria",
        minLevel: 1,
        maxLevel: 10,
        icon: "🌲",
        description: "Monstros: LvL 1-9",
        bgImage: "assets/florest.jpg"
    },
    vulcao: {
        name: "Montanha Vulcânica",
        minLevel: 10,
        maxLevel: 20,
        icon: "🌋",
        description: "Monstros: LvL 10-18",
        bgImage: "assets/bg-volcano.jpg",
        unlockMessage: "Desbloqueado no nível 10"
    },
    castelo: {
        name: "Castelo Amaldiçoado",
        minLevel: 20,
        maxLevel: 35,
        icon: "🏰",
        description: "Monstros: LvL 20-28",
        bgImage: "assets/bg-castle.jpg",
        unlockMessage: "Desbloqueado no nível 20"
    },
    geleira: {
        name: "Geleira Eterna",
        minLevel: 30,
        maxLevel: 30,
        icon: "❄️",
        description: "Monstros: LvL 32-40",
        bgImage: "assets/bg-glacier.jpg",
        unlockMessage: "Desbloqueado no nível 30"
    },
    // Novos locais adicionados
    abismo: {
        name: "Abismo Profundo",
        minLevel: 40,
        maxLevel: 40,
        icon: "🕳️",
        description: "Monstros: LvL 45-55",
        bgImage: "assets/bg-celestial.jpg",
        unlockMessage: "Desbloqueado no nível 40"
    },
    infernal: {
        name: "Portas do Inferno",
        minLevel: 55,
        maxLevel: 50,
        icon: "🔥",
        description: "Monstros: LvL 60-70",
        bgImage: "assets/bg-abyss.jpg",
        unlockMessage: "Desbloqueado no nível 55"
    },
    celestial: {
        name: "Plano Celestial",
        minLevel: 70,
        maxLevel: 60,
        icon: "☁️",
        description: "Monstros: LvL 75-90",
        bgImage: "assets/bg-infernal.jpg",
        unlockMessage: "Desbloqueado no nível 70"
    },
    cosmic: {
        name: "Vórtice Cósmico",
        minLevel: 90,
        maxLevel: 100,
        icon: "🌀",
        description: "Monstros: LvL 100-150",
        bgImage: "assets/bg-cosmic.jpg",
        unlockMessage: "Desbloqueado no nível 90"
    }
};

// Função para verificar se um local está desbloqueado
function isLocationUnlocked(locationKey) {
    const location = battleLocations[locationKey];
    return player.level >= location.minLevel;
}

// Função para mostrar locais com base no nível do jogador
function showAvailableLocations() {
    const arenaGrid = document.querySelector('#arena-select-screen .arena-grid');
    if (!arenaGrid) return;

    arenaGrid.innerHTML = '';

    for (const [key, location] of Object.entries(battleLocations)) {
        const locationCard = document.createElement('div');
        locationCard.className = 'arena-card';
        
        if (!isLocationUnlocked(key)) {
            locationCard.classList.add('locked');
            locationCard.innerHTML = `
                <div class="arena-icon">🔒</div>
                <div class="arena-name">${location.name}</div>
                <div class="arena-desc">${location.unlockMessage}</div>
                <div class="arena-level-req">Nível ${location.minLevel}+</div>
            `;
        } else {
            locationCard.innerHTML = `
                <div class="arena-icon">${location.icon}</div>
                <div class="arena-name">${location.name}</div>
                <div class="arena-desc">${location.description}</div>
            `;
            locationCard.addEventListener('click', () => {
                if (isLocationUnlocked(key)) {
                    showMonsterSelection(key);
                }
            });
        }
        
        arenaGrid.appendChild(locationCard);
    }
}

// Função para obter o nome do local
function getLocationName(environment) {
    return battleLocations[environment]?.name || environment;
}
