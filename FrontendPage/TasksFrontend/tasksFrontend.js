let allTasks = [];

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to load tasks');

        allTasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('loadTasks failed:', error);
    }
}

function renderTasks() {
    const table = document.getElementById('tasksTable');
    const search = document.getElementById('taskSearch')?.value?.toLowerCase() || '';

    if (!table) return;

    const filtered = allTasks.filter((task) => String(task.title || '').toLowerCase().includes(search) || String(task.fileName || '').toLowerCase().includes(search));
    table.innerHTML = '';

    filtered.forEach((task) => {
        table.innerHTML += `
            <tr>
                <td>${task.title ?? ''}</td>
                <td>${task.fileName ?? ''}</td>
                <td>${task.assignedUser ?? ''}</td>
                <td>${task.status ?? ''}</td>
                <td>${task.deadline ? new Date(task.deadline).toLocaleString() : ''}</td>
                <td><button type="button">Open</button></td>
            </tr>`;
    });
}

const taskSearch = document.getElementById('taskSearch');
if (taskSearch) taskSearch.addEventListener('input', renderTasks);

loadTasks();
setInterval(loadTasks, 30000);