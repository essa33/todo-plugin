document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addTodo').addEventListener('click', addTodo);
    loadTodos();
  });
  
  function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const timeInput = document.getElementById('timeInput');
    const todoText = todoInput.value.trim();
    const descriptionText = descriptionInput.value.trim();
    const timeText = timeInput.value.trim();
  
    if (todoText !== '' && timeText !== '') {
      const todoList = document.getElementById('todoList');
      const listItem = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', () => {
        taskSpan.classList.toggle('done', checkbox.checked);
        if (checkbox.checked) {
          todoList.removeChild(listItem);
          document.getElementById('completedList').appendChild(listItem);
          clearInterval(timerInterval); // Stop the timer
          const timeSpent = calculateTimeSpent(startTime);
          timerSpan.textContent = `Time spent: ${timeSpent}`;
        } else {
          document.getElementById('completedList').removeChild(listItem);
          todoList.appendChild(listItem);
          timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000); // Restart the timer
        }
        saveTodos();
      });
  
      const taskSpan = document.createElement('span');
      taskSpan.textContent = `${todoText} - ${descriptionText}`;
  
      const timerSpan = document.createElement('span');
      timerSpan.className = 'timer';
      const startTime = new Date(); // Store the start time
      const endTime = calculateEndTime(timeText);
      timerSpan.dataset.startTime = startTime.toISOString(); // Store startTime as a string
      timerSpan.dataset.endTime = endTime.toISOString(); // Store endTime as a string
      let timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000);
  
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
        clearInterval(timerInterval); // Stop the timer
        todoList.removeChild(listItem);
        saveTodos();
      });
  
      listItem.appendChild(checkbox);
      listItem.appendChild(taskSpan);
      listItem.appendChild(timerSpan);
      listItem.appendChild(deleteButton);
      todoList.appendChild(listItem);
      todoInput.value = '';
      descriptionInput.value = '';
      timeInput.value = '';
      saveTodos();
    }
  }
  
  function calculateTimeSpent(startTime) {
    const now = new Date();
    const timeSpentMs = now - new Date(startTime);
    const seconds = Math.floor((timeSpentMs / 1000) % 60);
    const minutes = Math.floor((timeSpentMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeSpentMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeSpentMs / (1000 * 60 * 60 * 24));
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  function calculateEndTime(timeText) {
    const now = new Date();
    const timeValue = parseInt(timeText.slice(0, -1));
    const timeUnit = timeText.slice(-1);
  
    switch (timeUnit) {
      case 'm':
        now.setMinutes(now.getMinutes() + timeValue);
        break;
      case 'h':
        now.setHours(now.getHours() + timeValue);
        break;
      case 'd':
        now.setDate(now.getDate() + timeValue);
        break;
      default:
        throw new Error('Invalid time unit');
    }
  
    return now;
  }
  
  function updateTimer(timerSpan, endTime) {
    const now = new Date();
    const timeLeft = endTime - now;
  
    if (timeLeft <= 0) {
      timerSpan.textContent = 'Time is up!';
      return;
    }
  
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    timerSpan.textContent = `${hours}h ${minutes}m ${seconds}s`;
  }
  
  function saveTodos() {
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
        startTime: timerSpan.dataset.startTime, // Ensure startTime is stored as a string
        endTime: timerSpan.dataset.endTime // Ensure endTime is stored as a string
      });
    });
  
    completedList.querySelectorAll('li').forEach(item => {
      const taskSpan = item.querySelector('span');
      const checkbox = item.querySelector('input[type="checkbox"]');
      const timerSpan = item.querySelector('.timer');
      completedTodos.push({
        text: taskSpan.textContent,
        done: checkbox.checked,
        startTime: timerSpan.dataset.startTime, // Ensure startTime is stored as a string
        endTime: timerSpan.dataset.endTime // Ensure endTime is stored as a string
      });
    });
  
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }
  
  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const completedTodos = JSON.parse(localStorage.getItem('completedTodos')) || [];
    const todoList = document.getElementById('todoList');
    const completedList = document.getElementById('completedList');
  
    todos.forEach(todo => {
      const listItem = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      checkbox.addEventListener('change', () => {
        taskSpan.classList.toggle('done', checkbox.checked);
        if (checkbox.checked) {
          todoList.removeChild(listItem);
          completedList.appendChild(listItem);
          clearInterval(timerInterval); // Stop the timer
          const timeSpent = calculateTimeSpent(todo.startTime);
          timerSpan.textContent = `Time spent: ${timeSpent}`;
        } else {
          completedList.removeChild(listItem);
          todoList.appendChild(listItem);
          timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000); // Restart the timer
        }
        saveTodos();
      });
  
      const taskSpan = document.createElement('span');
      taskSpan.textContent = todo.text;
      if (todo.done) {
        taskSpan.classList.add('done');
      }
  
      const timerSpan = document.createElement('span');
      timerSpan.className = 'timer';
      const startTime = new Date(todo.startTime); // Parse startTime back into a Date object
      const endTime = new Date(todo.endTime); // Parse endTime back into a Date object
      timerSpan.dataset.startTime = startTime.toISOString(); // Store startTime as a string
      timerSpan.dataset.endTime = endTime.toISOString(); // Store endTime as a string
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
        clearInterval(timerInterval); // Stop the timer
        todoList.removeChild(listItem);
        saveTodos();
      });
  
      listItem.appendChild(checkbox);
      listItem.appendChild(taskSpan);
      listItem.appendChild(timerSpan);
      listItem.appendChild(deleteButton);
      todoList.appendChild(listItem);
    });
  
    completedTodos.forEach(todo => {
      const listItem = document.createElement('li');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;
      checkbox.addEventListener('change', () => {
        taskSpan.classList.toggle('done', checkbox.checked);
        if (checkbox.checked) {
          todoList.removeChild(listItem);
          completedList.appendChild(listItem);
          clearInterval(timerInterval); // Stop the timer
          const timeSpent = calculateTimeSpent(todo.startTime);
          timerSpan.textContent = `Time spent: ${timeSpent}`;
        } else {
          completedList.removeChild(listItem);
          todoList.appendChild(listItem);
          timerInterval = setInterval(() => updateTimer(timerSpan, endTime), 1000); // Restart the timer
        }
        saveTodos();
      });
  
      const taskSpan = document.createElement('span');
      taskSpan.textContent = todo.text;
      if (todo.done) {
        taskSpan.classList.add('done');
      }
  
      const timerSpan = document.createElement('span');
      timerSpan.className = 'timer';
      const startTime = new Date(todo.startTime); // Parse startTime back into a Date object
      const endTime = new Date(todo.endTime); // Parse endTime back into a Date object
      timerSpan.dataset.startTime = startTime.toISOString(); // Store startTime as a string
      timerSpan.dataset.endTime = endTime.toISOString(); // Store endTime as a string
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
        clearInterval(timerInterval); // Stop the timer
        completedList.removeChild(listItem);
        saveTodos();
      });
  
      listItem.appendChild(checkbox);
      listItem.appendChild(taskSpan);
      listItem.appendChild(timerSpan);
      listItem.appendChild(deleteButton);
      completedList.appendChild(listItem);
    });
  }