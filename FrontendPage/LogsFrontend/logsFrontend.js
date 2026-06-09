let allLogs = [];

async function loadLogs() {
    try {
        const response = await fetch('/api/logs');
        if (!response.ok) throw new Error('Failed to load logs');

        allLogs = await response.json();
        renderLogs();
    } catch (error) {
        console.error('loadLogs failed:', error);
    }
}

function renderLogs() {
    const table = document.getElementById('logsTable');
    const search = document.getElementById('logSearch')?.value?.toLowerCase() || '';

    if (!table) return;

    const filtered = allLogs.filter((log) => String(log.action || '').toLowerCase().includes(search) || String(log.user || '').toLowerCase().includes(search));
    table.innerHTML = '';

    filtered.forEach((log) => {
        table.innerHTML += `
            <tr>
                <td>${log.date ? new Date(log.date).toLocaleString() : ''}</td>
                <td>${log.user ?? ''}</td>
                <td>${log.action ?? ''}</td>
                <td>${log.target ?? ''}</td>
            </tr>`;
    });
}

const logSearch = document.getElementById('logSearch');
if (logSearch) logSearch.addEventListener('input', renderLogs);

loadLogs();
setInterval(loadLogs, 30000);