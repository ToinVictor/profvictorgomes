// work.js - Sistema de Trabalho

const jobs = {
    blacksmith: {
        id: 1,
        name: "Ferreiro",
        icon: "⚒️",
        description: "Forja equipamentos para outros aventureiros",
        requiredLevel: 25,
        duration: 8 * 60 * 60 * 1000, // 8 horas em milissegundos
        baseReward: {
            coins: 10000,
            xp: 450
        },
        // Recompensa escala com o nível
        rewardMultiplier: 1.15
    },
    alchemist: {
        id: 2,
        name: "Alquimista",
        icon: "🧪",
        description: "Prepara poções para a guilda",
        requiredLevel: 30,
        duration: 12 * 60 * 60 * 1000, // 12 horas
        baseReward: {
            coins: 20000,
            xp: 600
        },
        rewardMultiplier: 1.2
    },
    merchant: {
        id: 3,
        name: "Comerciante",
        icon: "💰",
        description: "Gerencia o comércio da cidade",
        requiredLevel: 35,
        duration: 24 * 60 * 60 * 1000, // 24 horas
        baseReward: {
            coins: 30000,
            xp: 750
        },
        rewardMultiplier: 1.25
    }
};

let currentJob = null;
let jobEndTime = 0;
let isWorking = false;
let workInitialized = false;
let jobStartTime = 0;

// Inicializa o sistema de trabalho
function initWorkSystem() {
    if (workInitialized) return;
    
    loadWorkProgress();
    checkWorkOnLoad();
    
    workInitialized = true;
    updateWorkStatus();
}


// Função para iniciar o intervalo de atualização do progresso
function startWorkProgressInterval() {
    // Limpa qualquer intervalo existente
    if (window.workProgressInterval) {
        clearInterval(window.workProgressInterval);
    }
    
    // Configura um novo intervalo para atualizar a cada segundo
    window.workProgressInterval = setInterval(() => {
        if (!isWorking) {
            clearInterval(window.workProgressInterval);
            return;
        }
        
        updateWorkProgressDisplay();
        
        // Verifica se o trabalho foi concluído
        if (Date.now() >= jobEndTime) {
            completeJob();
            clearInterval(window.workProgressInterval);
        }
    }, 1000); // Atualiza a cada segundo
}

// Nova função para completar trabalho:
function completeJob() {
    if (!currentJob) return;
    
    const reward = calculateReward(currentJob);
    player.coins += reward.coins;
    addXp(reward.xp);
    
    alert(`Trabalho concluído!\nVocê ganhou:\n💰 ${reward.coins.toLocaleString()} moedas\n⭐ ${reward.xp} XP`);
    
    // Verifica progresso de missões relacionadas a trabalho
    checkQuestProgress("complete_job", { jobName: currentJob.name });
    checkQuestProgress("complete_all_jobs", { jobName: currentJob.name });
    
    // Limpa o intervalo de atualização
    if (window.workProgressInterval) {
        clearInterval(window.workProgressInterval);
    }
    
    resetWork();
    saveWorkProgress();
    showWorkScreen();
}

