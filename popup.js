document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('addTodo').addEventListener('click', addTodo);
    document.getElementById('openNewTab').addEventListener('click', openNewTab);
    
    await renderTodos();

    // Listen for changes in chrome.storage
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && (changes.todos || changes.completedTodos)) {
            renderTodos();
        }
    });
});

async function renderTodos() {
    const { todos, completedTodos } = await loadTodos();
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');

    todoList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach(todo => {
        const listItem = createTodoElement(todo, false);
        todoList.appendChild(listItem);
    });

    completedTodos.forEach(todo => {
        const listItem = createTodoElement(todo, true);
        completedList.appendChild(listItem);
    });
}

async function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const timeInput = document.getElementById('timeInput');
    const todoText = todoInput.value.trim();
    const descriptionText = descriptionInput.value.trim();
    const timeText = timeInput.value.trim();
  
    if (todoText !== '' && timeText !== '') {
      const startTime = new Date();
      const endTime = calculateEndTime(timeText);
      const todo = {
        text: `${todoText} - ${descriptionText}`,
        done: false,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };
      const listItem = createTodoElement(todo, false);
      document.getElementById('todoList').appendChild(listItem);
      todoInput.value = '';
      descriptionInput.value = '';
      timeInput.value = '';
      await saveAllTodos();
      await renderTodos();
    }
}

function openNewTab() {
    chrome.tabs.create({url: 'newtab.html'});
}