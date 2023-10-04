import * as backend from './backend.js';
import * as taskView from './taskView.js';
import {TaskList} from './taskList.js';

const tasksTimestamp = document.getElementById('tasksTimestamp')
const listId = document.getElementById('taskList').dataset.parameter;

async function uploadTasksList(tasks) {
    const response = await backend.sendTaskList(tasks, listId);
    if (response.ok) {
        const now = new Date()
        tasksTimestamp.textContent = `Saved: ${now.toLocaleString()}`
    }
}

let tasksList = new TaskList([], uploadTasksList);

async function fetchTaskList() {
    const oldTasks = Array.from(tasksList.tasks)
    const fetchedTasks = await backend.fetchTasks(listId)
    if (!tasksList.listLocked) {
        if (tasksList.equalTasks(oldTasks)) {
            tasksList = new TaskList(fetchedTasks, uploadTasksList);
            taskView.renderTasks(tasksList);
            const now = new Date()
            tasksTimestamp.textContent = `Fetched: ${now.toLocaleString()}`
        } else {
            console.log(`Local tasks list changed during fetch. Dropping fetched list`)
        }
    } else {
        console.log(`Local and fetched tasks lists are identical`)
    }
}


setInterval(async () => {
    await fetchTaskList();
}, 5000);
fetchTaskList();

const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value.trim();
    if (title !== '') {
        const task = {title: title, completed: false};
        tasksList.addTask(task);
        taskView.renderTasks(tasksList)
        taskInput.value = '';
    }
});

const deleteCheckedButton = document.getElementById('deleteChecked');
deleteCheckedButton.addEventListener('click', (e) => {
    e.preventDefault();
    tasksList.deleteCompletedTasks()
    taskView.renderTasks(tasksList)
});

const checkAllButton = document.getElementById('checkAll');
checkAllButton.addEventListener('click', () => {
    tasksList.markAllTasksCompleted();
    taskView.renderTasks(tasksList)
})