// Mostra a tela de seleção de trabalhos
function showWorkScreen() {
    // Garante que o sistema está inicializado
    if (!workInitialized) {
        initWorkSystem();
    }

    // Verifica se há trabalho em andamento
    if (currentJob && jobEndTime) {
        const remainingTime = jobEndTime - Date.now();
        
        if (remainingTime <= 0) {
            completeJob();
        } else if (!isWorking) {
            isWorking = true;
            disableBattleWhileWorking();
            startWorkProgressInterval();
        }
    }

    const workGrid = document.getElementById('work-grid');
    if (!workGrid) return;
    
    workGrid.innerHTML = '';
    
    for (const [key, job] of Object.entries(jobs)) {
        const jobCard = document.createElement('div');
        jobCard.className = 'work-card';
        
        if (player.level < job.requiredLevel) {
            jobCard.classList.add('locked');
            jobCard.innerHTML = `
                <div class="work-icon">🔒</div>
                <div class="work-name">${job.name}</div>
                <div class="work-level-req">Nível ${job.requiredLevel}+</div>
                <div class="work-desc">${job.description}</div>
            `;
        } else {
            const isActiveJob = isWorking && currentJob && currentJob.id === job.id;
            
            jobCard.innerHTML = `
                <div class="work-icon">${job.icon}</div>
                <div class="work-name">${job.name}</div>
                <div class="work-duration">⏱️ ${formatDuration(job.duration)}</div>
                <div class="work-desc">${job.description}</div>
                <div class="work-reward">💰 ${calculateReward(job).coins.toLocaleString()} moedas + ⭐ ${calculateReward(job).xp} XP</div>
            `;
            
            if (isActiveJob) {
                jobCard.classList.add('active-job');
                const progress = calculateJobProgress();
                jobCard.innerHTML += `
                    <div class="work-progress">
                        <div class="progress-text">${formatTimeRemaining(jobEndTime - Date.now())}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                    </div>
                `;
            } else {
                jobCard.addEventListener('click', () => startJob(key));
            }
        }
        
        workGrid.appendChild(jobCard);
    }
    
    updateWorkStatus();
    showScreen('work');
}

// Inicia um trabalho
function startJob(jobKey) {
    if (isWorking || currentJob) {
        alert(`Você já está trabalhando como ${currentJob?.name || "um trabalho anterior"}!`);
        return;
    }

    const selectedJob = jobs[jobKey];
    if (!selectedJob) return;

    if (player.level < selectedJob.requiredLevel) {
        alert(`Você precisa ser nível ${selectedJob.requiredLevel} para este trabalho!`);
        return;
    }

    currentJob = selectedJob;
    jobStartTime = Date.now();
    jobEndTime = jobStartTime + currentJob.duration;
    isWorking = true;

    saveWorkProgress();
    disableBattleWhileWorking();
    updateWorkStatus();
    showWorkScreen();
    startWorkProgressInterval();

    alert(`Você começou a trabalhar como ${currentJob.name}! Volte após ${formatDuration(currentJob.duration)} para receber sua recompensa.`);
        // Feedback visual
    const jobCards = document.querySelectorAll('.work-card');
    jobCards.forEach(card => {
        if (card.querySelector('.work-name')?.textContent === currentJob.name) {
            card.classList.add('active-job');
        }
    });
    
    // Verifica se há missões ativas relacionadas a trabalho
    const hasJobQuests = player.activeQuests.some(q => 
        q.objective.type === "complete_job" || 
        q.objective.type === "complete_all_jobs"
    );
    
    if (hasJobQuests) {
        console.log("Missões de trabalho ativas - progresso será registrado");
    }
}

// Verifica trabalhos completados
// Adicione esta nova função para verificar trabalhos completados
function checkCompletedJobs() {
    if (currentJob && Date.now() >= jobEndTime) {
        completeJob();
    }
}

// Função para calcular o progresso do trabalho (0-100%)
function calculateJobProgress() {
    if (!currentJob || !jobEndTime) return 0;
    
    const now = Date.now();
    const elapsed = Math.min(now, jobEndTime) - jobStartTime;
    const totalDuration = currentJob.duration;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
}

