// ==================== INICIALIZAÇÃO DO SISTEMA ====================
// Carrega as tarefas salvas no localStorage do navegador, ou cria um array vazio se não houver nenhuma
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// JSON.parse() converte texto JSON de volta para objeto JavaScript
// localStorage.getItem("tasks") busca dados salvos com a chave "tasks" no navegador
// || [] significa "ou array vazio" caso não exista nada salvo (operador OR lógico)





// ==================== VARIÁVEIS DE CONTROLE DOS FILTROS ====================
// Armazena o filtro de status atual (todas, pendentes, concluidas)
let currentFilter = 'todas';
// Variável global que controla qual tipo de tarefa está sendo exibido

// Armazena o filtro de categoria atual (todas, pessoal, trabalho, estudo)
let currentCategoryFilter = 'todas';
// Variável global que controla qual categoria está sendo filtrada




// ==================== VARIÁVEIS DE CONTROLE DOS TEMAS ====================
// Carrega o tema salvo ou usa 'light' como padrão
let currentTheme = localStorage.getItem("theme") || 'light';
// localStorage.getItem("theme") busca o tema salvo no navegador

// ==================== VARIÁVEIS DE CONTROLE DE EXPORTAÇÃO ====================
// Controla se o menu de exportação está visível ou não
let exportMenuVisible = false;

// ==================== VARIÁVEIS DE CONTROLE DE SINCRONIZAÇÃO ====================
// Controla se o menu de sincronização está visível ou não
let syncMenuVisible = false;
// Status da conexão com Google Drive
let isConnected = false;
// Token de acesso do Google Drive
let accessToken = null;
// ID do arquivo no Google Drive
let driveFileId = localStorage.getItem('driveFileId') || null;
// Última sincronização
let lastSyncTime = localStorage.getItem('lastSyncTime') || null;

// ==================== CONFIGURAÇÕES DO GOOGLE DRIVE ====================
// IMPORTANTE: Você precisa substituir estas configurações pelas suas próprias
// Para obter estas informações, vá em: https://console.developers.google.com/
const GOOGLE_CONFIG = {
    CLIENT_ID: 'SEU_CLIENT_ID_AQUI.apps.googleusercontent.com', // Substitua pelo seu Client ID
    API_KEY: 'SUA_API_KEY_AQUI', // Substitua pela sua API Key
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file' // Permissão apenas para arquivos criados pela app
};

// ==================== FUNÇÃO PARA ALTERNAR TEMA ====================
// Função para alternar entre tema claro e escuro
function toggleTheme() {
    // Marca que usuário escolheu tema manualmente
    localStorage.setItem('theme-manually-set', 'true');

    // Alterna tema
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    // Se for 'light', troca para 'dark', caso contrário, volta para 'light'

    // ==================== APLICAÇÃO DO TEMA ====================
    // Aplica o novo tema
    applyTheme();

    // ==================== PERSISTÊNCIA DO TEMA ====================
    // Salva a preferência do usuário no localStorage
    localStorage.setItem('theme', currentTheme);
    // Salva tema escolhido pra ser lembrado na proxima visita
}

// ==================== FUNÇÃO PARA APLICAR TEMA ====================
// Função para aplicar o tema selecionado
function applyTheme(){
    // ==================== APLICAÇÃO NO ELEMENTO HTML ====================
    // Aplica atributo data-theme no elemento html
    document.documentElement.setAttribute('data-theme', currentTheme);
    // document.documentElement é o elemento <html>
    // setAttribute('data-theme', currentTheme) adiciona atributo data-theme="light" ou "dark"
    // Isso ativa as variáveis CSS correspondentes definidas em :root e [data-theme="dark"]

    // ==================== ATUALIZAÇÃO DO BOTÃO ====================
    // Atualiza texto e ícone do botão baseado no tema atual
    const themeBtn = document.getElementById('theme-btn');
    // Pega o botão de tema pelo ID 'theme-btn'

    if (currentTheme === 'dark') {
        // Se tema atual é escuro
        themeBtn.textContent = '🌞 Claro';
        // Mostra ícone de sol e texto "Claro" (para mudar para tema claro)
        themeBtn.setAttribute('title', 'Mudar para tema claro');
        // Define título do botão para acessibilidade (tooltip)
    } else {
        // Se tema atual é claro
        themeBtn.textContent = '🌙 Escuro';
        // Mostra ícone de lua e texto "Escuro" (para mudar para tema escuro)
        themeBtn.setAttribute('title', 'Mudar para tema escuro');
        // Define título do botão para acessibilidade (tooltip)
    }
}

// ==================== FUNÇÃO PARA INICIALIZAR TEMA ====================
// Função para configurar tema inicial
function initializeTheme() {
    // ==================== APLICAÇÃO DO TEMA SALVO ====================
    // Aplica o tema salvo no localStorage ou o padrão 'light'
    applyTheme();

    // ==================== DETECÇÃO DE PREFERÊNCIA DO SISTEMA ====================
    // Verifica se usuário nunca escolheu um tema
    if(!localStorage.getItem("theme")) {
        // Se não houver tema salvo, verifica preferência do sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // window.matchMedia() verifica media queries CSS
        // '(prefers-color-scheme: dark)' detecta se SO está em modo escuro
        // .matches retorna true se a condição for atendida

        if (prefersDark) {
            currentTheme = 'dark';
            // Se preferência do sistema é escura, define tema atual como 'dark'
            applyTheme();
            localStorag.setItem('theme', currentTheme);
        }
    }
}
// ==================== LISTENER PARA MUDANÇAS NO SISTEMA ====================
// Escuta mudanças na preferência de tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // addEventListener('change') escuta mudanças na media query
    // Dispara quando usuário muda tema do sistema operacional

    // Só aplica mudança automática se usuário não escolheu manualmente
    if (!localStorage.getItem("theme")) {
        // Se usuário nunca escolheu tema manualmente
        currentTheme = event.matches ? 'dark' : 'light';
        // e.matches é true se sistema está em modo escuro
        applyTheme(); // Aplica o novo tema baseado na preferência do sistema
        localStorage.setItem('theme', currentTheme); // Salva preferência no localStorage
    }
});





// ==================== FUNÇÃO PARA PERSISTÊNCIA DE DADOS ====================
// Função para salvar as tarefas no localStorage (memória local do navegador)
function saveTasks() {
    // Converte o array de tarefas em texto JSON e salva no localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // JSON.stringify() converte objeto JavaScript para texto JSON (string)
    // localStorage.setItem() salva dados no navegador com uma chave específica
    // Os dados permanecem salvos mesmo após fechar o navegador
}








