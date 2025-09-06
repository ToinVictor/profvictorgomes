import { initGame } from './script.js';
import * as Inventory from './inventory.js';
import * as Shop from './shop.js';

// Exportar funções para o escopo global
Object.assign(window, Inventory, Shop);

document.addEventListener("DOMContentLoaded", initGame);