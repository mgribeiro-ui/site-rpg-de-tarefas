
// ESTADO DO JOGO (GAME STATE)
let gameState = {
    username: '',
    xp: 0,
    level: 1,
    tasks: []
};


// SISTEMA DE RANKS
const ranks = [
    { minLevel: 50, title: 'Lenda Imortal', color: 'text-yellow-300', icon: 'fa-crown' },
    { minLevel: 30, title: 'Herói', color: 'text-purple-400', icon: 'fa-dragon' },
    { minLevel: 15, title: 'Veterano', color: 'text-red-400', icon: 'fa-khanda' },
    { minLevel: 5,  title: 'Aventureiro', color: 'text-blue-400', icon: 'fa-shield-halved' },
    { minLevel: 1,  title: 'Novato', color: 'text-gray-400', icon: 'fa-user' }
];

// ELEMENTOS DO DOM
const DOM = {
    screens: {
        login: document.getElementById('login-screen'),
        dashboard: document.getElementById('dashboard-screen')
    },
    forms: {
        login: document.getElementById('login-form'),
        addTask: document.getElementById('add-task-form')
    },
    ui: {
        username: document.getElementById('user-display-name'),
        level: document.getElementById('ui-level'),
        xp: document.getElementById('ui-xp'),
        rank: document.getElementById('ui-rank'),
        xpBar: document.getElementById('xp-bar'),
        xpProgressText: document.getElementById('xp-progress-text'),
        taskList: document.getElementById('task-list'),
        taskCount: document.getElementById('task-count'),
        emptyState: document.getElementById('empty-state'),
        notifContainer: document.getElementById('notification-container')
    },
    inputs: {
        user: document.getElementById('username'),
        pass: document.getElementById('password'),
        taskDesc: document.getElementById('task-desc'),
        taskXp: document.getElementById('task-xp')
    },
    buttons: {
        logout: document.getElementById('btn-logout')
    }
};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    setupEventListeners();
});

function setupEventListeners() {
    DOM.forms.login.addEventListener('submit', handleLogin);
    DOM.forms.addTask.addEventListener('submit', handleAddTask);
    DOM.buttons.logout.addEventListener('click', handleLogout);
}


// INICIALIZAÇÃO SEGURA
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema RPG Iniciado!"); // Para você ver no console se rodou
    loadGame();
    setupEventListeners();
});

function setupEventListeners() {
    // Verifica se o formulário existe antes de adicionar o evento
    if (DOM.forms.login) {
        DOM.forms.login.addEventListener('submit', handleLogin);
    } else {
        console.error("Erro: Formulário de login não encontrado no HTML!");
    }

    if (DOM.forms.addTask) {
        DOM.forms.addTask.addEventListener('submit', handleAddTask);
    }

    if (DOM.buttons.logout) {
        DOM.buttons.logout.addEventListener('click', handleLogout);
    }
}

// LÓGICA DE LOGIN / AUTENTICAÇÃO
function handleLogin(e) {
    e.preventDefault(); // Impede a página de piscar/recarregar
    console.log("Tentativa de login..."); 

    const user = DOM.inputs.user.value.trim();
    
    if (user === '') {
        showError('O nome do herói não pode estar vazio!');
        return;
    }

    // Salva o usuário no estado do jogo
    gameState.username = user;
    
    // Troca as telas
    if (DOM.screens.login && DOM.screens.dashboard) {
        DOM.screens.login.classList.add('hidden');
        DOM.screens.dashboard.classList.remove('hidden');
        DOM.screens.dashboard.classList.add('flex');
        
        updateUI();
        renderTasks();
        showNotification(`Bem-vindo à taverna, ${user}!`, 'success', 'fa-dungeon');
    } else {
        console.error("Erro: Telas de login ou dashboard não encontradas!");
    }
}
// LÓGICA DE MISSÕES (TASKS)
function handleAddTask(e) {
    e.preventDefault();
    
    const desc = DOM.inputs.taskDesc.value.trim();
    const xpReward = parseInt(DOM.inputs.taskXp.value);

    if (desc && xpReward >= 10) {
        const newTask = {
            id: 'task_' + Date.now(),
            desc: desc,
            xp: xpReward
        };
        
        gameState.tasks.push(newTask);
        saveGame();
        renderTasks();
        
        // Limpa formulário
        DOM.inputs.taskDesc.value = '';
        DOM.inputs.taskXp.value = '';
        DOM.inputs.taskDesc.focus();
        
        showNotification('Nova missão afixada no mural!', 'info', 'fa-scroll');
    }
}