// ==================== FUNÇÃO PRINCIPAL DE EXIBIÇÃO ====================
// Função para exibir todas as tarefas na tela
function renderTasks() {
    // Pega o elemento HTML da lista onde as tarefas serão exibidas
    const list = document.getElementById("lista-tarefas");
    // document.getElementById() busca elemento HTML pelo ID especificado
    // const cria uma variável que não pode ser reatribuída
    
    // Limpa todo o conteúdo da lista antes de recriar
    list.innerHTML = "";
    // innerHTML = "" remove todo conteúdo HTML do elemento
    // Isso evita duplicação de tarefas quando a função é chamada novamente

    // Para cada tarefa no array, cria um item da lista
    tasks.forEach((task, index) => {
        // forEach() percorre cada item do array executando função para cada um
        // task = tarefa atual sendo processada
        // index = posição no array (0, 1, 2, 3...)
        
        // Cria um novo elemento <li> (item da lista)
        const li = document.createElement("li");
        // createElement() cria um novo elemento HTML na memória (ainda não na tela)
        
        // ==================== VERIFICAÇÕES DE COMPATIBILIDADE ====================
        // (suporte a dados antigos que podem ser strings ao invés de objetos)
        
        // Verifica se task é objeto ou string (compatibilidade com versão antiga)
        const taskText = typeof task === 'object' ? task.text : task;
        // typeof verifica o tipo de dados da variável
        // Operador ternário: condição ? valor_se_verdadeiro : valor_se_falso
        // Se for objeto, pega propriedade 'text', senão usa a string diretamente
        
        const isCompleted = typeof task === 'object' ? task.completed : false;
        // Se for objeto, pega propriedade 'completed', senão assume false (não concluída)
        
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        // Se for objeto, pega propriedade 'priority', senão assume 'baixa' como padrão
        
        const category = typeof task === 'object' ? task.category : 'pessoal';
        // Se for objeto, pega propriedade 'category', senão assume 'pessoal' como padrão
        
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        // Se for objeto, pega propriedade 'dueDate', senão assume string vazia (sem data)
        
        // ==================== CONSTRUÇÃO DO HTML DA TAREFA ====================
        // Define o conteúdo HTML do item da lista com checkbox e informações extras
        li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" onchange="toggleTask(${index})" ${isCompleted ? 'checked' : ''}>
            <span class="task-text ${isCompleted ? 'completed' : ''}">${taskText}</span>
            <div class="task-info">
                <span class="priority priority-${priority}">${priority.toUpperCase()}</span>
                <span class="category">${category}</span>
                ${dueDate ? `<span class="due-date">📅 ${new Date(dueDate).toLocaleDateString()}</span>` : ''}
            </div>
        </div>
        <div class="actions">
            <button onclick="editTask(${index})">✏️</button>
            <button onclick="removeTask(${index})">🗑️</button>
        </div>
        `;
        // Template literal (`) permite inserir variáveis JavaScript com ${variavel}
        // onchange="toggleTask(${index})" chama função quando checkbox é marcado/desmarcado
        // ${isCompleted ? 'checked' : ''} adiciona atributo 'checked' se tarefa estiver concluída
        // ${isCompleted ? 'completed' : ''} adiciona classe CSS 'completed' se tarefa estiver concluída
        // priority.toUpperCase() converte texto da prioridade para maiúsculo (ALTA, MÉDIA, BAIXA)
        // new Date(dueDate) cria objeto de data a partir da string
        // .toLocaleDateString() formata data para padrão local (ex: 30/07/2025)
        // Operador ternário ${dueDate ? '...' : ''} só mostra data se ela existir
        
        // Adiciona o item criado à lista na tela
        list.appendChild(li);
        // appendChild() insere o elemento <li> como filho do elemento <ul>
        // Agora o item aparece visualmente na página
    });

    // Atualiza contadores após renderizar todas as tarefas
    updateTaskCounter();
    // Chama função que calcula e exibe estatísticas (total, pendentes, concluídas)
}







// ==================== FUNÇÃO PARA ADICIONAR NOVA TAREFA ====================
// Função para adicionar uma nova tarefa
function addTask() {
    // ==================== CAPTURA DOS ELEMENTOS HTML ====================
    // Pega o elemento do campo de input onde o usuário digita a tarefa
    const input = document.getElementById("tarefa");
    // Pega o elemento select para escolher categoria
    const categorySelect = document.getElementById("categoria");
    // Pega o elemento select para escolher prioridade
    const prioritySelect = document.getElementById("prioridade");
    // Pega o elemento input de data para vencimento
    const dueDateInput = document.getElementById("data-vencimento");
    
    // ==================== VALIDAÇÃO DOS DADOS ====================
    // Pega o valor digitado e remove espaços em branco no início/fim
    const taskText = input.value.trim();
    // .value pega o valor atual do campo de input
    // .trim() remove espaços extras no início e fim da string

    // Verifica se o usuário digitou alguma coisa (não está vazio)
    if (taskText) {
        // ==================== CRIAÇÃO DO OBJETO TAREFA ====================
        // Cria objeto da tarefa com todas as propriedades necessárias
        const newTask = {
            id: Date.now(), // Gera um ID único baseado no timestamp atual (millisegundos desde 1970)
            text: taskText, // O texto da tarefa é o valor digitado pelo usuário
            completed: false, // Inicialmente, a tarefa não está completa
            category: categorySelect.value, // Categoria selecionada no dropdown
            priority: prioritySelect.value, // Prioridade selecionada no dropdown
            dueDate: dueDateInput.value, // Data de vencimento selecionada (formato YYYY-MM-DD)
            createdAt: new Date().toISOString() // Armazena a data de criação no formato ISO (padrão internacional)
        };

        // ==================== ATUALIZAÇÃO DO SISTEMA ====================
        // Adiciona a nova tarefa ao final do array
        tasks.push(newTask);
        // .push() adiciona elemento no final do array
        
        // ==================== LIMPEZA DOS CAMPOS ====================
        // Limpa o campo de texto
        input.value = "";
        // Limpa o campo de data
        dueDateInput.value = "";
        // Define valor vazio para limpar os campos após adicionar tarefa
        
        // ==================== PERSISTÊNCIA E ATUALIZAÇÃO ====================
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Chama função que salva dados no navegador
        
        // Atualiza a exibição das tarefas na tela
        renderTasks();
        // Chama função que reconstroi a lista visual com a nova tarefa
    }
    // Se taskText estiver vazio, nada acontece (tarefa não é adicionada)
}

// ==================== FUNÇÃO PARA MARCAR/DESMARCAR COMO CONCLUÍDA ====================
// Função para alternar o status de conclusão da tarefa
function toggleTask(index) {
    // ==================== CONVERSÃO DE COMPATIBILIDADE ====================
    // Se task for string (dados antigos), converte para objeto
    if (typeof tasks[index] === 'string') {
        // Substitui string por objeto completo para manter compatibilidade
        tasks[index] = {
            id: Date.now(), // Gera ID único baseado no tempo atual
            text: tasks[index], // Usa a string original como texto da tarefa
            completed: false, // Inicialmente não concluída
            category: 'pessoal', // Categoria padrão
            priority: 'baixa', // Prioridade padrão
            dueDate: '', // Sem data de vencimento
            createdAt: new Date().toISOString() // Data de criação atual
        };
    }
    
    // ==================== ALTERAÇÃO DO STATUS ====================
    // Alterna o status de conclusão da tarefa
    tasks[index].completed = !tasks[index].completed;
    // ! (operador NOT) inverte o valor boolean
    // Se era true (concluída), vira false (pendente)
    // Se era false (pendente), vira true (concluída)
    
    // ==================== PERSISTÊNCIA E ATUALIZAÇÃO ====================
    saveTasks(); // Salva alterações no localStorage
    renderTasks(); // Atualiza visualização na tela
}

