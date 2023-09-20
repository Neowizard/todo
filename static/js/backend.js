export async function sendTaskList(tasks, listId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
    };

    const response = await fetch(`http://${window.location.host}/todo/${listId}`, requestOptions);
    if (response.ok) {
        console.log('Task list sent successfully!');
    } else {
        console.error('Error sending task list:', response.status, response.statusText);
    }
    return response;
}

export async function fetchTasks(listId) {
    try {
        const response = await fetch(`http://${window.location.host}/todo/${listId}`);
        if (response.ok) {
            const tasks = await response.json();
            console.log(`Fetched tasks list ${listId} with ${tasks.length} items`);
            return tasks;
        } else {
            console.error(`Error fetching list ${listId}. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}