function renderTasks() {
    DOM.ui.taskList.innerHTML = '';
    
    if (gameState.tasks.length === 0) {
        DOM.ui.emptyState.classList.remove('hidden');
        DOM.ui.taskList.classList.add('hidden');
        DOM.ui.taskCount.textContent = '0 ativas';
        return;
    }

    DOM.ui.emptyState.classList.add('hidden');
    DOM.ui.taskList.classList.remove('hidden');
    DOM.ui.taskCount.textContent = `${gameState.tasks.length} ativa(s)`;

    gameState.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-[0_0_10px_rgba(139,92,246,0.2)] transition-all transform hover:-translate-y-0.5';
        li.id = task.id;
        
        li.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse shadow-[0_0_8px_#fbbf24]"></div>
                <span class="font-medium text-slate-200">${task.desc}</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="bg-slate-900 text-[#fbbf24] px-3 py-1 rounded-md text-xs font-bold font-rpg border border-slate-700 shadow-inner flex items-center gap-1">
                    <i class="fa-solid fa-star text-[10px]"></i> ${task.xp} XP
                </span>
                <button onclick="completeTask('${task.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white w-8 h-8 rounded-lg flex items-center justify-center transition focus:outline-none shadow-[0_0_10px_rgba(16,185,129,0.3)]" title="Concluir Missão">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        `;
        DOM.ui.taskList.appendChild(li);
    });
}

window.completeTask = function(taskId) {
    const taskIndex = gameState.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex > -1) {
        const task = gameState.tasks[taskIndex];
        const taskElement = document.getElementById(taskId);
        
        // Efeito visual de missão cumprida
        taskElement.classList.add('opacity-0', 'scale-95', 'translate-x-4', 'transition-all', 'duration-300');
        
        setTimeout(() => {
            gameState.tasks.splice(taskIndex, 1);
            addXP(task.xp);
            renderTasks();
            saveGame();
        }, 300);
    }
};

// SISTEMA DE PROGRESSÃO E GAMIFICAÇÃO
function addXP(amount) {
    const oldLevel = gameState.level;
    gameState.xp += amount;
    
    // Fórmula de XP: Cada nível exige 100 XP a mais que o anterior (Nvl 1=100, Nvl 2=200, Nvl 3=300...)
    let xpNeeded = getXPForNextLevel(gameState.level);
    
    while (gameState.xp >= xpNeeded) {
        gameState.xp -= xpNeeded;
        gameState.level++;
        xpNeeded = getXPForNextLevel(gameState.level);
    }

    updateUI();
    showNotification(`Missão Cumprida! +${amount} XP`, 'success', 'fa-khanda');

    if (gameState.level > oldLevel) {
        setTimeout(() => {
            showNotification(`LEVEL UP! Você alcançou o Nível ${gameState.level}!`, 'gold', 'fa-level-up-alt');
            playLevelUpEffect();
        }, 600);
    }
}

function getXPForNextLevel(level) {
    return level * 100;
}

function updateUI() {
    // Atualiza Textos
    DOM.ui.username.textContent = gameState.username || 'Aventureiro';
    DOM.ui.level.textContent = gameState.level;
    DOM.ui.xp.innerHTML = `${gameState.xp}<span class="text-sm text-gray-500 ml-1">XP</span>`;

    // Atualiza Barra de Progresso
    const xpNeeded = getXPForNextLevel(gameState.level);
    const percentage = (gameState.xp / xpNeeded) * 100;
    DOM.ui.xpBar.style.width = `${Math.min(percentage, 100)}%`;
    DOM.ui.xpProgressText.textContent = `${gameState.xp} / ${xpNeeded} XP`;

    // Atualiza Rank Dinamicamente
    const currentRank = ranks.find(r => gameState.level >= r.minLevel) || ranks[ranks.length - 1];
    DOM.ui.rank.innerHTML = `<i class="fa-solid ${currentRank.icon} mr-1"></i> ${currentRank.title}`;
    DOM.ui.rank.className = `text-xl mt-2 font-bold font-rpg drop-shadow-md ${currentRank.color}`;
}


// NOTIFICAÇÕES & EFEITOS

function showNotification(message, type = 'info', icon = 'fa-info-circle') {
    const notif = document.createElement('div');
    
    // Cores baseadas no tipo
    let bgColors = 'bg-slate-800 border-slate-600 text-white';
    if (type === 'success') bgColors = 'bg-emerald-900/90 border-emerald-600 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (type === 'gold') bgColors = 'bg-yellow-900/90 border-yellow-500 text-yellow-100 shadow-[0_0_20px_rgba(251,191,36,0.4)]';

    notif.className = `flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transform transition-all duration-500 translate-y-10 opacity-0 pointer-events-auto ${bgColors}`;
    
    notif.innerHTML = `
        <i class="fa-solid ${icon} text-lg"></i>
        <span class="font-medium text-sm font-rpg tracking-wide">${message}</span>
    `;
    
    DOM.ui.notifContainer.appendChild(notif);

    // Animação de entrada
    requestAnimationFrame(() => {
        notif.classList.remove('translate-y-10', 'opacity-0');
    });

    // Remove após um tempo
    setTimeout(() => {
        notif.classList.add('opacity-0', 'translate-x-10');
        setTimeout(() => notif.remove(), 500);
    }, 4000);
}

function playLevelUpEffect() {
    // Efeito visual temporário na tela para dar ênfase ao Level Up
    const glow = document.createElement('div');
    glow.className = 'fixed inset-0 bg-yellow-500/20 z-40 pointer-events-none mix-blend-screen transition-opacity duration-1000';
    document.body.appendChild(glow);
    
    // Faz piscar as bordas do avatar
    const avatar = document.querySelector('.fa-user-ninja').parentElement;
    avatar.classList.add('border-yellow-400', 'shadow-[0_0_30px_rgba(251,191,36,0.8)]');
    
    setTimeout(() => {
        glow.classList.add('opacity-0');
        avatar.classList.remove('border-yellow-400', 'shadow-[0_0_30px_rgba(251,191,36,0.8)]');
        setTimeout(() => glow.remove(), 1000);
    }, 500);
}

// SALVAR E CARREGAR (LOCAL STORAGE)

function saveGame() {
    localStorage.setItem('rpgTasks_Save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('rpgTasks_Save');
    if (saved) {
        try {
            gameState = JSON.parse(saved);
        } catch (e) {
            console.error("Erro ao carregar o save da taverna:", e);
        }
    }
}
// MÓDULO DE HISTÓRICO DE MISSÕES (ADICIONAL)

DOM.ui.historyList = document.getElementById('history-list');
DOM.ui.historyCount = document.getElementById('history-count');
DOM.ui.historyEmptyState = document.getElementById('history-empty-state');

//  Garante que o estado do jogo tenha o array de histórico ao carregar
if (!gameState.history) {
    gameState.history = [];
}

// Intercepta a função original de completar tarefa para salvar no histórico
const originalCompleteTask = window.completeTask;

window.completeTask = function(taskId) {
    const taskIndex = gameState.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex > -1) {
        const task = gameState.tasks[taskIndex];
        
        // Registra a data em que foi completada
        const today = new Date();
        task.completedAt = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Adiciona ao histórico do estado do jogo
        if (!gameState.history) gameState.history = [];
        gameState.history.push(task);
    }

    // Chama a função original que dá XP, remove da lista de ativas e salva o jogo
    originalCompleteTask(taskId);
    
    // Atualiza a tela de histórico
    setTimeout(() => {
        renderHistory();
    }, 300); // Espera a animação da missão original terminar
};

// Função exclusiva para renderizar o histórico
function renderHistory() {
    // Se os elementos HTML não existirem na tela, ignora
    if (!DOM.ui.historyList) return; 

    DOM.ui.historyList.innerHTML = '';

    if (!gameState.history || gameState.history.length === 0) {
        DOM.ui.historyEmptyState.classList.remove('hidden');
        DOM.ui.historyList.classList.add('hidden');
        DOM.ui.historyCount.textContent = '0 concluídas';
        return;
    }

    DOM.ui.historyEmptyState.classList.add('hidden');
    DOM.ui.historyList.classList.remove('hidden');
    DOM.ui.historyCount.textContent = `${gameState.history.length} concluída(s)`;

    // Inverte o array para mostrar a missão completada mais recente no topo
    const reversedHistory = [...gameState.history].reverse();

    reversedHistory.forEach(task => {
        const li = document.createElement('li');
        li.className = 'bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 flex justify-between items-center transition-all';
        
        li.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-check text-emerald-500"></i>
                <span class="text-gray-400 line-through text-sm">${task.desc}</span>
            </div>
            <div class="flex items-center gap-3 text-xs">
                <span class="text-gray-500">${task.completedAt || ''}</span>
                <span class="text-emerald-500 font-bold font-rpg">+${task.xp} XP</span>
            </div>
        `;
        DOM.ui.historyList.appendChild(li);
    });
}

