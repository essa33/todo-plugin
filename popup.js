document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addTodo').addEventListener('click', addTodo);
  loadTodos();
});

function addTodo() {
  const todoInput = document.getElementById('todoInput');
  const todoText = todoInput.value.trim();
  if (todoText !== '') {
    const todoList = document.getElementById('todoList');
    const listItem = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      taskSpan.classList.toggle('done', checkbox.checked);
      saveTodos();
    });

    const taskSpan = document.createElement('span');
    taskSpan.textContent = todoText;

    taskSpan.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = taskSpan.textContent;
      listItem.replaceChild(editInput, taskSpan);

      editInput.addEventListener('blur', () => {
        taskSpan.textContent = editInput.value;
        listItem.replaceChild(taskSpan, editInput);
        saveTodos();
      });

      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          taskSpan.textContent = editInput.value;
          listItem.replaceChild(taskSpan, editInput);
          saveTodos();
        }
      });

      editInput.focus();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      todoList.removeChild(listItem);
      saveTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
    todoInput.value = '';
    saveTodos();
  }
}

function saveTodos() {
  const todoList = document.getElementById('todoList');
  const todos = [];
  todoList.querySelectorAll('li').forEach(item => {
    const taskSpan = item.querySelector('span');
    const checkbox = item.querySelector('input[type="checkbox"]');
    todos.push({
      text: taskSpan.textContent,
      done: checkbox.checked
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoList = document.getElementById('todoList');
  todos.forEach(todo => {
    const listItem = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      taskSpan.classList.toggle('done', checkbox.checked);
      saveTodos();
    });

    const taskSpan = document.createElement('span');
    taskSpan.textContent = todo.text;
    if (todo.done) {
      taskSpan.classList.add('done');
    }

    taskSpan.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = taskSpan.textContent;
      listItem.replaceChild(editInput, taskSpan);

      editInput.addEventListener('blur', () => {
        taskSpan.textContent = editInput.value;
        listItem.replaceChild(taskSpan, editInput);
        saveTodos();
      });

      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          taskSpan.textContent = editInput.value;
          listItem.replaceChild(taskSpan, editInput);
          saveTodos();
        }
      });

      editInput.focus();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      todoList.removeChild(listItem);
      saveTodos();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });
}