// ==================== FUNÇÃO PARA REMOVER TAREFA ====================
// Função para remover uma tarefa específica
function removeTask(index) {
    // Remove 1 elemento do array na posição especificada pelo index
    tasks.splice(index, 1);
    // .splice(posição_inicial, quantidade_a_remover)
    // splice(index, 1) remove exatamente 1 elemento na posição 'index'
    // Os elementos seguintes "sobem" uma posição
    
    // ==================== PERSISTÊNCIA E ATUALIZAÇÃO ====================
    // Salva as tarefas atualizadas no localStorage
    saveTasks();
    // Atualiza a exibição das tarefas na tela
    renderTasks();
}

// ==================== FUNÇÃO PARA EDITAR TAREFA ====================
// Função para editar uma tarefa existente
function editTask(index) {
    // ==================== CAPTURA DO TEXTO ATUAL ====================
    // Pega o texto atual da tarefa para mostrar no prompt
    const currentText = typeof tasks[index] === 'object' ? tasks[index].text : tasks[index];
    // Verifica se é objeto ou string e pega o texto correspondente
    
    // ==================== INTERFACE DE EDIÇÃO ====================
    // Mostra uma caixa de diálogo para o usuário editar a tarefa
    const newTaskText = prompt("Editar tarefa:", currentText);
    // prompt() mostra janela popup com campo de texto
    // Primeiro parâmetro é a mensagem mostrada ao usuário
    // Segundo parâmetro define o valor inicial do campo (texto atual da tarefa)
    // Retorna null se usuário cancelar, ou string com o texto digitado

    // ==================== VALIDAÇÃO E ATUALIZAÇÃO ====================
    // Verifica se o usuário não cancelou e digitou algo válido
    if (newTaskText !== null && newTaskText.trim() !== "") {
        // newTaskText !== null verifica se usuário não clicou em "Cancelar"
        // newTaskText.trim() !== "" verifica se não está vazio após remover espaços
        
        // ==================== CONVERSÃO DE COMPATIBILIDADE ====================
        // Se task for string (dados antigos), converte para objeto
        if (typeof tasks[index] === 'string') {
            tasks[index] = {
                id: Date.now(), // Gera ID único
                text: tasks[index], // Usa string original como texto
                completed: false, // Status padrão (não concluída)
                category: 'pessoal', // Categoria padrão
                priority: 'baixa', // Prioridade padrão
                dueDate: '', // Sem data de vencimento
                createdAt: new Date().toISOString() // Data de criação atual
            };
        }
        
        // ==================== ATUALIZAÇÃO DO TEXTO ====================
        // Atualiza apenas o texto da tarefa, mantendo outras propriedades
        tasks[index].text = newTaskText.trim();
        // .trim() remove espaços extras antes de salvar
        
        // ==================== PERSISTÊNCIA E ATUALIZAÇÃO ====================
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
    // Se usuário cancelar ou deixar vazio, nada acontece
}









// ==================== FUNÇÃO DE BUSCA ====================
// Função para buscar tarefas por texto
function searchTasks() {
    // ==================== CAPTURA DO TERMO DE BUSCA ====================
    const searchTerm = document.getElementById("busca").value.toLowerCase();
    // Pega valor do campo de busca e converte para minúsculas
    // .toLowerCase() torna a busca case-insensitive (não diferencia maiúsculas/minúsculas)
    
    // ==================== VERIFICAÇÃO SE BUSCA ESTÁ VAZIA ====================
    // Se campo de busca estiver vazio, volta aos filtros normais
    if (searchTerm.trim() === '') {
        applyFilters(); // Volta aos filtros normais (sem busca)
        return; // Para a execução da função aqui (não continua)
    }
    
    // ==================== APLICAÇÃO DOS FILTROS PRIMEIRO ====================
    // Começa com todas as tarefas
    let filteredTasks = [...tasks];
    // [...array] é spread operator - cria cópia superficial do array original
    // Não modifica o array original

    // ==================== APLICA FILTRO DE STATUS ====================
    if (currentFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            // .filter() cria novo array apenas com elementos que atendem condição
            const isCompleted = typeof task === 'object' ? task.completed : false;
            // Pega status de conclusão da tarefa
            
            if (currentFilter === 'pendentes') {
                return !isCompleted; // Retorna true para tarefas NÃO concluídas
            } else if (currentFilter === 'concluidas') {
                return isCompleted; // Retorna true para tarefas concluídas
            }
            return true; // Fallback (não deveria executar)
        });
    }
    
    // ==================== APLICA FILTRO DE CATEGORIA ====================
    if (currentCategoryFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            const taskCategory = typeof task === 'object' ? task.category : 'pessoal';
            // Pega categoria da tarefa
            return taskCategory === currentCategoryFilter;
            // Retorna true apenas para tarefas da categoria selecionada
        });
    }
    
    // ==================== APLICA BUSCA POR TEXTO ====================
    // Agora filtra por texto dentro dos resultados já filtrados
    filteredTasks = filteredTasks.filter(task => {
        const taskText = typeof task === 'object' ? task.text : task;
        // Pega texto da tarefa
        return taskText.toLowerCase().includes(searchTerm);
        // .includes() verifica se texto da tarefa contém o termo buscado
        // Retorna true se encontrar o termo, false caso contrário
    });
    
    // ==================== EXIBIÇÃO DOS RESULTADOS ====================
    renderFilteredTasks(filteredTasks);
    // Chama função específica para exibir apenas as tarefas que atendem todos os critérios
}










// ==================== FUNÇÕES DE FILTRO ====================

// Função para filtrar tarefas por status (todas, pendentes, concluídas)
function filterTasks(filterType) {
    // ==================== ATUALIZAÇÃO DO FILTRO ATUAL ====================
    // Armazena o tipo de filtro selecionado na variável global
    currentFilter = filterType;
    // filterType pode ser: 'todas', 'pendentes', ou 'concluidas'
    
    // ==================== ATUALIZAÇÃO VISUAL DOS BOTÕES ====================
    // Remove classe 'active' de todos os botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        // .querySelectorAll() seleciona todos elementos com classe .filter-btn
        // .forEach() executa função para cada botão encontrado
        btn.classList.remove('active');
        // .classList.remove() remove uma classe CSS do elemento
    });
    
    // Adiciona classe 'active' ao botão que foi clicado
    event.target.classList.add('active');
    // event.target é o elemento que disparou o evento (botão clicado)
    // .classList.add() adiciona uma classe CSS ao elemento
    // Isso destaca visualmente qual filtro está ativo
    
    // ==================== APLICAÇÃO DO FILTRO ====================
    // Aplica os filtros combinados (status + categoria)
    applyFilters();
    // Chama função que aplica todos os filtros ativos
}

