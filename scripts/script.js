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
        // Define o conteúdo HTML do item da lista
        li.innerHTML = `
        ${task}
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
    // Pega o valor digitado e remove espaços em branco no início/fim
    const task = input.value.trim();

    // Verifica se o usuário digitou alguma coisa
    if (task) {
        // Adiciona a nova tarefa ao final do array
        tasks.push(task);
        // Limpa o campo de input
        input.value = "";
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
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
    // Mostra uma caixa de diálogo para o usuário editar a tarefa
    const newTask = prompt("Editar tarefa:", tasks[index]);

    // Verifica se o usuário não cancelou e digitou algo válido
    if (newTask !== null && newTask.trim() !== "") {
        // Substitui a tarefa antiga pela nova no array
        tasks[index] = newTask.trim();
        // Salva as tarefas atualizadas no localStorage
        saveTasks();
        // Atualiza a exibição das tarefas na tela
        renderTasks();
    }
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