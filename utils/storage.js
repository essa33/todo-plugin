function saveTodos(todos, completedTodos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }
  
  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const completedTodos = JSON.parse(localStorage.getItem('completedTodos')) || [];
    return { todos, completedTodos };
  }