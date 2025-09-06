const monstersByEnvironment = {
    floresta: [
        {
            name: "Rato Faminto",
            img: "assets/ratfaminto.png",
            hp: 10, damage: 2, defense: 0, coins: 10, xp: 8, level: 1
        },
        {
            name: "Lobo Solitário",
            img: "assets/lobao.png",
            hp: 25, damage: 5, defense: 1, coins: 25, xp: 15, level: 3
        },
        {
            name: "Aranha Gigante",
            img: "assets/aranha.jpg",
            hp: 50, damage: 10, defense: 4, coins: 45, xp: 25, level: 5
        },
        {
            name: "Urso",
            img: "assets/urso.jpg",
            hp: 80, damage: 14, defense: 6, coins: 70, xp: 40, level: 7
        },
        {
            name: "Espírito da Floresta",
            img: "assets/espflor.jpeg",
            hp: 120, damage: 18, defense: 8, coins: 120, xp: 60, level: 9
        }
    ],

    vulcao: [
        {
            name: "Elemental do Fogo",
            img: "assets/elementarfire.png",
            hp: 250, damage: 35, defense: 15, coins: 200, xp: 75, level: 10
        },
        {
            name: "Salamandra Flamejante",
            img: "assets/salafire.jpg",
            hp: 350, damage: 50, defense: 18, coins: 550, xp: 90, level: 12
        },
        {
            name: "Demônio Menor",
            img: "assets/demonp.png",
            hp: 500, damage: 75, defense: 20, coins: 800, xp: 120, level: 14
        },
        {
            name: "Fênix Renascida",
            img: "assets/fenix.jpg",
            hp: 600, damage: 80, defense: 22, coins: 1400, xp: 160, level: 16
        },
        {
            name: "Senhor da Lava",
            img: "assets/senhor.jpg",
            hp: 900, damage: 120, defense: 25, coins: 2000, xp: 200, level: 18
        }
    ],

    castelo: [
        {
            name: "Cavaleiro Fantasma",
            img: "assets/cavaleiro.jpg",
            hp: 950, damage: 180, defense: 40, coins: 2500, xp: 240, level: 20
        },
        {
            name: "Feiticeiro Sombrio",
            img: "assets/sombriomage.png",
            hp: 1050, damage: 200, defense: 50, coins: 3200, xp: 280, level: 22
        },
        {
            name: "Gárgula de Pedra",
            img: "assets/pedragg.jpg",
            hp: 1200, damage: 225, defense: 55, coins: 4000, xp: 320, level: 24
        },
        {
            name: "Vampiro Nobre",
            img: "assets/vampire.jpg",
            hp: 1500, damage: 260, defense: 70, coins: 5500, xp: 360, level: 26
        },
        {
            name: "Lich Real",
            img: "assets/lich.jpg",
            hp: 2000, damage: 300, defense: 95, coins: 7500, xp: 420, level: 28
        }
    ],

    geleira: [
        {
            name: "Golem de Gelo",
            img: "assets/icegolem.jpg",
            hp: 3500, damage: 320, defense: 110, coins: 8500, xp: 460, level: 32
        },
        {
            name: "Yeti",
            img: "assets/yetti.jpg",
            hp: 5000, damage: 350, defense: 120, coins: 10000, xp: 500, level: 34
        },
        {
            name: "Fada do Gelo",
            img: "assets/fadagelo.jpg",
            hp: 7500, damage: 380, defense: 125, coins: 12500, xp: 560, level: 36
        },
        {
            name: "Rainha do Inverno",
            img: "assets/queen.jpg",
            hp: 10000, damage: 475, defense: 160, coins: 16000, xp: 650, level: 38
        },
        {
            name: "Dragão Glacial",
            img: "assets/draggelo.jpg",
            hp: 14000, damage: 650, defense: 190, coins: 22000, xp: 800, level: 40
        }
    ],

    abismo: [
        {
            name: "Kraken das Profundezas",
            img: "assets/kraken.jpg",
            hp: 16000, damage: 800, defense: 225, coins: 30000, xp: 1000, level: 45
        },
        {
            name: "Leviatã Ancestral",
            img: "assets/leviathan.png",
            hp: 18000, damage: 850, defense: 250, coins: 40000, xp: 1250, level: 50
        },
        {
            name: "Devorador de Almas",
            img: "assets/soul-eater.png",
            hp: 20000, damage: 900, defense: 300, coins: 55000, xp: 1500, level: 55
        }
    ],

    infernal: [
        {
            name: "Senhor do Tormento",
            img: "assets/torment-lord.png",
            hp: 25000, damage: 1050, defense: 350, coins: 70000, xp: 1800, level: 60
        },
        {
            name: "Balrog Implacável",
            img: "assets/balrog.png",
            hp: 32000, damage: 1300, defense: 420, coins: 85000, xp: 2500, level: 65
        },
        {
            name: "Archdemônio",
            img: "assets/archdemon.png",
            hp: 36000, damage: 1750, defense: 525, coins: 120000, xp: 4000, level: 70
        }
    ],

    celestial: [
        {
            name: "Anjo Caído",
            img: "assets/fallen-angel.png",
            hp: 40000, damage: 2000, defense: 650, coins: 135000, xp: 5500, level: 75
        },
        {
            name: "Serafim da Justiça",
            img: "assets/seraphim.png",
            hp: 45000, damage: 2500, defense: 750, coins: 250000, xp: 6600, level: 85
        },
        {
            name: "Trono Celestial",
            img: "assets/celestial-throne.jpg",
            hp: 55000, damage: 3000, defense: 1000, coins: 350000, xp: 8000, level: 95
        }
    ],

    cosmic: [
        {
            name: "Avatar do Vácuo",
            img: "assets/cosmic-entity.jpg",
            hp: 65000, damage: 3500, defense: 1400, coins: 500000, xp: 10000, level: 100
        },
        {
            name: "Devorador de Mundos",
            img: "assets/world-eater.png",
            hp: 80000, damage: 4000, defense: 1800, coins: 750000, xp: 10000, level: 120
        },
        {
            name: "Entidade Cósmica",
            img: "assets/void-avatar.jpeg",
            hp: 100000, damage: 5000, defense: 2500, coins: 1000000, xp: 16000, level: 150
        }
    ]
};