// Função para filtrar tarefas por categoria
function filterByCategory() {
    // ==================== CAPTURA DA CATEGORIA SELECIONADA ====================
    // Pega o valor selecionado no dropdown de categorias
    const categorySelect = document.getElementById("filtro-categoria");
    currentCategoryFilter = categorySelect.value;
    // .value pega o valor da opção selecionada no elemento <select>
    // Atualiza variável global com a categoria escolhida
    
    // ==================== APLICAÇÃO DO FILTRO ====================
    // Aplica os filtros combinados (status + categoria)
    applyFilters();
    // Combina filtro de categoria com filtro de status ativo
}

// Função principal que aplica todos os filtros combinados
function applyFilters() {
    // ==================== INÍCIO COM TODAS AS TAREFAS ====================
    // Cria uma cópia do array original para não modificar o array principal
    let filteredTasks = [...tasks];
    // [...array] é spread operator - cria cópia superficial do array
    // Preserva o array original intacto
    
    // ==================== FILTRO POR STATUS (pendentes/concluídas) ====================
    // Aplica filtro de status se não for "todas"
    if (currentFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            // .filter() cria novo array apenas com elementos que atendem condição
            
            // Pega status de conclusão da tarefa
            const isCompleted = typeof task === 'object' ? task.completed : false;
            
            // Aplica lógica baseada no filtro selecionado
            if (currentFilter === 'pendentes') {
                return !isCompleted; // Retorna tarefas NÃO concluídas
                // ! inverte o valor boolean (false vira true, true vira false)
            } else if (currentFilter === 'concluidas') {
                return isCompleted; // Retorna tarefas concluídas
            }
            
            return true; // Fallback - retorna todas (não deveria acontecer)
        });
    }

    // ==================== FILTRO POR CATEGORIA ====================
    // Aplica filtro de categoria se não for "todas"
    if (currentCategoryFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            // Pega categoria da tarefa
            const taskCategory = typeof task === 'object' ? task.category : 'pessoal';
            
            // Retorna apenas tarefas da categoria selecionada
            return taskCategory === currentCategoryFilter;
            // Compara categoria da tarefa com filtro selecionado
            // Retorna true se forem iguais, false caso contrário
        });
    }
    
    // ==================== EXIBIÇÃO DOS RESULTADOS ====================
    // Renderiza as tarefas filtradas na tela
    renderFilteredTasks(filteredTasks);
    // Mostra apenas tarefas que passaram por todos os filtros
}

