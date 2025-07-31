// INICIALIZAÇÃO DO SISTEMA
// Carrega as tarefas salvas no localStorage do navegador, ou cria um array vazio se não houver nenhuma
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// JSON.parse() converte texto JSON de volta para objeto JavaScript
// localStorage.getItem("tasks") busca dados salvos com a chave "tasks"
// || [] significa "ou array vazio" caso não exista nada salvo

// VARIÁVEIS DE CONTROLE DOS FILTROS
// Armazena o filtro de status atual (todas, pendentes, concluidas)
let currentFilter = 'todas';
// Armazena o filtro de categoria atual (todas, pessoal, trabalho, estudo)
let currentCategoryFilter = 'todas';

// FUNÇÃO PARA PERSISTÊNCIA DE DADOS
// Função para salvar as tarefas no localStorage (memória local do navegador)
function saveTasks() {
    // Converte o array de tarefas em texto JSON e salva no localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // JSON.stringify() converte objeto JavaScript para texto JSON
    // localStorage.setItem() salva dados no navegador com uma chave específica
}

// FUNÇÃO PRINCIPAL DE EXIBIÇÃO
// Função para exibir todas as tarefas na tela
function renderTasks() {
    // Pega o elemento HTML da lista onde as tarefas serão exibidas
    const list = document.getElementById("lista-tarefas");
    // document.getElementById() busca elemento HTML pelo ID
    
    // Limpa todo o conteúdo da lista antes de recriar
    list.innerHTML = "";
    // innerHTML = "" remove todo conteúdo HTML do elemento

    // Para cada tarefa no array, cria um item da lista
    tasks.forEach((task, index) => {
        // forEach() percorre cada item do array
        // task = tarefa atual, index = posição no array (0, 1, 2...)
        
        // Cria um novo elemento <li> (item da lista)
        const li = document.createElement("li");
        // createElement() cria um novo elemento HTML na memória
        
        // VERIFICAÇÕES DE COMPATIBILIDADE (suporte a dados antigos)
        // Verifica se task é objeto ou string (compatibilidade com versão antiga)
        const taskText = typeof task === 'object' ? task.text : task;
        // typeof verifica o tipo de dados
        // Operador ternário: condição ? valor_se_true : valor_se_false
        
        const isCompleted = typeof task === 'object' ? task.completed : false;
        // Se for objeto, pega propriedade 'completed', senão assume false
        
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        // Se for objeto, pega propriedade 'priority', senão assume 'baixa'
        
        const category = typeof task === 'object' ? task.category : 'pessoal';
        // Se for objeto, pega propriedade 'category', senão assume 'pessoal'
        
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        // Se for objeto, pega propriedade 'dueDate', senão assume string vazia
        
        // CONSTRUÇÃO DO HTML DA TAREFA
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
        // Template literal (`) permite inserir variáveis com ${variavel}
        // onchange="toggleTask(${index})" chama função quando checkbox muda
        // ${isCompleted ? 'checked' : ''} adiciona 'checked' se tarefa concluída
        // ${isCompleted ? 'completed' : ''} adiciona classe CSS se concluída
        // priority.toUpperCase() converte texto para maiúsculo
        // new Date(dueDate).toLocaleDateString() formata data para padrão local
        
        // Adiciona o item criado à lista na tela
        list.appendChild(li);
        // appendChild() insere o elemento <li> dentro do elemento <ul>
    });

    updateTaskCounter();
}

// FUNÇÃO PARA ADICIONAR NOVA TAREFA
// Função para adicionar uma nova tarefa
function addTask() {
    // CAPTURA DOS ELEMENTOS HTML
    // Pega o elemento do campo de input onde o usuário digita a tarefa
    const input = document.getElementById("tarefa");
    const categorySelect = document.getElementById("categoria");
    const prioritySelect = document.getElementById("prioridade");
    const dueDateInput = document.getElementById("data-vencimento");
    
    // VALIDAÇÃO DOS DADOS
    // Pega o valor digitado e remove espaços em branco no início/fim
    const taskText = input.value.trim();
    // .value pega o valor do input
    // .trim() remove espaços extras no início e fim

    // Verifica se o usuário digitou alguma coisa
    if (taskText) {
        // CRIAÇÃO DO OBJETO TAREFA
        // Cria objeto da tarefa com todas as propriedades
        const newTask = {
            id: Date.now(), // Gera um ID único baseado no timestamp atual (millisegundos desde 1970)
            text: taskText, // O texto da tarefa é o valor digitado pelo usuário
            completed: false, // Inicialmente, a tarefa não está completa
            category: categorySelect.value, // Categoria selecionada no dropdown
            priority: prioritySelect.value, // Prioridade selecionada no dropdown
            dueDate: dueDateInput.value, // Data de vencimento selecionada
            createdAt: new Date().toISOString() // Armazena a data de criação no formato ISO
        };

        // ATUALIZAÇÃO DO SISTEMA
        // Adiciona a nova tarefa ao final do array
        tasks.push(newTask);
        // .push() adiciona elemento no final do array
        
        // Limpa os campos de input
        input.value = "";
        dueDateInput.value = "";
        // Define valor vazio para limpar os campos
        
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Chama função que salva dados no navegador
        
        // Atualiza a exibição das tarefas na tela
        renderTasks();
        // Chama função que reconstroi a lista visual
    }
}

