export class TaskList {
    constructor(tasks, uploadTasksList) {
        this.listLocked = false;
        this.tasks = tasks;
        this.uploadTasksList = uploadTasksList;
    }

    length() {
        return this.tasks.length;
    }

    equalTasks(otherTasks) {
        if (this.tasks.length !== otherTasks.length) {
            return false;
        }
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].title !== otherTasks[i].title || this.tasks[i].completed !== otherTasks[i].completed) {
                return false
            }
        }
        return true
    }

    equal(other) {
        if (other instanceof TaskList) {
            return this.equalTasks(other.tasks);
        }
        return false
    }

    getTask(taskIdx) {
        return {...this.tasks[taskIdx]};
    }

    mutate(operation) {
        this.listLocked = true;
        operation();
        this.uploadTasksList(this.tasks);
        this.listLocked = false;
    }

    addTask(task) {
        this.mutate(() => {
            this.tasks.push(task);
        });
    }

    deleteCompletedTasks() {
        this.mutate(() => {
            for (let i = this.tasks.length-1; i >= 0; i--) {
                if (this.tasks[i].completed) {
                    this.tasks.splice(i, 1);
                }
            }
        });
    }

    markAllTasksCompleted() {
        this.mutate(() => {
            for (let i = 0; i < this.tasks.length; i++) {
                this.tasks[i].completed = true;
            }
        });
    }

    toggleTaskCompletedState(taskIndex) {
        this.mutate(() => {
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        });
    }


    removeTask(taskIdx) {
        this.mutate(() => {
            this.tasks.splice(taskIdx, 1);
        });
    }

    editTaskTitle(taskIdx, title) {
        this.mutate(() => {
            this.tasks[taskIdx].title = title;
        });
    }

    moveTask(taskIndex, newIndex) {
        this.mutate(() => {
            const taskToMove = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            this.tasks.splice(newIndex, 0, taskToMove);
        });
    }

}