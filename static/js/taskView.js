const tasksUl = document.getElementById('taskList');

function addCheckEvents(taskLi, taskList, taskIdx) {
    const task = taskList.getTask(taskIdx);
    const checkbox = taskLi.querySelector(`#todo_${taskIdx}_check`);
    const span = taskLi.querySelector(`#todo_${taskIdx}_label`);

    const toggleTaskState = function () {
        taskList.toggleTaskCompletedState(taskIdx);
        task.completed ? span.classList.add('completed') : span.classList.remove('completed');
        taskLi.querySelector('input[type="checkbox"]').checked = task.completed;

    }

    span.addEventListener('click', toggleTaskState);
    checkbox.addEventListener('click', toggleTaskState);
}

function addDeleteEvents(taskLi, taskList, taskIdx) {
    const deleteBtn = taskLi.querySelector(`#todo_${taskIdx}_delete`);
    deleteBtn.addEventListener('click', () => {
        taskList.removeTask(taskIdx);
        taskLi.remove();
    });
}

function addEditEvents(taskLi, taskList, taskIdx) {
    const editBtn = taskLi.querySelector(`#todo_${taskIdx}_edit`);
    const editInput = document.createElement('input');
    const span = taskLi.querySelector(`#todo_${taskIdx}_label`);

    function applyEdit() {
        span.textContent = editInput.value;
        taskLi.replaceChild(span, editInput);
        taskList.editTaskTitle(taskIdx, span.textContent)
    }

    editBtn.addEventListener('click', () => {
        editInput.value = span.textContent;
        taskLi.replaceChild(editInput, span)
    });

    editInput.addEventListener('blur', applyEdit);
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            applyEdit();
        }
    });
}

function addDragDropEvents(taskLi, tasks) {
    taskLi.draggable = true;
    taskLi.addEventListener('dragstart', (e) => {
        const dragged = e.target.closest('li');
        const dragged_idx = Array.from(tasksUl.children).indexOf(dragged)
        e.dataTransfer.setData('text/plain', dragged_idx.toString());
    });

    taskLi.addEventListener('dragenter', (e) => {
        e.preventDefault();
        const dragged = e.target.closest('li');
        dragged.classList.add('drag-over');
    });

    taskLi.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragged = e.target.closest('li');
        dragged.classList.add('drag-over');
    });

    taskLi.addEventListener('dragleave', (e) => {
        const dragged = e.target.closest('li');
        dragged.classList.remove('drag-over');
    });

    taskLi.addEventListener('drop', (e) => {
        const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
        const drop = e.target.closest('li');
        const dropIdx = Array.from(tasksUl.children).indexOf(drop);
        drop.classList.remove('drag-over');

        console.log(`Swapping ${draggedIdx} and ${dropIdx}`)
        tasks.moveTask(draggedIdx, dropIdx);
        renderTasks(tasks);
    });
}

function createTaskLi(taskList, taskIdx) {
    const taskLi = document.createElement('li');
    const task = taskList.getTask(taskIdx);
    taskLi.id = `todo_${taskIdx}_li`
    taskLi.classList.add('taskLi');
    taskLi.innerHTML = `
      <button class="deleteBtn" id="todo_${taskIdx}_delete">Delete</button>
      <input type="checkbox" id="todo_${taskIdx}_check" ${task.completed ? 'checked' : ''}>
      <span class="${task.completed ? 'completed' : ''}" id="todo_${taskIdx}_label">${task.title}</span>
      <button class="editBtn" id="todo_${taskIdx}_edit">&#x270e;</button>
    `;

    addDeleteEvents(taskLi, taskList, taskIdx);
    addEditEvents(taskLi, taskList, taskIdx);
    addCheckEvents(taskLi, taskList, taskIdx);
    addDragDropEvents(taskLi, taskList);

    return taskLi;
}

export function renderTasks(taskList) {
    tasksUl.innerHTML = '';
    tasksUl.draggable = true;
    for (let i = 0; i < taskList.length(); i++) {
        const li = createTaskLi(taskList, i);

        tasksUl.appendChild(li);
    }
}