function calculateOfflineWorkProgress() {
    if (!player.workData) return;

    const now = Date.now();
    const lastUpdate = player.workData.lastUpdate || now;
    const offlineTime = Math.max(0, now - lastUpdate);

    if (player.workData.isWorking && player.workData.jobEndTime) {
        // Se o trabalho deveria ter terminado durante o tempo offline
        if (now >= player.workData.jobEndTime) {
            completeJob();
        } else {
            // Ajusta os tempos para continuar de onde parou
            const timeWorkedOffline = Math.min(offlineTime, player.workData.jobEndTime - player.workData.jobStartTime);
            jobStartTime = now - (player.workData.jobEndTime - player.workData.jobStartTime - timeWorkedOffline);
            jobEndTime = player.workData.jobEndTime - (player.workData.lastUpdate - player.workData.jobStartTime) + timeWorkedOffline;
            
            // Mostra feedback ao jogador
            const hoursWorked = Math.floor(timeWorkedOffline / (1000 * 60 * 60));
            if (hoursWorked > 0) {
                console.log(`Trabalhou offline por ${hoursWorked} horas`);
            }
        }
    }
}

// Calcula a recompensa com base no nível
function calculateReward(job) {
    const levelBonus = player.level - job.requiredLevel;
    return {
        coins: Math.floor(job.baseReward.coins * Math.pow(job.rewardMultiplier, levelBonus)),
        xp: Math.floor(job.baseReward.xp * (1 + levelBonus * 0.1))
    };
}

