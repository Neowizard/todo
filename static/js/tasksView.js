const taskList = document.getElementById('taskList');

export function renderTasks(tasks) {
    taskList.innerHTML = '';
    taskList.draggable = true;
    for (let i = 0; i < tasks.length; i++) {
        const li = createTaskLi(tasks, i);

        taskList.appendChild(li);
    }
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

    addDragDropEvents(li, tasks);

    return li;
}

function addDragDropEvents(li, tasks) {
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
        arrayMoveInPlace(tasks, dragged_idx, drop_idx);
        renderTasks(tasks);
    });
}

function arrayMoveInPlace(arr, from, to) {
    const element = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, element);
}
