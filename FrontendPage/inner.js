function updateAccountLabel() {
    const currentUser = sessionStorage.getItem('ftm_currentUser') || 'Admin';
    const userLabel = document.getElementById('currentUser');
    if (userLabel) userLabel.textContent = currentUser;
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

        document.getElementById('totalFiles').textContent = String(files.length ?? 0);
        document.getElementById('activeTasks').textContent = String(
            tasks.filter((task) => String(task.status || '').toLowerCase() !== 'completed').length
        );
        document.getElementById('completedTasks').textContent = String(
            tasks.filter((task) => String(task.status || '').toLowerCase() === 'completed').length
        );
        document.getElementById('totalUsers').textContent = String(
            new Set([...(files.map((file) => file.modifiedBy)), ...(tasks.map((task) => task.assignedUser))]).size
        );

        const table = document.getElementById('taskTable');
        if (!table) return;

        table.innerHTML = '';

        tasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.dataset.taskId = String(task.id ?? index + 1);
            row.innerHTML = `
                <td>${task.title ?? 'Untitled task'}</td>
                <td>${task.fileName ?? ''}</td>
                <td>${task.assignedUser ?? ''}</td>
                <td><span class="status ${getStatusClass(task.status)}">${task.status ?? 'Open'}</span></td>
                <td>${task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</td>
                <td><button type="button" class="button">Open</button></td>
            `;

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

function getStatusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value.includes('Done') || value.includes('Completed') || value.includes('erledigt')) return 'status-completed';
    if (value.includes('In progress') || value.includes('Active') || value.includes('Aktiv')) return 'status-progress';
    if (value.includes('Abandoned') || value.includes('Cancelled') || value.includes('Abgebrochen'))
    return 'status-abandoned';
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
    setInterval(loadDashboardData, 3000);
});

document.addEventListener('DOMContentLoaded', () => {

    const menuButton = document.querySelector('.menu-toggle');
    const closeButton = document.querySelector('.mobile-nav-close');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');

    function openMenu() {
        mobileNav.classList.remove('hidden');
        overlay.classList.add('active');

        menuButton?.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        mobileNav.classList.add('hidden');
        overlay.classList.remove('active');

        menuButton?.setAttribute('aria-expanded', 'false');
    }

    menuButton?.addEventListener('click', openMenu);
    closeButton?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });

});
