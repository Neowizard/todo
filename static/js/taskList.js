export class TaskList {
    constructor(tasks, uploadTasksList) {
        this.tasks = tasks;
        this.uploadTasksList = uploadTasksList;
        this.changed = false;
    }

    length() {
        return this.tasks.length;
    }

    addTask(task) {
        this.tasks.push(task);
        this.changed = true;
        this.uploadTasksList(this.tasks);
    }

    deleteCompletedTasks() {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].completed) {
                this.tasks.splice(i, 1);
            }
        }
        this.uploadTasksList(this.tasks);
    }

    markAllTasksCompleted() {
        for (let i = 0; i < this.tasks.length; i++) {
            this.tasks[i].completed = true;
        }
        this.uploadTasksList(this.tasks);
    }

    toggleTaskCompletedState(taskIndex) {
        this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        this.uploadTasksList(this.tasks);
    }

    getTask(taskIdx) {
        return this.tasks[taskIdx];
    }

    removeTask(taskIdx) {
        this.tasks.splice(taskIdx, 1);
        this.uploadTasksList(this.tasks);
    }

    editTaskTitle(taskIdx, title) {
        this.tasks[taskIdx].title = title;
        this.uploadTasksList(this.tasks);
    }

    moveTask(taskIndex, newIndex) {
        const taskToMove = this.tasks[taskIndex];
        this.tasks.splice(taskIndex, 1);
        this.tasks.splice(newIndex, 0, taskToMove);
        this.uploadTasksList(this.tasks);
    }

}