// Garante que o histórico seja carregado assim que o painel abrir
const originalHandleLogin = handleLogin;
handleLogin = function(e) {
    originalHandleLogin(e);
    renderHistory();
};

// Renderiza caso a página seja recarregada já logada (para persistência)
setTimeout(() => {
    if (gameState.username) {
        renderHistory();
    }
}, 500);



//E SAÍDA (LOGOUT) - COM RESET TOTAL

function handleLogout() {
    // 1. Zera o estado do jogo completamente
    gameState = {
        username: '',
        xp: 0,
        level: 1,
        tasks: [],
        history: []
    };
    
    // Limpa o campo de input de login
    DOM.inputs.user.value = '';
    
    // 2. Salva o estado "zerado" no Local Storage para apagar o progresso antigo
    saveGame();

    // 3. Esconde o Dashboard
    DOM.screens.dashboard.classList.add('hidden');
    DOM.screens.dashboard.classList.remove('flex');
    
    // 4. Limpa o HTML visualmente (para não piscar dados velhos no próximo login)
    if (DOM.ui.taskList) DOM.ui.taskList.innerHTML = '';
    if (DOM.ui.historyList) DOM.ui.historyList.innerHTML = '';
    
    // 5. Mostra a tela de Login
    DOM.screens.login.classList.remove('hidden');

    // 6. Exibe notificação de despedida
    showNotification('Você deixou a taverna. Registros apagados!', 'info', 'fa-door-closed');
}