// FUNÇÃO PARA MARCAR/DESMARCAR COMO CONCLUÍDA
// Função para alternar o status de conclusão da tarefa
function toggleTask(index) {
    // CONVERSÃO DE COMPATIBILIDADE
    // Se task for string, converte para objeto
    if (typeof tasks[index] === 'string') {
        // Substitui string por objeto completo para manter compatibilidade
        tasks[index] = {
            id: Date.now(), // Gera ID único
            text: tasks[index], // Usa a string como texto
            completed: false, // Inicialmente não concluída
            category: 'pessoal', // Categoria padrão
            priority: 'baixa', // Prioridade padrão
            dueDate: '', // Sem data de vencimento
            createdAt: new Date().toISOString() // Data de criação atual
        };
    }
    
    // ALTERAÇÃO DO STATUS
    // Alterna o status de conclusão
    tasks[index].completed = !tasks[index].completed;
    // ! inverte o valor boolean (true vira false, false vira true)
    
    // PERSISTÊNCIA E ATUALIZAÇÃO
    saveTasks(); // Salva alterações
    renderTasks(); // Atualiza visualização
}

// FUNÇÃO PARA REMOVER TAREFA
// Função para remover uma tarefa específica
function removeTask(index) {
    // Remove 1 elemento do array na posição especificada pelo index
    tasks.splice(index, 1);
    // .splice(posição, quantidade) remove elementos do array
    // splice(index, 1) remove 1 elemento na posição 'index'
    
    // Salva as tarefas atualizadas no localStorage
    saveTasks();
    // Atualiza a exibição das tarefas na tela
    renderTasks();
}

// FUNÇÃO PARA EDITAR TAREFA
// Função para editar uma tarefa existente
function editTask(index) {
    // CAPTURA DO TEXTO ATUAL
    // Pega o texto atual da tarefa
    const currentText = typeof tasks[index] === 'object' ? tasks[index].text : tasks[index];
    // Verifica se é objeto ou string e pega o texto correspondente
    
    // INTERFACE DE EDIÇÃO
    // Mostra uma caixa de diálogo para o usuário editar a tarefa
    const newTaskText = prompt("Editar tarefa:", currentText);
    // prompt() mostra janela com campo de texto
    // Segundo parâmetro define valor inicial do campo

    // VALIDAÇÃO E ATUALIZAÇÃO
    // Verifica se o usuário não cancelou e digitou algo válido
    if (newTaskText !== null && newTaskText.trim() !== "") {
        // newTaskText !== null verifica se usuário não cancelou
        // newTaskText.trim() !== "" verifica se não está vazio
        
        // CONVERSÃO DE COMPATIBILIDADE
        // Se task for string, converte para objeto
        if (typeof tasks[index] === 'string') {
            tasks[index] = {
                id: Date.now(), // Gera ID único
                text: tasks[index], // Usa string original como texto
                completed: false, // Status padrão
                category: 'pessoal', // Categoria padrão
                priority: 'baixa', // Prioridade padrão
                dueDate: '', // Sem data de vencimento
                createdAt: new Date().toISOString() // Data de criação atual
            };
        }
        
        // ATUALIZAÇÃO DO TEXTO
        // Atualiza apenas o texto da tarefa
        tasks[index].text = newTaskText.trim();
        // .trim() remove espaços extras
        
        // PERSISTÊNCIA E ATUALIZAÇÃO
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
}

// FUNÇÃO DE BUSCA
// Função para buscar tarefas
function searchTasks() {
    // CAPTURA DO TERMO DE BUSCA
    const searchTerm = document.getElementById("busca").value.toLowerCase();
    // .toLowerCase() converte para minúsculas para busca case-insensitive
    
    // Se campo de busca estiver vazio, aplica apenas os filtros
    if (searchTerm.trim() === '') {
        applyFilters(); // Volta aos filtros normais
        return; // Para a execução da função aqui
    }
    
    // PRIMEIRO APLICA OS FILTROS, DEPOIS A BUSCA
    // Começa com todas as tarefas
    let filteredTasks = [...tasks];

    // Aplica filtro de status
    if (currentFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            const isCompleted = typeof task === 'object' ? task.completed : false;
            if (currentFilter === 'pendentes') {
                return !isCompleted;
            } else if (currentFilter === 'concluidas') {
                return isCompleted;
            }
            return true;
        });
    }
    
    // Aplica filtro de categoria
    if (currentCategoryFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            const taskCategory = typeof task === 'object' ? task.category : 'pessoal';
            return taskCategory === currentCategoryFilter;
        });
    }
    
    // APLICA BUSCA POR TEXTO
    // Agora filtra por texto dentro dos resultados já filtrados
    filteredTasks = filteredTasks.filter(task => {
        const taskText = typeof task === 'object' ? task.text : task;
        return taskText.toLowerCase().includes(searchTerm);
        // .includes() verifica se texto contém o termo buscado
    });
    
    // EXIBIÇÃO DOS RESULTADOS
    renderFilteredTasks(filteredTasks);
    // Chama função específica para exibir tarefas filtradas
}

