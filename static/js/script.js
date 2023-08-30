const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const deleteCheckedButton = document.getElementById('deleteChecked');
const checkAllButton = document.getElementById('checkAll');

let tasks = []


function addDragDropEvents(li) {
    li.draggable = true;
    li.addEventListener('dragstart', (e) => {
        const dragged = e.target.closest('li');
        const dragged_idx = Array.from(taskList.children).indexOf(dragged)
        e.dataTransfer.setData('text/plain', dragged_idx.toString());
    });

    li.addEventListener('dragenter', (e) => {
        e.preventDefault();
        const dragged = e.target.closest('li');
        dragged.classList.add('drag-over');
    });

    li.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragged = e.target.closest('li');
        dragged.classList.add('drag-over');
    });

    li.addEventListener('dragleave', (e) => {
        const dragged = e.target.closest('li');
        dragged.classList.remove('drag-over');
    });

    li.addEventListener('drop', (e) => {
        const dragged_idx = parseInt(e.dataTransfer.getData('text/plain'));
        const drop = e.target.closest('li');
        const drop_idx = Array.from(taskList.children).indexOf(drop);
        drop.classList.remove('drag-over');

        console.log(`Swapping ${dragged_idx} and ${drop_idx}`)
        const new_tasks = arrayMove(tasks, dragged_idx, drop_idx);
        tasks = new_tasks;
        renderTasks();
    });
}

function arrayMove(arr, from, to) {
    let low;
    let high;
    if (from < to) {
        low = from;
        high = to;
    } else {
        low = to;
        high = from;
    }
    const element_low = arr[low];
    const element_high = arr[high];
    const arr_start = arr.slice(0, low);
    const arr_mid = arr.slice(low+1, high);
    const arr_end = arr.slice(high+1);
    return arr_start.concat(element_high).concat(arr_mid).concat(element_low).concat(arr_end);
}

function createTaskLi(tasks, taskIdx) {
    const li = document.createElement('li');
    const task = tasks[taskIdx];
    li.id = `todo_${taskIdx}_li`
    li.classList.add('taskLi');
    li.innerHTML = `
      <button class="deleteBtn" id="todo_${taskIdx}_delete">Delete</button>
      <input type="checkbox" id="todo_${taskIdx}_check" ${task.completed ? 'checked' : ''}>
      <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
      <button class="editBtn" id="todo_${taskIdx}_edit">&#x270e;</button>
    `;
    const checkbox = li.querySelector('input[type="checkbox"]');
    const deleteBtn = li.querySelector('.deleteBtn');
    const span = li.querySelector('span');
    const editBtn = li.querySelector(`#todo_${taskIdx}_edit`);

    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.querySelector('span').classList.toggle('completed');
    });

    deleteBtn.addEventListener('click', () => {
        tasks.splice(taskIdx, 1);
        li.remove();
    });

    const editInput = document.createElement('input');
    editInput.addEventListener('blur', () => {
        span.textContent = editInput.value;
        li.replaceChild(span, editInput);
    });
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            span.textContent = editInput.value;
            task.title = span.textContent;
            li.replaceChild(span, editInput);
            renderTasks();
        }
    });

    editBtn.addEventListener('click', () => {
        editInput.value = span.textContent;
        li.replaceChild(editInput, span)

    });

    addDragDropEvents(li);

    return li;
}

function renderTasks() {
    taskList.innerHTML = '';
    taskList.draggable = true;
    for (let i = 0; i < tasks.length; i++) {
        const li = createTaskLi(tasks, i);

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
        taskInput.value = '';
        renderTasks();
    }
});

deleteCheckedButton.addEventListener('click', (e) => {
    e.preventDefault();
    new_tasks_list = [];
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            new_tasks_list.push(tasks[i]);
        }
    }
    tasks = new_tasks_list;
    renderTasks()
});

checkAllButton.addEventListener('click', (e) => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].completed = true;
    }
    renderTasks()
})

// Add event listener for task clicks
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const li = e.target.parentNode;
        const index = Array.from(taskList.children).indexOf(li);
        tasks[index].completed = !tasks[index].completed;
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
            previousTaskList = JSON.stringify(tasks)
            renderTasks();
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Initial rendering of tasks
fetchTasks();
renderTasks();