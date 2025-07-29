// Carrega as tarefas salvas no localStorage do navegador, ou cria um array vazio se não houver nenhuma
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Função para salvar as tarefas no localStorage (memória local do navegador)
function saveTasks() {
    // Converte o array de tarefas em texto JSON e salva no localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para exibir todas as tarefas na tela
function renderTasks() {
    // Pega o elemento HTML da lista onde as tarefas serão exibidas
    const list = document.getElementById("lista-tarefas");
    // Limpa todo o conteúdo da lista antes de recriar
    list.innerHTML = "";

    // Para cada tarefa no array, cria um item da lista
    tasks.forEach((task, index) => {
        // Cria um novo elemento <li> (item da lista)
        const li = document.createElement("li");
        
        // Verifica se task é objeto ou string (compatibilidade com versão antiga)
        const taskText = typeof task === 'object' ? task.text : task;
        const isCompleted = typeof task === 'object' ? task.completed : false;
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        const category = typeof task === 'object' ? task.category : 'pessoal';
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        
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
        // Adiciona o item criado à lista na tela
        list.appendChild(li);
    });
}

// Função para adicionar uma nova tarefa
function addTask() {
    // Pega o elemento do campo de input onde o usuário digita a tarefa
    const input = document.getElementById("tarefa");
    const categorySelect = document.getElementById("categoria");
    const prioritySelect = document.getElementById("prioridade");
    const dueDateInput = document.getElementById("data-vencimento");
    
    // Pega o valor digitado e remove espaços em branco no início/fim
    const taskText = input.value.trim();

    // Verifica se o usuário digitou alguma coisa
    if (taskText) {
        // Cria objeto da tarefa com todas as propriedades
        const newTask = {
            id: Date.now(), // Gera um ID único baseado no timestamp atual
            text: taskText, // O texto da tarefa é o valor digitado pelo usuário
            completed: false, // Inicialmente, a tarefa não está completa
            category: categorySelect.value, // Categoria selecionada
            priority: prioritySelect.value, // Prioridade selecionada
            dueDate: dueDateInput.value, // Data de vencimento
            createdAt: new Date().toISOString() // Armazena a data de criação da tarefa
        };

        // Adiciona a nova tarefa ao final do array
        tasks.push(newTask);
        // Limpa os campos de input
        input.value = "";
        dueDateInput.value = "";
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
}

// Função para alternar o status de conclusão da tarefa
function toggleTask(index) {
    // Se task for string, converte para objeto
    if (typeof tasks[index] === 'string') {
        tasks[index] = {
            id: Date.now(),
            text: tasks[index],
            completed: false,
            category: 'pessoal',
            priority: 'baixa',
            dueDate: '',
            createdAt: new Date().toISOString()
        };
    }
    // Alterna o status de conclusão
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Função para remover uma tarefa específica
function removeTask(index) {
    // Remove 1 elemento do array na posição especificada pelo index
    tasks.splice(index, 1);
    // Salva as tarefas atualizadas no localStorage
    saveTasks();
    // Atualiza a exibição das tarefas na tela
    renderTasks();
}

// Função para editar uma tarefa existente
function editTask(index) {
    // Pega o texto atual da tarefa
    const currentText = typeof tasks[index] === 'object' ? tasks[index].text : tasks[index];
    // Mostra uma caixa de diálogo para o usuário editar a tarefa
    const newTaskText = prompt("Editar tarefa:", currentText);

    // Verifica se o usuário não cancelou e digitou algo válido
    if (newTaskText !== null && newTaskText.trim() !== "") {
        // Se task for string, converte para objeto
        if (typeof tasks[index] === 'string') {
            tasks[index] = {
                id: Date.now(),
                text: tasks[index],
                completed: false,
                category: 'pessoal',
                priority: 'baixa',
                dueDate: '',
                createdAt: new Date().toISOString()
            };
        }
        // Atualiza apenas o texto da tarefa
        tasks[index].text = newTaskText.trim();
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
}

// Função para buscar tarefas
function searchTasks() {
    const searchTerm = document.getElementById("busca").value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        const taskText = typeof task === 'object' ? task.text : task;
        return taskText.toLowerCase().includes(searchTerm);
    });
    renderFilteredTasks(filteredTasks);
}

// Função para renderizar tarefas filtradas
function renderFilteredTasks(filteredTasks) {
    const list = document.getElementById("lista-tarefas");
    list.innerHTML = "";

    filteredTasks.forEach((task, originalIndex) => {
        // Encontra o índice original da tarefa no array completo
        const taskIndex = tasks.findIndex(t => 
            (typeof t === 'object' ? t.id : t) === (typeof task === 'object' ? task.id : task)
        );
        
        const li = document.createElement("li");
        const taskText = typeof task === 'object' ? task.text : task;
        const isCompleted = typeof task === 'object' ? task.completed : false;
        const priority = typeof task === 'object' ? task.priority : 'baixa';
        const category = typeof task === 'object' ? task.category : 'pessoal';
        const dueDate = typeof task === 'object' ? task.dueDate : '';
        
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
        list.appendChild(li);
    });
}

// Adiciona um ouvinte de eventos para permitir adicionar tarefa pressionando Enter
document.getElementById("tarefa").addEventListener("keypress", function(event) {
    // Verifica se a tecla pressionada foi Enter
    if (event.key === "Enter") {
        // Chama a função para adicionar tarefa
        addTask();
    }
});

// Executa a função para exibir as tarefas assim que a página carrega
renderTasks();