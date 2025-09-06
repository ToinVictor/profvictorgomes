// city.js - Sistema da Cidade

const cityLocations = {
    shop: {
        name: "Loja do Aventureiro",
        icon: "🏪",
        description: "Compre itens e equipamentos",
        screen: "shop",
        onSelect: function() {
            if (typeof initShop === 'function') {
                initShop();
            }
            showScreen(this.screen);
        }
    },
    temple: {
        name: "Templo da Cura",
        icon: "🛐",
        description: "Recupere sua saúde",
        screen: "temple"
    },
    training: {
        name: "Centro de Treinamento",
        icon: "🏋️",
        description: "Aprimore suas habilidades",
        screen: "train"
    },
    work: {
            name: "Agência de Trabalho",
            icon: "💼",
            description: "Trabalhe para ganhar moedas",
            screen: "work",
            requiredLevel: 25,
            onSelect: function() {
                if (player.level < this.requiredLevel) {
                    alert(`Você precisa ser nível ${this.requiredLevel} para acessar a Agência de Trabalho!`);
                    return;
                }
                // Garante que o sistema de trabalho está inicializado
                if (typeof initWorkSystem === 'function') {
                    initWorkSystem();
                }
                // Mostra a tela de trabalho
                if (typeof showWorkScreen === 'function') {
                    showWorkScreen();
                } else {
                    showScreen(this.screen);
                }
            }
    },
    alchemy: {
        name: "Laboratório de Poções",
        icon: "🧪",
        description: "Crie poções e buffs",
        screen: "alchemy",
        locked: true,
        onSelect: function() {
            if (this.locked) {
                alert("Você precisa ser nível 40 para desbloquear o Laboratório de Poções!");
                return;
            }
            // Garante que o sistema de alquimia está inicializado
            if (typeof initAlchemySystem === 'function') {
                initAlchemySystem();
            }
            // Mostra a tela de alquimia
            if (typeof showAlchemyScreen === 'function') {
                showAlchemyScreen();
            } else {
                showScreen(this.screen);
            }
        }
    }
};

function showCityScreen() {
    const cityGrid = document.getElementById('city-grid');
    if (!cityGrid) return;

    cityGrid.innerHTML = '';

    for (const [key, location] of Object.entries(cityLocations)) {
        const locationCard = document.createElement('div');
        locationCard.className = 'city-card';
        locationCard.dataset.location = key;
        
        if (player.level < (location.requiredLevel || 0)) {
            locationCard.classList.add('locked');
            locationCard.innerHTML = `
                <div class="city-icon">🔒</div>
                <div class="city-name">${location.name}</div>
                <div class="city-desc">Nível ${location.requiredLevel} necessário</div>
            `;
        } else {
            // Destaque especial se for o local de trabalho e houver trabalho ativo
            const isWorkLocation = key === 'work' && isWorking;
            
            locationCard.innerHTML = `
                <div class="city-icon">${location.icon}</div>
                <div class="city-name">${isWorkLocation ? '🏃 ' : ''}${location.name}</div>
                <div class="city-desc">${location.description}</div>
            `;
            
            if (isWorkLocation) {
                locationCard.classList.add('active-work');
            }
            
            locationCard.addEventListener('click', () => {
                if (location.onSelect) {
                    location.onSelect();
                } else {
                    showScreen(location.screen);
                }
            });
        }
        
        cityGrid.appendChild(locationCard);
    }
}