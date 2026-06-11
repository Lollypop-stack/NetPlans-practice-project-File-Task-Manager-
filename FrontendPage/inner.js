function updateAccountLabel() {
    const currentUser = sessionStorage.getItem('ftm_currentUser') || 'Admin';
    const userLabel = document.getElementById('currentUser');
    if (userLabel) userLabel.textContent = currentUser;
}

function getStatusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value.includes('Завершёна') || value.includes('completed') || value.includes('Erledigt')) return 'status-completed';
    if (value.includes('В процессе') || value.includes('in progress') || value.includes('Aktiv')) return 'status-progress';
    if (value.includes('Заброшена') || value.includes('abandoned') || value.includes('Abgebrochen')) return 'status-abandoned';
}


async function loadDashboardData() {
    try {
        const [filesResponse, tasksResponse, logsResponse] = await Promise.all([
            fetch('/api/files'),
            fetch('/api/tasks'),
            fetch('/api/logs')
        ]);

        if (!filesResponse.ok || !tasksResponse.ok || !logsResponse.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const files = await filesResponse.json();
        const tasks = await tasksResponse.json();
        const logs = await logsResponse.json();
        const settings = JSON.parse(localStorage.getItem('ftm_settings') || '{}');

        document.getElementById('totalFiles').textContent = String(files.length ?? 0);
        document.getElementById('activeTasks').textContent = String(
            tasks.filter((task) => getStatusClass(task.status) === 'status-progress').length
        );
        document.getElementById('completedTasks').textContent = String(
            tasks.filter((task) => getStatusClass(task.status) === 'status-completed').length
        );
        document.getElementById('abandonedTasks').textContent = String(
            tasks.filter((task) => getStatusClass(task.status) === 'status-abandoned').length
        );

        const table = document.getElementById('taskTable');
        if (!table) return;

        table.innerHTML = '';

        tasks.forEach((task, index) => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${task.fileName ?? ''}</td>
                <td>${task.title ?? ''}</td>
                <td>${task.assignedUser ?? ''}</td>
                <td><span class="status-badge" style=" background-color: ${
                task.status === "Completed"
                    ? "#22c55e"
                    : task.status === "In Progress"
                    ? "#c5c222"
                    : task.status === "Abandoned"
                    ? "#6b7280"
                    : "#3b82f6"
            }; padding: 8px 12px; border-radius: 10px; color: white;">${task.status}</span></td>
                <td>${task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</td>
                <td><button type="button">Open</button></td>`;

            row.addEventListener('click', () => showTaskDetails(task));

            table.appendChild(row);
        });

        if (tasks.length) {
            showTaskDetails(tasks[0]);
        } else {
            showTaskDetails(null);
        }

        updateAccountLabel();

        console.info('Dashboard loaded:', { files: files.length, tasks: tasks.length, logs: logs.length });
    } catch (error) {
        console.error('loadDashboardData failed:', error);
    }
}


function showTaskDetails(task) {
    const detailFile = document.getElementById('detailFile');
    const detailUser = document.getElementById('detailUser');
    const detailStatus = document.getElementById('detailStatus');
    const detailModified = document.getElementById('detailModified');
    const detailDescription = document.getElementById('detailDescription');

    if (!task) {
        detailFile.textContent = '—';
        detailUser.textContent = '—';
        detailStatus.textContent = 'No task selected';
        detailModified.textContent = '—';
        detailDescription.textContent = 'Select a task from the table to see the details here.';
        return;
    }

    detailFile.textContent = task.fileName ?? '—';
    detailUser.textContent = task.assignedUser ?? '—';
    detailStatus.textContent = task.status ?? 'Open';
    detailModified.textContent = task.deadline ? new Date(task.deadline).toLocaleString() : '—';
}

window.addEventListener('DOMContentLoaded', () => {
    updateAccountLabel();

    loadDashboardData();
    setInterval(loadDashboardData, 30000);
});