// Formata a duração para exibição
function formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours}h`;
}

// Desativa batalhas durante o trabalho
function disableBattleWhileWorking() {
    const battleButtons = document.querySelectorAll('.btn-battle, .menu-item[onclick*="arena-select"]');
    battleButtons.forEach(button => {
        button.classList.add('disabled');
        button.onclick = null;
        button.title = "Você está trabalhando e não pode batalhar!";
        
        // Adiciona um indicador visual
        if (!button.querySelector('.working-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'working-indicator';
            indicator.textContent = ' 🏗️';
            button.appendChild(indicator);
        }
    });
}

// Reativa batalhas após o trabalho
function enableBattleAfterWork() {
    const battleButtons = document.querySelectorAll('.btn-battle, .menu-item[onclick*="arena-select"]');
    battleButtons.forEach(button => {
        button.classList.remove('disabled');
        button.onclick = () => showScreen('arena-select');
        button.title = "";
        
        // Remove o indicador visual
        const indicator = button.querySelector('.working-indicator');
        if (indicator) {
            button.removeChild(indicator);
        }
    });
}

// Atualiza o status na UI
function updateWorkStatus() {
    const workStatus = document.getElementById('work-status');
    if (!workStatus) return;

    if (currentJob) {
        const remaining = jobEndTime - Date.now();
        workStatus.innerHTML = `
            <div class="current-job">
                <h4>Trabalhando como: ${currentJob.name}</h4>
                <p>Tempo restante: ${formatTimeRemaining(remaining)}</p>
                <button onclick="cancelJob()" class="btn btn-cancel-job">Cancelar Trabalho</button>
            </div>
        `;
    } else {
        workStatus.innerHTML = `<p class="no-job">Você não está trabalhando no momento</p>`;
    }
}

// Função para atualizar o display do progresso
function updateWorkProgressDisplay() {
    if (!isWorking || !currentJob) return;
    
    // Atualiza o status na parte superior
    updateWorkStatus();
    
    // Atualiza a barra de progresso no card do trabalho
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        const jobId = card.querySelector('.work-name')?.textContent;
        if (jobId === currentJob.name) {
            const progressText = card.querySelector('.progress-text');
            const progressBar = card.querySelector('.progress');
            
            if (progressText && progressBar) {
                const remaining = jobEndTime - Date.now();
                progressText.textContent = formatTimeRemaining(remaining);
                progressBar.style.width = `${calculateJobProgress()}%`;
            }
        }
    });
}

// Função para cancelar o trabalho (com penalidade)
function cancelJob() {
    if (!currentJob) return;
    
    if (confirm("Cancelar este trabalho fará você perder toda a recompensa. Continuar?")) {
        // Limpa completamente o estado do trabalho SEM dar recompensa
        resetWork();
        
        // Atualiza a UI e salva o estado
        updateWorkStatus();
        saveWorkProgress();
        enableBattleAfterWork();
        
        // Mostra feedback
        alert("Trabalho cancelado! Você não recebeu nenhuma recompensa.");
        showWorkScreen();
    }
}

// Salva o progresso do trabalho
function saveWorkProgress() {
    if (!player) return;
    
    player.workData = {
        currentJob: currentJob?.id || null,
        jobStartTime: jobStartTime,
        jobEndTime: jobEndTime,
        isWorking: isWorking,
        lastUpdate: Date.now(),
        // Adiciona informações de trabalhos completados
        completedJobs: player.questProgress?.jobs || {}
    };
}

function checkWorkOnLoad() {
    if (player?.workData?.isWorking && player.workData.jobEndTime) {
        const now = Date.now();
        if (now >= player.workData.jobEndTime) {
            completeJob();
        }
    }
}

// Carrega o progresso do trabalho
function loadWorkProgress() {
    if (!player?.workData) return;

    // Carrega os dados básicos
    currentJob = Object.values(jobs).find(job => job.id === player.workData.currentJob);
    jobStartTime = player.workData.jobStartTime;
    jobEndTime = player.workData.jobEndTime;
    isWorking = player.workData.isWorking;

    const now = Date.now();
    
    // Verifica se o trabalho já foi completado em um carregamento anterior
    if (isWorking && now >= jobEndTime) {
        // Marca como não trabalhando ANTES de completar
        isWorking = false;
        saveWorkProgress(); // Salva o estado atualizado
        
        completeJob(); // Processa a recompensa
        return;
    }

    // Se ainda está trabalhando, continua normalmente
    if (isWorking) {
        disableBattleWhileWorking();
        startWorkProgressInterval();
    }
}

// Formata o tempo restante
function formatTimeRemaining(ms) {
    if (ms <= 0) return "Pronto para receber recompensa!";
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Formata para mostrar horas apenas se necessário
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}
// Verifica trabalhos completados periodicamente
//setInterval(checkCompletedJobs, 60000); // Checa a cada minuto

function resetWork() {
    // Limpa o intervalo de atualização
    if (window.workProgressInterval) {
        clearInterval(window.workProgressInterval);
        window.workProgressInterval = null;
    }
    
    // Reseta todas as variáveis de trabalho
    currentJob = null;
    jobEndTime = 0;
    isWorking = false;
    
    // Limpa dados do jogador
    if (player) {
        delete player.workData;
    }
    
    // Reativa batalhas
    enableBattleAfterWork();
    
    // Força atualização do status
    updateWorkStatus();
}

// Final CORRETO para work.js

// Inicialização ao carregar o jogo
document.addEventListener("DOMContentLoaded", () => {
    // Não inicie diretamente aqui - isso será feito pelo script.js
    // Apenas verifique se há trabalho completo pendente
    if (currentJob && Date.now() >= jobEndTime) {
        completeJob();
    }
});

// Sistema de verificação periódica (importante para casos edge)
const workCheckInterval = setInterval(() => {
    if (isWorking) {
        // Verifica se o trabalho foi concluído
        if (Date.now() >= jobEndTime) {
            completeJob();
        }
        // Atualiza o progresso a cada 5 segundos
        updateWorkProgressDisplay();
    }
}, 5000); // 5 segundos é um bom balance entre performance e precisão

// Salvamento robusto ao sair
window.addEventListener('beforeunload', () => {
    if (isWorking) {
        // Força um salvamento completo e preciso
        jobEndTime = jobStartTime + currentJob.duration; // Corrige possíveis desvios
        saveWorkProgress();
    }
});

// Função crítica para garantir limpeza ao sair
function cleanupWorkSystem() {
    clearInterval(workCheckInterval);
    if (window.workProgressInterval) {
        clearInterval(window.workProgressInterval);
    }
}

// Registra a limpeza para quando a janela/tab for fechada
window.addEventListener('unload', cleanupWorkSystem);
