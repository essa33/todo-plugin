document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addTodo').addEventListener('click', addTodo);
    const { todos, completedTodos } = loadTodos();
    todos.forEach(todo => {
      const listItem = createTodoElement(todo, false);
      document.getElementById('todoList').appendChild(listItem);
    });
    completedTodos.forEach(todo => {
      const listItem = createTodoElement(todo, true);
      document.getElementById('completedList').appendChild(listItem);
    });
  });
  
  function addTodo() {
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
      saveAllTodos();
    }
  }