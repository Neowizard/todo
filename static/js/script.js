const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const li = document.createElement('li');
        li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
      <button class="deleteBtn">Delete</button>
    `;
        const checkbox = li.querySelector('input[type="checkbox"]');
        const deleteBtn = li.querySelector('.deleteBtn');

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            updateLocalStorage();
            li.querySelector('span').classList.toggle('completed');
        });

        deleteBtn.addEventListener('click', () => {
            tasks.splice(i, 1);
            updateLocalStorage();
            li.remove();
        });

        taskList.appendChild(li);
    }
}

// Add new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title !== '') {
        const task = {title, completed: false};
        tasks.push(task);
        updateLocalStorage();
        taskInput.value = '';
        renderTasks();
    }
});

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add event listener for task clicks
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const li = e.target.parentNode;
        const index = Array.from(taskList.children).indexOf(li);
        tasks[index].completed = !tasks[index].completed;
        updateLocalStorage();
        e.target.classList.toggle('completed');
        li.querySelector('input[type="checkbox"]').checked = tasks[index].completed;
    }
});
// Variable to store the previous task list
let previousTaskList = JSON.stringify(tasks);

// Function to check if task list has changed since last print
function hasTaskListChanged() {
    const currentTaskList = JSON.stringify(tasks);
    if (currentTaskList !== previousTaskList) {
        previousTaskList = currentTaskList;
        return true;
    }
    return false;
}

const listId = document.currentScript.getAttribute('data-list-id');

// Function to log task list as JSON
function logAndSendTaskList() {
    if (hasTaskListChanged()) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: previousTaskList
        };

        fetch(`http://${window.location.host}/todo/${listId}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    console.log('Task list sent successfully!');
                } else {
                    console.error('Error sending task list:', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Error sending task list:', error);
            });
    }
}

// Interval to log and send task list every 5 seconds (adjust as needed)
setInterval(logAndSendTaskList, 5000);


function fetchTasks() {
    fetch(`http://${window.location.host}/todo/${listId}`)
        .then(response => response.json())
        .then(data => {
            tasks = data;
            renderTasks();
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Initial rendering of tasks
fetchTasks();
renderTasks();