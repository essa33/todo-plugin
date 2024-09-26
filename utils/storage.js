function saveTodos(todos, completedTodos) {
  if (!Array.isArray(todos)) todos = [];
  if (!Array.isArray(completedTodos)) completedTodos = [];
  chrome.storage.sync.set({ todos, completedTodos });
}

function loadTodos() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['todos', 'completedTodos'], (result) => {
      resolve({
        todos: Array.isArray(result.todos) ? result.todos : [],
        completedTodos: Array.isArray(result.completedTodos) ? result.completedTodos : []
      });
    });
  });
}