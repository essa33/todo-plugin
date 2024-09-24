function createTodoElement(todo, isCompleted) {
    const listItem = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      taskSpan.classList.toggle('done', checkbox.checked);
      if (checkbox.checked) {
        moveToCompleted(listItem, todo, timerInterval, timerSpan);
      } else {
        moveToTodoList(listItem, todo, timerInterval, timerSpan, endTime);
      }
      saveAllTodos();
    });
  
    const taskSpan = document.createElement('span');
    taskSpan.textContent = todo.text;
    if (todo.done) {
      taskSpan.classList.add('done');
    }
  
    const timerSpan = document.createElement('span');
    timerSpan.className = 'timer';
    const startTime = new Date(todo.startTime);
    const endTime = new Date(todo.endTime);
    timerSpan.dataset.startTime = startTime.toISOString();
    timerSpan.dataset.endTime = endTime.toISOString();
    let timerInterval;
    if (!checkbox.checked) {
      timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000);
    } else {
      const timeSpent = calculateTimeSpent(startTime);
      timerSpan.textContent = `Time spent: ${timeSpent}`;
    }
  
    taskSpan.addEventListener('dblclick', () => {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = taskSpan.textContent;
      listItem.replaceChild(editInput, taskSpan);
  
      editInput.addEventListener('blur', () => {
        taskSpan.textContent = editInput.value;
        listItem.replaceChild(taskSpan, editInput);
        saveAllTodos();
      });
  
      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          taskSpan.textContent = editInput.value;
          listItem.replaceChild(taskSpan, editInput);
          saveAllTodos();
        }
      });
  
      editInput.focus();
    });
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      clearInterval(timerInterval);
      listItem.remove();
      saveAllTodos();
    });
  
    listItem.appendChild(checkbox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(timerSpan);
    listItem.appendChild(deleteButton);
  
    return listItem;
  }
  
  function moveToCompleted(listItem, todo, timerInterval, timerSpan) {
    document.getElementById('todoList').removeChild(listItem);
    document.getElementById('completedList').appendChild(listItem);
    clearInterval(timerInterval);
    const timeSpent = calculateTimeSpent(todo.startTime);
    timerSpan.textContent = `Time spent: ${timeSpent}`;
  }
  
  function moveToTodoList(listItem, todo, timerInterval, timerSpan, endTime) {
    document.getElementById('completedList').removeChild(listItem);
    document.getElementById('todoList').appendChild(listItem);
    timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000);
  }
  
  function saveAllTodos() {
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');
    const todos = [];
    const completedTodos = [];
  
    todoList.querySelectorAll('li').forEach(item => {
      const taskSpan = item.querySelector('span');
      const checkbox = item.querySelector('input[type="checkbox"]');
      const timerSpan = item.querySelector('.timer');
      todos.push({
        text: taskSpan.textContent,
        done: checkbox.checked,
        startTime: timerSpan.dataset.startTime,
        endTime: timerSpan.dataset.endTime
      });
    });
  
    completedList.querySelectorAll('li').forEach(item => {
      const taskSpan = item.querySelector('span');
      const checkbox = item.querySelector('input[type="checkbox"]');
      const timerSpan = item.querySelector('.timer');
      completedTodos.push({
        text: taskSpan.textContent,
        done: checkbox.checked,
        startTime: timerSpan.dataset.startTime,
        endTime: timerSpan.dataset.endTime
      });
    });
  
    saveTodos(todos, completedTodos);
  }