// FUNÇÕES DE FILTRO
// Função para filtrar tarefas por status (todas, pendentes, concluídas)
function filterTasks(filterType) {
    // ATUALIZAÇÃO DO FILTRO ATUAL
    // Armazena o tipo de filtro selecionado
    currentFilter = filterType;
    
    // ATUALIZAÇÃO VISUAL DOS BOTÕES
    // Remove classe 'active' de todos os botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        // .querySelectorAll() seleciona todos elementos com classe .filter-btn
        btn.classList.remove('active');
        // .classList.remove() remove uma classe CSS do elemento
    });
    
    // Adiciona classe 'active' ao botão clicado
    event.target.classList.add('active');
    // event.target é o elemento que foi clicado
    // .classList.add() adiciona uma classe CSS ao elemento
    
    // APLICAÇÃO DO FILTRO
    // Aplica os filtros combinados (status + categoria)
    applyFilters();
}

// Função para filtrar tarefas por categoria
function filterByCategory() {
    // CAPTURA DA CATEGORIA SELECIONADA
    // Pega o valor selecionado no dropdown de categorias
    const categorySelect = document.getElementById("filtro-categoria");
    currentCategoryFilter = categorySelect.value;
    // .value pega o valor da opção selecionada no select
    
    // APLICAÇÃO DO FILTRO
    // Aplica os filtros combinados (status + categoria)
    applyFilters();
}

// Função principal que aplica todos os filtros combinados
function applyFilters() {
    // INÍCIO COM TODAS AS TAREFAS
    // Cria uma cópia do array original para não modificar o array principal
    let filteredTasks = [...tasks];
    // [...array] é spread operator - cria cópia superficial do array
    
    // FILTRO POR STATUS (pendentes/concluídas)
    // Aplica filtro de status se não for "todas"
    if (currentFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            // .filter() cria novo array apenas com elementos que atendem condição
            
            // Pega status de conclusão da tarefa
            const isCompleted = typeof task === 'object' ? task.completed : false;
            
            // Aplica lógica baseada no filtro selecionado
            if (currentFilter === 'pendentes') {
                return !isCompleted; // Retorna tarefas NÃO concluídas
                // ! inverte o valor boolean
            } else if (currentFilter === 'concluidas') {
                return isCompleted; // Retorna tarefas concluídas
            }
            
            return true; // Fallback - retorna todas (não deveria acontecer)
        });
    }

    // FILTRO POR CATEGORIA
    // Aplica filtro de categoria se não for "todas"
    if (currentCategoryFilter !== 'todas') {
        filteredTasks = filteredTasks.filter(task => {
            // Pega categoria da tarefa
            const taskCategory = typeof task === 'object' ? task.category : 'pessoal';
            
            // Retorna apenas tarefas da categoria selecionada
            return taskCategory === currentCategoryFilter;
            // Compara categoria da tarefa com filtro selecionado
        });
    }
    
    // EXIBIÇÃO DOS RESULTADOS
    // Renderiza as tarefas filtradas na tela
    renderFilteredTasks(filteredTasks);
}