// ==================== FUNÇÃO PARA EXIBIR RESULTADOS FILTRADOS ====================
// Função para renderizar tarefas filtradas
function renderFilteredTasks(filteredTasks) {
    // ==================== PREPARAÇÃO DA LISTA ====================
    const list = document.getElementById("lista-tarefas");
    list.innerHTML = ""; // Limpa lista atual antes de mostrar resultados filtrados

    // ==================== RENDERIZAÇÃO DE CADA TAREFA FILTRADA ====================
    filteredTasks.forEach((task, originalIndex) => {
        // Para cada tarefa no array filtrado
        
        // ==================== LOCALIZAÇÃO DO ÍNDICE ORIGINAL ====================
        // Encontra o índice original da tarefa no array completo
        const taskIndex = tasks.findIndex(t => 
            // .findIndex() encontra posição do primeiro elemento que atende condição
            (typeof t === 'object' ? t.id : t) === (typeof task === 'object' ? task.id : task)
            // Compara IDs ou strings para encontrar tarefa original
            // Isso é necessário para manter botões funcionais (editar/remover)
        );
        
        // ==================== CONSTRUÇÃO DO ELEMENTO HTML ====================
        const li = document.createElement("li");
        // Cria novo elemento de lista
        
        // Extrai propriedades da tarefa (mesmo código da renderTasks)
        const taskText = typeof task === 'object' ? task.text : task;
        const isCompleted = typeof task === 'object' ? task.completed : false;
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        const category = typeof task === 'object' ? task.category : 'pessoal';
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        
        // ==================== GERAÇÃO DO HTML ====================
        // (idêntico à renderTasks, mas usando taskIndex para manter funcionalidade)
        li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" onchange="toggleTask(${taskIndex})" ${isCompleted ? 'checked' : ''}>
            <span class="task-text ${isCompleted ? 'completed' : ''}">${taskText}</span>
            <div class="task-info">
                <span class="priority priority-${priority}">${priority.toUpperCase()}</span>
                <span class="category">${category}</span>
                ${dueDate ? `<span class="due-date">📅 ${new Date(dueDate).toLocaleDateString()}</span>` : ''}
            </div>
        </div>
        <div class="actions">
            <button onclick="editTask(${taskIndex})">✏️</button>
            <button onclick="removeTask(${taskIndex})">🗑️</button>
        </div>
        `;
        // Usa taskIndex (posição original) ao invés de originalIndex
        // Isso garante que botões funcionem corretamente mesmo em listas filtradas
        
        // ==================== INSERÇÃO NA LISTA ====================
        list.appendChild(li);
        // Adiciona item à lista visual
    });

    // ==================== ATUALIZAÇÃO DO CONTADOR ====================
    updateTaskCounter();
    // Atualiza contadores baseado em TODAS as tarefas, não apenas filtradas
    // Contador sempre mostra estatísticas totais
}

// ==================== FUNÇÃO PARA RESETAR FILTROS ====================
// Função para limpar todos os filtros e mostrar todas as tarefas
function clearAllFilters() {
    // ==================== RESET DAS VARIÁVEIS DE FILTRO ====================
    currentFilter = 'todas'; // Volta filtro de status para "todas"
    currentCategoryFilter = 'todas'; // Volta filtro de categoria para "todas"
    
    // ==================== RESET DOS ELEMENTOS VISUAIS ====================
    // Limpa campo de busca
    document.getElementById("busca").value = '';
    // Define valor vazio no campo de busca
    
    // Reset do dropdown de categoria
    document.getElementById("filtro-categoria").value = 'todas';
    // Volta seleção para "todas" no dropdown
    
    // Reset dos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active'); // Remove classe "active" de todos botões
    });
    // Adiciona classe "active" apenas ao botão "Todas"
    document.querySelector('.filter-btn[onclick="filterTasks(\'todas\')"]').classList.add('active');
    
    // ==================== EXIBIÇÃO DE TODAS AS TAREFAS ====================
    renderTasks(); // Mostra todas as tarefas sem filtros
}

// ==================== CONFIGURAÇÃO DE EVENTOS ====================
// Adiciona um ouvinte de eventos para permitir adicionar tarefa pressionando Enter
document.getElementById("tarefa").addEventListener("keypress", function(event) {
    // .addEventListener() registra função para ser executada quando evento específico acontece
    // "keypress" é o evento disparado quando uma tecla é pressionada
    // function(event) é a função anônima que será executada
    // event contém informações sobre o evento que aconteceu
    
    // Verifica se a tecla pressionada foi Enter
    if (event.key === "Enter") {
        // event.key contém o nome da tecla pressionada
        // "Enter" é o nome da tecla Enter no teclado
        
        // Chama a função para adicionar tarefa
        addTask();
        // Executa mesma ação que clicar no botão "Add"
    }
    // Se qualquer outra tecla for pressionada, nada acontece
});




// ==================== FUNÇÕES DE EXPORTAÇÃO ====================
// Função para mostrar/ocultar menu de exportação
function toggleExportMenu() {
    // ==================== CAPTURA DO ELEMENTO DO MENU ====================
    const exportMenu = document.getElementById("export-menu");
    // Pega o elemento HTML do menu de exportação pelo ID

    // ==================== TOGGLE VISIBILIDADE DO MENU ====================
    exportMenuVisible = !exportMenuVisible;
    // Inverte o estado atual (se estava visível, fica invisível e vice-versa)

    if (exportMenuVisible) {
        // Se menu deve ficar visível
        exportMenu.classList.add('show');
        // Adiciona classe 'show' para exibir o menu

        // Atualiza o texto do botão para "Fechar"
        document.getElementById('export-btn').textContent = '❌ Fechar';
    } else{
        // Se menu deve ficar invisível
        exportMenu.classList.remove('show');
        // Remove classe 'show' para esconder o menu

        // Atualiza o texto do botão para "Exportar"
        document.getElementById('export-btn').textContent = '📥 Exportar';
    }
}

// ==================== FUNÇÃO PARA EXPORTAR EM TXT ====================
// Função para exportar lista de tarefas em formato TXT
function exportToTXT(){
    // ==================== GERAÇÃO DO CABEÇALHO ====================
    // Cria cabeçalho com informações gerais
    let txtContent = "📝 LISTA DE TAREFAS\n";
    txtContent += "=" + "=".repeat(50) + "\n\n";
    // repeat(50) repete o caractere "=" 50 vezes para criar uma linha
    
    // ==================== INFORMAÇÕES ESTATÍSTICAS ====================
    // Adiciona estatísticas das tarefas
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => {
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return !isCompleted; // Conta apenas tarefas NÃO concluídas
    }).length;
    const completedTasks = tasks.filter(tasks => {
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return isCompleted; // Conta apenas tarefas concluídas
    }).length;

    txtContent += `📊 ESTATÍSTICAS:\n`;
    txtContent += `   Total de tarefas: ${totalTasks}\n`;
    txtContent += `   Pendentes: ${pendingTasks}\n`;
    txtContent += `   Concluídas: ${completedTasks}\n\n`;

    // ==================== DATA DE EXPORTAÇÃO ====================
    // Adiciona data e hora da exportação
    const now = new Date();
    txtContent += `📅 Exportado em: ${now.toLocaleDateString()} às ${now.toLocaleTimeString()}\n\n`;

    // ==================== LISTAGEM DAS TAREFAS ====================
    txtContent += "🔍 TAREFAS:\n";
    txtContent += "-" + "-".repeat(50) + "\n\n";

    if (tasks.length === 0) {
        // Se não houver tarefas, adiciona mensagem
        txtContent += "Nenhuma tarefa encontrada.\n";
    } else {
        // Se houver tarefas, lista cada uma
        tasks.forEach((task, index) => {
            // Para cada tarefa no array
            const taskText = typeof task === 'object' ? task.text : task;
            const isCompleted = typeof task === 'object' ? task.completed : false;
            const priority = typeof task === 'object' ? task.priority : 'baixa';
            const category = typeof task === 'object' ? task.category : 'pessoal';
            const dueDate = typeof task === 'object' ? task.dueDate : '';

            // ==================== FORMATAÇÃO DE CADA TAREFA ====================
            txtContent += `${index + 1}. ${isCompleted ? '✅' : '❌'} ${taskText}\n`;
            // Exibe número da tarefa (index + 1), status (check ou X)

            txtContent += `📂 Categoria: ${category}\n`;
            txtContent += `🔖 Prioridade: ${priority.toUpperCase()}\n`;

            if(dueDate){
                // Se houver data de vencimento, formata e adiciona
                txtContent += `📅 Data de Vencimento: ${new Date(dueDate).toLocaleDateString()}\n`;
            }
            txtContent += `📊 Status: ${isCompleted ? 'Concluída' : 'Pendente'}\n`;
            txtContent += "\n"; // Linha em branco entre tarefas
        });
    }

// ==================== DOWNLOAD DO ARQUIVO ====================
// Cria elemento <a> temporário para download
const element = document.createElement('a');
// createElement('a') cria um link HTML temporário

// Converte texto para formato arquivo
const file = new Blob([txtContent], { type: 'text/plain' });
// Blob() cria objeto de arquivo a partir do texto
// Primeiro parâmetro é o conteúdo, segundo é o tipo MIME (texto simples)

// Configura link para download
element.href = URL.createObjectURL(file); // URL.createObjectURL() cria URL temporária para o arquivo Blob
element.download = `lista-tarefas-${new Date().toISOString().split('T')[0]}.txt`;
// Nome do arquivo com data atual
// .toISOString() formata data em padrão ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
// .split('T')[0] pega apenas a parte da data (sem hora, antes do 'T')

// ==================== EXECUÇÃO DO DOWNLOAD ====================
document.body.appendChild(element); // Adiciona o link ao corpo do documento (necessário para download funcionar)
element.click(); // Simula clique no link para iniciar download
document.body.removeChild(element); // Remove o link após o download

// ==================== FEEDBACK VISUAL ====================
// Fecha menu de exportação
toggleExportMenu();
// Mostra mensagem de sucesso
alert('📄 Arquivo TXT exportado com sucesso!');
}

// ==================== FUNÇÃO PARA EXPORTAR EM PDF ====================
// Função para exportar lista de tarefas em formato PDF
function exportToPDF() {
    // ==================== VERIFICAÇÃO DA BIBLIOTECA ====================
    // Verifica se biblioteca jsPDF está carregada
    if (typeof window.jspdf === 'undefined') {
        console.log('Biblioteca jsPDF não encontrada!'); // Debug
        alert('❌ Erro: Biblioteca PDF não carregada. Verifique sua conexão com a internet.');
        return; // Interrompe a função se a biblioteca não estiver disponível
    }
    console.log('Biblioteca jsPDF encontrada!'); // Debug

    // ==================== INICIALIZAÇÃO DO PDF ====================
    // Cria nova instância do jsPDF
    const {jsPDF } = window.jspdf;
    const doc = new jsPDF(); // Cria novo documento PDF

    // ==================== CONFIGURAÇÕES INICIAIS ====================
    let yPosition = 20; // Posição vertical inicial para o texto
    const pageHeight = doc.internal.pageSize.height; // Altura da página PDF
    const margin = 20; // Margem para evitar corte do texto

    // ==================== CABEÇALHO ====================
    // Titulo principal
    doc.setFontSize(20); // Define tamanho da fonte
    doc.setFont('helvetica', 'bold'); // Define fonte e estilo
    doc.text('📝 LISTA DE TAREFAS', margin, yPosition);
    yPosition += 15; // Move posição para baixo após o título

    // Linha de separação
    doc.setLineWidth(0.5); // Define espessura da linha
    doc.line(margin, yPosition, 190, yPosition); // Desenha linha horizontal
    yPosition += 15; // Move posição para baixo após a linha

    // ==================== ESTATÍSTICAS ====================
    doc.setFontSize(12); // Define tamanho da fonte para estatísticas
    doc.setFont('helvetica', 'normal'); // Define fonte normal

    // Calcula estatísticas
    const totalTasks = tasks.length
    const pendingTasks = tasks.filter(task => {
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return !isCompleted; // Conta apenas tarefas NÃO concluídas
    }).length;
    const completedTasks = tasks.filter(task => {
        const isCompleted = type
    }).length; // Conta apenas tarefas concluídas

    // Adiciona estatísticas ao PDF
    doc.text(`📊 Total de tarefas: ${totalTasks}`, margin, yPosition);
    yPosition += 8;
    doc.text(`⏳ Pendentes: ${pendingTasks}`, margin, yPosition);
    yPosition += 8;
    doc.text(`✅ Concluidas: ${completedTasks}`, margin, yPosition);
    yPosition += 15; // Espaço após estatísticas

    // ==================== DATA DE EXPORTAÇÃO ====================
    const now = new Date();
    doc.text(`📅 Exportado em: ${now.toLocaleDateString()} às ${now.toLocaleTimeString()}`, margin, yPosition);
    yPosition += 15; // Espaço após data

    // ==================== LISTA DE TAREFAS ====================
    if(tasks.length === 0){
        // Se não há tarefas
        doc.text('Nenhuma tarefa encontrada.', margin, yPosition);
    } else {
        // ==================== CABEÇALHO DA LISTA ====================
        doc.setFont('helvetica', 'bold');
        doc.text('📋 TAREFAS:', margin, yPosition);
        yPosition += 15;

        // ==================== RENDERIZAÇÃO DE CADA TAREFA ====================
        tasks.forEach((task, index) => {
            // ==================== VERIFICAÇÃO DE QUEBRA DE PÁGINA ====================
            if(yPosition > pageHeight - 40){
                // Se está próximo ao fim da página (40px de margem)
                doc.addPage(); // Adiciona nova página
                yPosition = 20; // Reseta posição vertical para o topo
            }
            // ==================== EXTRAÇÃO DE DADOS DA TAREFA ====================
            const taskText = typeof task === 'object' ? task.text : task;
            const isCompleted = typeof task === 'object' ? task.completed : false;
            const priority = typeof task === 'object' ? task.priority : 'baixa';
            const category = typeof task === 'object' ? task.category : 'pessoal';
            const dueDate = typeof task === 'object' ? task.dueDate : '';

            // ==================== FORMATAÇÃO DA TAREFA NO PDF ====================
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);

            // Número e status da tarefa
            const status = isCompleted ? '[✓]' : '[ ]';
            doc.text(`${index + 1}. ${status} ${taskText}`, margin, yPosition);
            yPosition += 8;

            // Informações adicionais
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            doc.text(`   📂 Categoria: ${category}`, margin, yPosition);
            yPosition += 6;

            doc.text(`   🎯 Prioridade: ${priority.toUpperCase()}`, margin, yPosition);
            yPosition += 6;

            if (dueDate) {
                doc.text(`   📅 Vencimento: ${new Date(dueDate).toLocaleDateString()}`, margin, yPosition);
                yPosition += 6;
            }

            doc.text(`   📊 Status: ${isCompleted ? 'Concluída' : 'Pendente'}`, margin, yPosition);
            yPosition += 12;
        });
    }


    // ==================== DOWNLOAD DO PDF ====================
    // Salva o PDF com nome baseado na data
    const fileName = `lista-tarefas-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    // .save() dispara download do arquivo PDF

    // ==================== FEEDBACK VISUAL ====================
    // Fecha menu de exportação
    toggleExportMenu();
    // Mostra mensagem de sucesso
    alert('📄 Arquivo PDF exportado com sucesso!');
}





// ==================== FUNÇÃO PARA ATUALIZAR CONTADOR DE TAREFAS ====================
// Função para calcular e exibir estatísticas das tarefas
function updateTaskCounter() {
    // ==================== CONTAGEM TOTAL ====================
    // Conta o total de tarefas no array
    const totalTasks = tasks.length;
    // .length propriedade que retorna número de elementos no array

    // ==================== CONTAGEM DE TAREFAS PENDENTES ====================
    // Conta tarefas pendentes (não concluídas)
    const pendingTasks = tasks.filter(task => {
        // .filter() cria novo array apenas com elementos que atendem condição
        const isCompleted = typeof task === 'object' ? task.completed : false;
        // Verifica se tarefa está concluída
        return !isCompleted; // ! inverte - retorna tarefas NÃO concluídas
        // Se isCompleted é false, !isCompleted é true (tarefa pendente)
        // Se isCompleted é true, !isCompleted é false (tarefa não pendente)
    }).length; // .length conta quantos elementos há no array filtrado

    // ==================== CONTAGEM DE TAREFAS CONCLUÍDAS ====================
    // Conta tarefas concluídas
    const completedTasks = tasks.filter(task => {
        // Verifica se a tarefa está concluída
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return isCompleted; // Retorna apenas tarefas concluídas (completed = true)
    }).length; // .length conta quantos elementos há no array filtrado

    // ==================== ATUALIZAÇÃO DOS ELEMENTOS HTML ====================
    // Atualiza o número total de tarefas na interface
    document.getElementById('total-tasks').textContent = totalTasks;
    // .textContent define o texto do elemento HTML (apenas texto, sem HTML)
    // Substitui o conteúdo do elemento com ID 'total-tasks'

    // Atualiza o número de tarefas pendentes
    document.getElementById('pending-tasks').textContent = pendingTasks;
    // Atualiza elemento com ID 'pending-tasks'

    // Atualiza o número de tarefas concluídas
    document.getElementById('completed-tasks').textContent = completedTasks;
    // Atualiza elemento com ID 'completed-tasks'

    // ==================== EFEITO VISUAL ====================
    // Adiciona animação quando números mudam
    animateCounterUpdate();
    // Chama função que cria efeito visual nos contadores
}

// ==================== FUNÇÃO PARA ANIMAÇÃO DE CONTADOR ====================
// Função para animar a atualização dos contadores
function animateCounterUpdate(){
    // ==================== SELEÇÃO DOS ELEMENTOS NÚMERO ====================
    // Seleciona todos os elementos com classe 'counter-number'
    const counterNumbers = document.querySelectorAll('.counter-number');
    // .querySelectorAll() retorna lista com todos elementos que têm a classe especificada

    // ==================== APLICAÇÃO DA ANIMAÇÃO EM CADA CONTADOR ====================
    counterNumbers.forEach(number => {
        // Para cada elemento contador encontrado
        
        // Remove classe de animação se já existir
        number.classList.remove('counter-updated');
        // Remove classe CSS que controla a animação
        // Isso garante que animação possa ser aplicada novamente
        
        // Adiciona classe de animação
        number.classList.add('counter-updated');
        // Adiciona classe CSS que dispara animação definida no CSS
        // A animação faz número "pulsar" e mudar cor temporariamente
        
        // Remove a classe após a animação (500ms) para reiniciar a animação
        setTimeout(() => {
            // setTimeout() executa função após delay especificado
            number.classList.remove('counter-updated');
            // Remove classe após 500 milissegundos
            // Isso permite que animação seja aplicada novamente no futuro
        }, 500);
        // 500 é o tempo em milissegundos (0.5 segundos)
        // Deve corresponder à duração da animação CSS
    });
}

// ==================== FUNÇÕES DE SINCRONIZAÇÃO COM GOOGLE DRIVE ====================

// ==================== FUNÇÃO PARA ALTERNAR MENU DE SINCRONIZAÇÃO ====================
// Função para mostrar/ocultar menu de sincronização
function toggleSyncMenu() {
    // ==================== CAPTURA DO ELEMENTO DO MENU ====================
    const syncMenu = document.getElementById('sync-menu');
    // Pega o elemento do menu de sincronização pelo ID
    
    // ==================== ALTERNÂNCIA DA VISIBILIDADE ====================
    syncMenuVisible = !syncMenuVisible;
    // Inverte o estado da variável (true vira false, false vira true)
    
    if (syncMenuVisible) {
        // Se menu deve ficar visível
        syncMenu.classList.add('show');
        // Adiciona classe 'show' que torna o menu visível via CSS
        
        // Atualiza texto do botão para indicar que pode fechar
        document.getElementById('sync-btn').textContent = '❌ Fechar';
        
        // Atualiza status da conexão
        updateSyncStatus();
    } else {
        // Se menu deve ficar oculto
        syncMenu.classList.remove('show');
        // Remove classe 'show' que oculta o menu via CSS
        
        // Volta texto original do botão
        document.getElementById('sync-btn').textContent = '🔄 Sync';
    }
}

// ==================== FUNÇÃO PARA ATUALIZAR STATUS DE SINCRONIZAÇÃO ====================
// Função para atualizar indicadores visuais de conexão
function updateSyncStatus() {
    // ==================== CAPTURA DOS ELEMENTOS ====================
    const statusIndicator = document.getElementById('connection-status');
    const lastSyncElement = document.getElementById('last-sync-time');
    const connectBtn = document.getElementById('connect-btn');
    const syncUploadBtn = document.getElementById('sync-upload-btn');
    const syncDownloadBtn = document.getElementById('sync-download-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    
    // ==================== ATUALIZAÇÃO BASEADA NO STATUS ====================
    if (isConnected) {
        // Se conectado ao Google Drive
        statusIndicator.textContent = '🟢 Conectado ao Google Drive';
        statusIndicator.className = 'status-indicator connected';
        
        // Habilita botões de sincronização
        connectBtn.disabled = true;
        syncUploadBtn.disabled = false;
        syncDownloadBtn.disabled = false;
        disconnectBtn.disabled = false;
        
        // Atualiza texto do botão conectar
        connectBtn.textContent = '✅ Conectado';
    } else {
        // Se desconectado
        statusIndicator.textContent = '⚪ Desconectado';
        statusIndicator.className = 'status-indicator';
        
        // Desabilita botões de sincronização
        connectBtn.disabled = false;
        syncUploadBtn.disabled = true;
        syncDownloadBtn.disabled = true;
        disconnectBtn.disabled = true;
        
        // Atualiza texto do botão conectar
        connectBtn.textContent = '📁 Conectar Google Drive';
    }
    
    // ==================== ATUALIZAÇÃO DA ÚLTIMA SINCRONIZAÇÃO ====================
    if (lastSyncTime) {
        const lastSync = new Date(lastSyncTime);
        lastSyncElement.textContent = `Última sync: ${lastSync.toLocaleDateString()} às ${lastSync.toLocaleTimeString()}`;
    } else {
        lastSyncElement.textContent = 'Nunca sincronizado';
    }
}

// ==================== FUNÇÃO PARA INICIALIZAR GOOGLE DRIVE API ====================
// Função para carregar e configurar APIs do Google
async function initializeGoogleAPI() {
    try {
        // ==================== CARREGAMENTO DAS APIS ====================
        // Carrega a API do Google
        await new Promise((resolve, reject) => {
            gapi.load('auth2:client', {
                callback: resolve,
                onerror: reject
            });
        });
        
        // ==================== INICIALIZAÇÃO DA API ====================
        // Inicializa cliente da API
        await gapi.client.init({
            apiKey: GOOGLE_CONFIG.API_KEY,
            clientId: GOOGLE_CONFIG.CLIENT_ID,
            discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
            scope: GOOGLE_CONFIG.SCOPES
        });
        
        console.log('Google API inicializada com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar Google API:', error);
        alert('❌ Erro ao inicializar conexão com Google Drive. Verifique sua conexão com a internet.');
        return false;
    }
}

// ==================== FUNÇÃO PARA CONECTAR COM GOOGLE DRIVE ====================
// Função para autenticar usuário no Google Drive
async function connectGoogleDrive() {
    try {
        // ==================== VERIFICAÇÃO DAS CONFIGURAÇÕES ====================
        if (GOOGLE_CONFIG.CLIENT_ID.includes('SEU_CLIENT_ID_AQUI')) {
            alert('⚠️ Para usar a sincronização, você precisa configurar suas credenciais do Google Drive.\n\n' +
                  '1. Vá em https://console.developers.google.com/\n' +
                  '2. Crie um projeto\n' +
                  '3. Ative a API do Google Drive\n' +
                  '4. Crie credenciais OAuth 2.0\n' +
                  '5. Substitua CLIENT_ID e API_KEY no código');
            return;
        }
        
        // ==================== ATUALIZAÇÃO DO STATUS ====================
        document.getElementById('connection-status').textContent = '🟡 Conectando...';
        document.getElementById('connection-status').className = 'status-indicator connecting';
        
        // ==================== INICIALIZAÇÃO DA API ====================
        const initialized = await initializeGoogleAPI();
        if (!initialized) return;
        
        // ==================== AUTENTICAÇÃO ====================
        const authInstance = gapi.auth2.getAuthInstance();
        
        if (!authInstance.isSignedIn.get()) {
            // Se usuário não está logado, solicita login
            const user = await authInstance.signIn();
            accessToken = user.getAuthResponse().access_token;
        } else {
            // Se já está logado, pega token atual
            const user = authInstance.currentUser.get();
            accessToken = user.getAuthResponse().access_token;
        }
        
        // ==================== SUCESSO NA CONEXÃO ====================
        isConnected = true;
        updateSyncStatus();
        
        alert('✅ Conectado ao Google Drive com sucesso!');
        
    } catch (error) {
        console.error('Erro na conexão:', error);
        
        // ==================== TRATAMENTO DE ERRO ====================
        isConnected = false;
        updateSyncStatus();
        
        document.getElementById('connection-status').textContent = '🔴 Erro na conexão';
        document.getElementById('connection-status').className = 'status-indicator error';
        
        alert('❌ Erro ao conectar com Google Drive: ' + error.message);
    }
}

// ==================== FUNÇÃO PARA SINCRONIZAR PARA A NUVEM ====================
// Função para enviar tarefas para o Google Drive
async function syncToCloud() {
    if (!isConnected) {
        alert('❌ Você precisa estar conectado ao Google Drive primeiro!');
        return;
    }
    
    try {
        // ==================== PREPARAÇÃO DOS DADOS ====================
        const dataToSync = {
            tasks: tasks,
            syncTime: new Date().toISOString(),
            version: '1.0'
        };
        
        // Converte dados para JSON
        const jsonData = JSON.stringify(dataToSync, null, 2);
        
        // ==================== PREPARAÇÃO DO ARQUIVO ====================
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        
        // Metadados do arquivo
        const metadata = {
            'name': 'todo-list-backup.json',
            'parents': ['appDataFolder'] // Salva na pasta de dados da app (invisível ao usuário)
        };
        
        // ==================== CONSTRUÇÃO DA REQUISIÇÃO ====================
        let multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            jsonData +
            close_delim;
        
        // ==================== ENVIO PARA GOOGLE DRIVE ====================
        let request;
        if (driveFileId) {
            // Se arquivo já existe, atualiza
            request = gapi.client.request({
                'path': `https://www.googleapis.com/upload/drive/v3/files/${driveFileId}`,
                'method': 'PATCH',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
        } else {
            // Se arquivo não existe, cria novo
            request = gapi.client.request({
                'path': 'https://www.googleapis.com/upload/drive/v3/files',
                'method': 'POST',
                'params': {'uploadType': 'multipart'},
                'headers': {
                    'Content-Type': 'multipart/related; boundary="' + boundary + '"'
                },
                'body': multipartRequestBody
            });
        }
        
        // ==================== PROCESSAMENTO DA RESPOSTA ====================
        const response = await request;
        
        if (response.status === 200) {
            // Sucesso
            if (!driveFileId) {
                driveFileId = response.result.id;
                localStorage.setItem('driveFileId', driveFileId);
            }
            
            // Atualiza timestamp da sincronização
            lastSyncTime = new Date().toISOString();
            localStorage.setItem('lastSyncTime', lastSyncTime);
            updateSyncStatus();
            
            alert('✅ Tarefas enviadas para o Google Drive com sucesso!');
        } else {
            throw new Error('Falha no upload: ' + response.status);
        }
        
    } catch (error) {
        console.error('Erro no sync upload:', error);
        alert('❌ Erro ao enviar para Google Drive: ' + error.message);
    }
}

// ==================== FUNÇÃO PARA SINCRONIZAR DA NUVEM ====================
// Função para baixar tarefas do Google Drive
async function syncFromCloud() {
    if (!isConnected) {
        alert('❌ Você precisa estar conectado ao Google Drive primeiro!');
        return;
    }
    
    if (!driveFileId) {
        alert('ℹ️ Nenhum backup encontrado no Google Drive. Faça upload primeiro.');
        return;
    }
    
    try {
        // ==================== DOWNLOAD DO ARQUIVO ====================
        const response = await gapi.client.drive.files.get({
            fileId: driveFileId,
            alt: 'media'
        });
        
        // ==================== PROCESSAMENTO DOS DADOS ====================
        const cloudData = JSON.parse(response.body);
        
        // Confirma com usuário antes de sobrescrever
        const confirmOverwrite = confirm(
            `📥 Backup encontrado no Google Drive:\n\n` +
            `• Total de tarefas: ${cloudData.tasks.length}\n` +
            `• Data do backup: ${new Date(cloudData.syncTime).toLocaleString()}\n\n` +
            `⚠️ Isso substituirá suas tarefas atuais (${tasks.length} tarefas).\n\n` +
            `Deseja continuar?`
        );
        
        if (confirmOverwrite) {
            // ==================== SUBSTITUIÇÃO DOS DADOS ====================
            tasks = cloudData.tasks || [];
            
            // Salva no localStorage
            saveTasks();
            
            // Atualiza interface
            renderTasks();
            
            // Atualiza timestamp da sincronização
            lastSyncTime = new Date().toISOString();
            localStorage.setItem('lastSyncTime', lastSyncTime);
            updateSyncStatus();
            
            alert('✅ Tarefas baixadas do Google Drive com sucesso!');
        }
        
    } catch (error) {
        console.error('Erro no sync download:', error);
        alert('❌ Erro ao baixar do Google Drive: ' + error.message);
    }
}

// ==================== FUNÇÃO PARA DESCONECTAR ====================
// Função para desconectar do Google Drive
async function disconnectCloud() {
    try {
        // ==================== LOGOUT DO GOOGLE ====================
        if (gapi.auth2) {
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance.isSignedIn.get()) {
                await authInstance.signOut();
            }
        }
        
        // ==================== LIMPEZA DE DADOS ====================
        isConnected = false;
        accessToken = null;
        
        // Não remove driveFileId para poder reconectar ao mesmo arquivo
        // driveFileId = null;
        // localStorage.removeItem('driveFileId');
        
        // ==================== ATUALIZAÇÃO DA INTERFACE ====================
        updateSyncStatus();
        
        alert('✅ Desconectado do Google Drive com sucesso!');
        
    } catch (error) {
        console.error('Erro na desconexão:', error);
        alert('❌ Erro ao desconectar: ' + error.message);
    }
}

// ==================== INICIALIZAÇÃO DA APLICAÇÃO ====================
// Inicializa tema antes de renderizar tarefas
initializeTheme();
// Chama função que configura o tema (claro/escuro) baseado nas preferências

// Carrega informações de sincronização salvas
if (localStorage.getItem('driveFileId')) {
    driveFileId = localStorage.getItem('driveFileId');
}
if (localStorage.getItem('lastSyncTime')) {
    lastSyncTime = localStorage.getItem('lastSyncTime');
}

// Executa a função para exibir as tarefas assim que a página carrega
renderTasks();
// Esta linha executa imediatamente quando o script é carregado pelo navegador
// Mostra tarefas salvas anteriormente (se houver) no localStorage
// Se não houver tarefas salvas, mostra lista vazia
// Também inicializa os contadores com valores corretos