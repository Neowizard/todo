import * as backend from './backend.js';
import * as tasksView from './tasksView.js';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const deleteCheckedButton = document.getElementById('deleteChecked');
const checkAllButton = document.getElementById('checkAll');
const savedIndicator = document.getElementById('savedIndicator')
const taskList = document.getElementById('taskList')
const listId = taskList.dataset.parameter;

let tasks = null;
backend.fetchTasks(listId).then(fetchedTasks => {
    tasks = fetchedTasks;
    tasksView.renderTasks(tasks);
});


const hasTaskListChanged = (function () {
    let previousTaskList = null;

    return (function (tasks) {
        const currentTaskList = JSON.stringify(tasks);
        if (currentTaskList !== previousTaskList) {
            previousTaskList = currentTaskList;
            return true;
        }
        return false;
    });
})();

setInterval(async () => {
    if (hasTaskListChanged(tasks)) {
        const response = await backend.sendTaskList(tasks, listId);
        if (response.ok) {
            const now = new Date()
            savedIndicator.textContent = `Saved: ${now.toLocaleString()}`
        }
    }
}, 1000)


taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title !== '') {
        const task = {title, completed: false};
        tasks.push(task);
        taskInput.value = '';
        tasksView.renderTasks(tasks);
    }
});

deleteCheckedButton.addEventListener('click', (e) => {
    e.preventDefault();
    const new_tasks_list = [];
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].completed) {
            new_tasks_list.push(tasks[i]);
        }
    }
    tasks = new_tasks_list;
    tasksView.renderTasks(tasks);
});

checkAllButton.addEventListener('click', (e) => {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].completed = true;
    }
    tasksView.renderTasks(tasks);
})

taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        const li = e.target.parentNode;
        const index = Array.from(taskList.children).indexOf(li);
        tasks[index].completed = !tasks[index].completed;
        e.target.classList.toggle('completed');
        li.querySelector('input[type="checkbox"]').checked = tasks[index].completed;
    }
});