// FUNÇÃO PARA EXIBIR RESULTADOS FILTRADOS
// Função para renderizar tarefas filtradas
function renderFilteredTasks(filteredTasks) {
    // PREPARAÇÃO DA LISTA
    const list = document.getElementById("lista-tarefas");
    list.innerHTML = ""; // Limpa lista atual

    // RENDERIZAÇÃO DE CADA TAREFA FILTRADA
    filteredTasks.forEach((task, originalIndex) => {
        // LOCALIZAÇÃO DO ÍNDICE ORIGINAL
        // Encontra o índice original da tarefa no array completo
        const taskIndex = tasks.findIndex(t => 
            // .findIndex() encontra posição do primeiro elemento que atende condição
            (typeof t === 'object' ? t.id : t) === (typeof task === 'object' ? task.id : task)
            // Compara IDs ou strings para encontrar tarefa original
        );
        
        // CONSTRUÇÃO DO ELEMENTO HTML
        const li = document.createElement("li");
        // Extrai propriedades da tarefa (mesmo código da renderTasks)
        const taskText = typeof task === 'object' ? task.text : task;
        const isCompleted = typeof task === 'object' ? task.completed : false;
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        const category = typeof task === 'object' ? task.category : 'pessoal';
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        
        // GERAÇÃO DO HTML (idêntico à renderTasks, mas usando taskIndex)
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
        // Usa taskIndex (posição original) para manter funcionalidade correta
        
        // INSERÇÃO NA LISTA
        list.appendChild(li);
    });

    updateTaskCounter();
    // Atualiza contadores de tarefas na interface
}

// FUNÇÃO PARA RESETAR FILTROS
// Função para limpar todos os filtros e mostrar todas as tarefas
function clearAllFilters() {
    // RESET DAS VARIÁVEIS DE FILTRO
    currentFilter = 'todas';
    currentCategoryFilter = 'todas';
    
    // RESET DOS ELEMENTOS VISUAIS
    // Limpa campo de busca
    document.getElementById("busca").value = '';
    
    // Reset do dropdown de categoria
    document.getElementById("filtro-categoria").value = 'todas';
    
    // Reset dos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-btn[onclick="filterTasks(\'todas\')"]').classList.add('active');
    
    // EXIBIÇÃO DE TODAS AS TAREFAS
    renderTasks();
}

// CONFIGURAÇÃO DE EVENTOS
// Adiciona um ouvinte de eventos para permitir adicionar tarefa pressionando Enter
document.getElementById("tarefa").addEventListener("keypress", function(event) {
    // .addEventListener() registra função para ser executada quando evento acontece
    // "keypress" é o evento de pressionar tecla
    
    // Verifica se a tecla pressionada foi Enter
    if (event.key === "Enter") {
        // event.key contém o nome da tecla pressionada
        
        // Chama a função para adicionar tarefa
        addTask();
    }
});

// FUNÇÃO PARA ATUALIZAR CONTADOR DE TAREFAS
// Função para calcular e exibir estatísticas das tarefas
function updateTaskCounter() {
    // Conta tarefas pendentes (não concluídas)
    const totalTasks = tasks.length; // Total de tarefas

    // Conta tarefas pendentes (não concluídas)
    const pendingTasks = tasks.filter(task => {
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return !isCompleted; // ! inverte - retorna tarefas NÃO concluídas
    }).length; // .length conta quantos elementos há no array filtrado

    // Conta tarefas concluídas
    const completedTasks = tasks.filter(task => {
            // Verifica se a tarefa está concluída
        const isCompleted = typeof task === 'object' ? task.completed : false;
        return isCompleted; // Retorna tarefas concluídas
    }).length; // .length conta quantos elementos há no array filtrado

    // ATUALIZAÇÃO DOS ELEMENTOS HTML
    // Atualiza os contadores das tarefas na interface HTML
    document.getElementById('total-tasks').textContent = totalTasks;
    // .textContent define o texto do elemento HTML

    // Atualiza o numero de tarefas pendentes
    document.getElementById('pending-tasks').textContent = pendingTasks;

    // Atualiza o numero de tarefas concluídas
    document.getElementById('completed-tasks').textContent = completedTasks;

    // Adiciona animação quando números mudam
    animateCounterUpdate();
}

// FUNÇÃO PARA ANIMAÇÃO DE CONTADOR
// Função para animar a atualização dos contadores
function animateCounterUpdate(){
    // SELEÇÃO DOS ELEMENTOS NÚMERO
    // Seleciona todos os elementos com classe 'counter-number'
    const counterNumbers = document.querySelectorAll('.counter-number');

    counterNumbers.forEach(number => {
        // Remove classe de animação se já existir
        number.classList.remove('counter-updated');

        // Adiciona classe de animação
        number.classList.add('counter-updated');

        // Remove a classe após a animação (500ms) para reiniciar a animação
        setTimeout(() => {
            number.classList.remove('counter-updated');
        }, 500);
        // setTimeout() executa função após delay especificado
    });
}

// INICIALIZAÇÃO DA APLICAÇÃO
// Executa a função para exibir as tarefas assim que a página carrega
renderTasks();
// Esta linha executa imediatamente quando o script é carregado
// Mostra tarefas salvas anteriormente (se houver)