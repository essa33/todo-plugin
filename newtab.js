document.addEventListener('DOMContentLoaded', async () => {
  const { todos, completedTodos } = await loadTodos();
  
  const todoList = document.getElementById('todoList');
  const completedList = document.getElementById('completedList');

  renderTodos(todos, completedTodos);
});

async function renderTodos(todos, completedTodos) {
  try {
    const { todos: todosLoaded, completedTodos: completedTodosLoaded } = await loadTodos();
    
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');

    todoList.innerHTML = '';
    completedList.innerHTML = '';

    if (Array.isArray(todosLoaded)) {
      todosLoaded.forEach(todo => {
        const listItem = createTodoElement(todo, false);
        todoList.appendChild(listItem);
      });
    } else {
      console.error('Todos is not an array:', todosLoaded);
    }

    if (Array.isArray(completedTodosLoaded)) {
      completedTodosLoaded.forEach(todo => {
        const listItem = createTodoElement(todo, true);
        completedList.appendChild(listItem);
      });
    } else {
      console.error('CompletedTodos is not an array:', completedTodosLoaded);
    }
  } catch (error) {
    console.error('Error rendering todos:', error);
  }
}

function createTodoElement(todo, isCompleted) {
  const listItem = document.createElement('li');
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', async (event) => {
    event.preventDefault(); // Prevent the default action
    todo.done = checkbox.checked;
    await updateTodoStatus(todo);
    await renderTodos(); // Re-render all todos
  });

  const taskSpan = document.createElement('span');
  taskSpan.textContent = todo.text;
  if (todo.done) {
    taskSpan.classList.add('done');
  }

  const timerSpan = document.createElement('span');
  timerSpan.className = 'timer';
  updateTimerDisplay(timerSpan, todo);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await deleteTodo(todo);
    await saveAllTodos();
    await renderTodos();
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(taskSpan);
  listItem.appendChild(timerSpan);
  listItem.appendChild(deleteButton);

  return listItem;
}

async function updateTodoStatus(todo) {
  const { todos, completedTodos } = await loadTodos();
  
  if (todo.done) {
    // Move from todos to completedTodos
    const index = todos.findIndex(t => t.text === todo.text);
    if (index !== -1) {
      const [movedTodo] = todos.splice(index, 1);
      movedTodo.done = true;
      completedTodos.push(movedTodo);
    }
  } else {
    // Move from completedTodos to todos
    const index = completedTodos.findIndex(t => t.text === todo.text);
    if (index !== -1) {
      const [movedTodo] = completedTodos.splice(index, 1);
      movedTodo.done = false;
      todos.push(movedTodo);
    }
  }

  await saveTodos(todos, completedTodos);
}

async function deleteTodo(todo) {
  const { todos, completedTodos } = await loadTodos();
  
  const todoIndex = todos.findIndex(t => t.text === todo.text);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
  }

  const completedIndex = completedTodos.findIndex(t => t.text === todo.text);
  if (completedIndex !== -1) {
    completedTodos.splice(completedIndex, 1);
  }

  await saveTodos(todos, completedTodos);
}

function updateTimerDisplay(timerSpan, todo) {
  if (todo.done) {
    const timeSpent = calculateTimeSpent(new Date(todo.startTime));
    timerSpan.textContent = `Time spent: ${timeSpent}`;
  } else {
    const endTime = new Date(todo.endTime);
    updateTimer(timerSpan, endTime);
    setInterval(() => updateTimer(timerSpan, endTime), 1000);
  }
}

async function saveAllTodos() {
  const { todos, completedTodos } = await loadTodos();
  await saveTodos(todos, completedTodos);
}

// Make sure to call this when the page loads
document.addEventListener('DOMContentLoaded', renderTodos);
